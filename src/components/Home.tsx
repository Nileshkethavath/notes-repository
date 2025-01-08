import { Typography, TextField, Box, Stack, Tooltip, Zoom, Button } from '@mui/material'
import React, { Fragment, useEffect, useRef, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import LockIcon from '@mui/icons-material/Lock';
import EditNoteIcon from '@mui/icons-material/EditNote';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import './Home.css'
import ModalComponent from './ModalComponent';
import { createOrUpdateNote, getOrCreate, updateNote } from '../utils/databaseFunctions';
import generateID from '../utils/generateID';
import { useDebounce } from '../custom-hooks/useDebounce';
import AutoCloseToast from './ToastComponent';
import { useToastContext } from './ToastContext';


export function Home() {

  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [noteTitle, setNoteTitle] = useState('')
  const [note, setNote] = useState<string>('')
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [changeUrlModalOpen, setChangeUrlModalOpen] = useState(false)
  const [password, setPassword] = useState('');
  const [saved, setSaved] = useState(false);
  const toastContext = useToastContext();
  

  const debouncedNote = useDebounce(note, 100);
  const debouncedNoteTitle = useDebounce(noteTitle, 100);
  const quillRef = useRef<ReactQuill | null>(null);

  const modules = {
    toolbar: {
      container: '#custom-toolbar'
    },
  };

  const toolbarButtons = [
    { className: 'ql-bold', label: 'Bold', },
    { className: 'ql-italic', label: 'Italic' },
    { className: 'ql-underline', label: 'Underline' },
    { className: 'ql-strike', label: 'Strikethrough' },

    { className: 'ql-header', value: '1', label: 'Header 1' },
    { className: 'ql-header', value: '2', label: 'Header 2' },

    { className: 'ql-blockquote', label: 'Blockquote' },
    { className: 'ql-code-block', label: 'Code Block' },

    { className: 'ql-list', value: 'ordered', label: 'Ordered List' },
    { className: 'ql-list', value: 'bullet', label: 'Bullet List' },

    { className: 'ql-indent ql-indent1', value: '-1', label: 'Indent -' },
    { className: 'ql-indent ql-indent2', value: '+1', label: 'Indent +' },

    { className: 'ql-align', value: '', label: 'Align Left' },
    { className: 'ql-align', value: 'center', label: 'Align Center' },
    { className: 'ql-align', value: 'right', label: 'Align Right' },
    { className: 'ql-align', value: 'justify', label: 'Justify' },

    { className: 'ql-link', label: 'Insert Link' },
    { className: 'ql-image', label: 'Insert Image' },
    { className: 'ql-video', label: 'Insert Video' },

    { className: 'ql-color', label: 'Text Color' },
    { className: 'ql-background', label: 'Background Color' },

    { className: 'ql-script', value: 'sub', label: 'Subscript' },
    { className: 'ql-script', value: 'super', label: 'Superscript' },

    { className: 'ql-clean', label: 'Clear Formatting' },
  ];

  const formats = [
    'bold',
    'italic',
    'underline',
    'strike',
    'header',
    'blockquote',
    'code-block',
    'list',
    'bullet',
    'indent',
    'align',
    'link',
    'image',
    'video',
    'color',
    'background',
    'script',
  ];

  const titleChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNoteTitle(event.target.value)
  }

  const newNoteHandler = () => {
    
    const url = generateID();
    setNoteTitle('')
    setNote('')
    setPassword('')
    navigate(`/${url}`, {replace:true})

    createOrUpdateNote({
      url ,
      note : '',
      noteTitle : '',
      createdAt : new Date().toISOString(),
      password : '',
    })
    toastContext?.setToast(true, 'New note created successfully...!')

  }


  const getOrCreateFun = async () =>{ 
      const obj = await getOrCreate(id);
      
      if(obj.isDataExist){
        setNote(obj.data.note);
        setNoteTitle(obj.data.noteTitle)
        setPassword(obj.data.password)
      }
  }


  useEffect(()=>{
    const timer = setTimeout(()=>{
      setSaved(false)
    },500)

    return ()=> clearTimeout(timer);
  }, [saved])


  useEffect(()=>{
    updateNote(id, {note: note})
      .then(()=>{
        setSaved(true);
      })
  },[debouncedNote])


  useEffect(()=>{
    updateNote(id, {noteTitle: noteTitle})
    .then(()=>{
      setSaved(true);
    })
  },[debouncedNoteTitle])
  

  useEffect(()=>{
    getOrCreateFun();    
  },[])

  useEffect(() => {

    const qlPickerLabel = document.getElementsByClassName("ql-picker-label");

    qlPickerLabel[0].addEventListener('mouseover', () => {
      const qlColor = document.getElementsByClassName('ql-color');
      qlColor[0].classList.add('custom-color');
    })

    qlPickerLabel[0].addEventListener('mouseout', () => {
      const qlColor = document.getElementsByClassName('ql-color');
      qlColor[0].classList.remove('custom-color');
    })

    qlPickerLabel[1].addEventListener('mouseover', () => {
      const qlColor = document.getElementsByClassName('ql-background');
      qlColor[0].classList.add('custom-color');
    })

    qlPickerLabel[1].addEventListener('mouseout', () => {
      const qlColor = document.getElementsByClassName('ql-background');
      qlColor[0].classList.remove('custom-color');
    })

  }, [])

  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const editorElement = editor.root;

      editorElement.setAttribute('spellcheck', 'false');
    }
  }, []);

  useEffect(() => {
    const images = document.querySelectorAll('img');
    const attached = 'clickEventAttached'

    Array.from(images).forEach((img) => {
      if (!img.getAttribute(attached)) {
        img.setAttribute(attached, 'true')

        img.addEventListener('click', (e: MouseEvent) => {
          

          if (e.target instanceof HTMLImageElement) {
            const anchorElement = document.createElement('a');
            anchorElement.href = e.target?.src
            anchorElement.download = 'image';
            anchorElement.click();
          }
        })
      }
    })
  }, [note])


  const getCustomToolBarButton = (button: { label: string, className: string, value?: string | undefined }) => {
    return (
      <Tooltip title={button.label} placement='top' key={button.label}>

        <Button
          key={button.className}
          className={button.className}
          aria-label={button.label}
          value={button?.value}
          disableRipple
          sx={{
            minWidth: '24px',
            width: "24px !important",
            padding: "8px !important",
            boxSizing: "content-box",
            '& svg > *': {
              stroke: '#06c !important',
            },
            '& svg > .ql-fill': {
              fill: '#06c !important',
              strokeWidth: "0px"
            },
            '&.ql-blockquote svg > .ql-fill': {
              strokeWidth: "1.5px !important",
            },
            '&.ql-indent svg > .ql-fill': {
              strokeWidth: "1.5px !important"
            },
            '& svg > .ql-transparent': {
              opacity: 'unset'
            },
            '&.ql-active': {
              backgroundColor: "#cbeaf6 !important"
            },
            '&:hover': {
              backgroundColor: "#cbeaf6 !important"
            }
          }}

        >
        </Button>
      </Tooltip>

    )
  }


  return (
    <Stack
      sx={{
        width: '100vw',
        height: '100vh',
        boxSizing: 'border-box',
        backgroundColor: '#00000012'
      }}
      py={5}
      px={20}
      gap={2}
    >
      <Box
        sx={(theme) => ({
          display: 'flex',
          gap: theme.spacing(1),
          padding: theme.spacing(2),
          backgroundColor: 'white',
          boxShadow: '0px 0px 5px -2px',
          borderRadius: '8px'
        })}
      >
        <Typography
          variant='h5'
          fontWeight={'700'}
          letterSpacing={'-1px'}
          px={3}
        >
          C Notes
          <EditNoteIcon
            sx={(theme) => ({
              verticalAlign: 'middle',
              paddingLeft: theme.spacing(1),
              fontSize: '2.5rem',
              color: saved ? '#228B22' : 'black',
              transition: 'all 100ms'
            })}
          />
        </Typography>

        <Box
          sx={(theme) => ({
            flexGrow: 1,
            display: 'inline-flex',
            gap: theme.spacing(1),
            justifyContent: 'center',
            height: theme.spacing(5)
          })}
        >
          <TextField
            type='text'
            placeholder='Name Your Note'
            fullWidth

            sx={(theme) => ({
              height: theme.spacing(5),
              border: '0px',
              boxShadow: '0px 0px 3px #0000007a',
              '& .MuiOutlinedInput-root': {
                height: theme.spacing(5),
                '& input': {
                  height: theme.spacing(5),
                  boxSizing: 'border-box',
                  textTransform: 'capitalize',
                },
                '& input:focus + fieldset, & input:hover + fieldset': {
                  // border: '2px solid rgb(25, 118, 210)'
                  boxShadow: '0px 0px 3px #0000007a'
                },
              },
              '& fieldset': {
                padding: '0px',
                border: '0px'
              }
            })}

            value={noteTitle}
            onChange={titleChangeHandler}
          />
        </Box>

        <Box sx={(theme) => ({
          display: 'inline-flex',
          gap: theme.spacing(1),
          justifyContent: 'right',
          height: theme.spacing(5)
        })}>


          <Tooltip
            title='new note'
            arrow
            slots={{
              transition: Zoom
            }}
          >

            <Box
              sx={{
                height: '100%',
                display: "flex",
                alignItems: "center",
                boxSizing: 'border-box'
              }}
            >
              <Button
                variant='text'
                disableRipple
                sx={{
                  height: "100%",
                  width: '50px',
                  minWidth: "50px",
                  padding: '0px',
                  '&:active': {
                    backgroundColor: 'lightsteelblue'
                  },
                  '&:hover': {
                    backgroundColor: '#cbeaf6'
                  }
                }}

                onClick={newNoteHandler}
              >
                <AddIcon sx={{
                  width: '50px'
                }} />
              </Button>
            </Box>
          </Tooltip>


          <Tooltip
            title='edit url'
            arrow
            slots={{
              transition: Zoom
            }}
          >

            <Box
              sx={{
                height: '100%',
                display: "flex",
                alignItems: "center",
                boxSizing: 'border-box'
              }}
            >
              <Button
                variant='text'
                disableRipple
                sx={{
                  height: "100%",
                  width: '50px',
                  minWidth: "50px",
                  padding: '0px',
                  '&:active': {
                    backgroundColor: 'lightsteelblue'
                  },
                  '&:hover': {
                    backgroundColor: '#cbeaf6'
                  }
                }}

                onClick={()=>setChangeUrlModalOpen(true)}
              >
                <EditOutlinedIcon sx={{
                  width: '50px'
                }} />
              </Button>
            </Box>
          </Tooltip>

          <ModalComponent
            modalOpen={changeUrlModalOpen} 
            setModalOpen={setChangeUrlModalOpen}
            url={id}
            value={id}
            label={'Enter your URL'} 
            placeholder={'RickysUrl'} 
            Icon={EditOutlinedIcon} 
            title={'Change URL'}
            name={'changeUrl'}
          />


          <Tooltip
            title='password'
            arrow
            slots={{
              transition: Zoom
            }}
          >

            <Box
              sx={{
                height: '100%',
                display: "flex",
                alignItems: "center",
                boxSizing: 'border-box'
              }}
            >
              <Button
                variant='text'
                disableRipple
                sx={{
                  height: "100%",
                  width: '50px',
                  minWidth: "50px",
                  padding: '0px',

                  '&:active': {
                    backgroundColor: 'lightsteelblue'
                  },
                  '&:hover': {
                    backgroundColor: '#cbeaf6'
                  }
                }}

                onClick={() => setPasswordModalOpen(true)}
              >
                <LockIcon />
              </Button>
            </Box>
          </Tooltip>


          <ModalComponent
            modalOpen={passwordModalOpen} 
            setModalOpen={setPasswordModalOpen} 
            url={id}
            value={''}
            setValue={setPassword}
            label={'Enter your password'} 
            placeholder={'Ricky_Dave@123'} 
            Icon={LockIcon} 
            title={'Password Protect'}
            name={'password'}
          />


        </Box>
      </Box>

      <Box flex={1}
        sx={{
          backgroundColor: 'white',
          borderRadius: "8px",
          display: "flex",
          flexDirection: 'column',
          boxShadow: "0px 0px 5px -2px",
          maxHeight: 'calc(100vh - 168px) !important',
        }}
      >

        <Box id="custom-toolbar" display={'flex'} flexWrap={'wrap'}>
          {toolbarButtons.map((btn) => (
            <Fragment  key={btn.label}>
              {(btn.className === 'ql-color' || btn.className === 'ql-background') ?
                <Tooltip title={btn.label} placement='top'>
                  <Box sx={{ width: "40px", height: "40px", position: "relative" }}>

                    {getCustomToolBarButton(btn)}

                    <select className={btn.className}
                      style={{ position: 'absolute', top: "50%", left: "50%", transform: 'translate(-50%,-50%)' }} />

                  </Box>
                </Tooltip>
                :
                <>
                  {getCustomToolBarButton(btn)}
                </>

              }
            </Fragment>
          ))}


        </Box>

        <ReactQuill
          value={note}
          onChange={setNote}
          modules={modules}
          formats={formats}
          ref={quillRef}
          style={{
            height: "100%"
          }}
        />

      </Box>

      

    </Stack>
  )
}

export default Home
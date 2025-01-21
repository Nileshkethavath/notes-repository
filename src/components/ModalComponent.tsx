import { Box, Button, CircularProgress, Divider, FormHelperText, InputLabel, Modal, TextField, Typography } from '@mui/material'
import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { SvgIconProps } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { hashPassword } from '../utils/password';
import { useToastContext } from './ToastContext';
import { webSocket } from '../utils/webSocket';

export const ModalComponent = (
    { modalOpen, setModalOpen, url, value, setValue, label, placeholder, Icon, title, name }:
        {
            modalOpen: boolean, setModalOpen: Dispatch<SetStateAction<boolean>>, url: string, value?: string,
            setValue?: Dispatch<SetStateAction<string>>, label: string, placeholder: string, Icon: React.FC<SvgIconProps>,
            title: string, name: string
        }
    ) => {

    const [data, setData] = useState(value || '')
    const [error, setError] = useState(false);
    const [errorStates, setErrorStates] = useState([true, true, true, true])
    const [urlexist, setUrlExist] = useState(false)
    const [showError, setShowError] = useState(false);
    const [pending, setPending] = useState(false);
    const {id = ''} = useParams();
    
    const auth = useAuth()
    const toastContext = useToastContext()
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    const color = '#d32f2f'


    const handleClose = (event: React.MouseEvent, reason: "backdropClick" | "escapeKeyDown") => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
        }

        setModalOpen(false)
    };

    const createHandler = () => {
        setShowError(false)
        if (name === 'changeUrl') {
            if (!(error && (data != url))) {
                setPending(true)
                webSocket.emit('getNote', data);
                
            }
        } else if (name === 'password') {
            //hash password before storing it to DB
            hashPassword(data).then((res)=>{
                setPending(true);
                webSocket.emit('updateNotePassword', url, { password: res });
            })

            
        }
    }

    const errorHandler = (value: string) => {
        let newErrorStates

        if (name === 'changeUrl') {
            newErrorStates = errorStates.slice(0, 2).map((state, index) => {
                switch (index) {
                    case 0:
                        return value.length >= 8 ? true : false;
                    case 1:
                        return /(?=.*[a-zA-Z0-9])/.test(value);
                    default:
                        return false;
                }
            })

        } else {
            newErrorStates = errorStates.map((state, index) => {
                switch (index) {
                    case 0:
                        return value.length >= 8 ? true : false;
                    case 1:
                        return /(?=.*[a-z])(?=.*[A-Z])/.test(value);
                    case 2:
                        return /(?=.*[0-9])/.test(value);
                    case 3:
                        return name != 'changeUrl' ? /(?=.*[!@#$%^&*(),.?":{}|<>_\[\]\\\/\-+=~`])/.test(value) : false;
                    default:
                        return false;
                }
            })
        }

        return newErrorStates;
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setData(value);

        const newState = errorHandler(value);
        const tempError = newState.reduce((acc, curr) => (acc && curr), true)
        setErrorStates(() => ([...newState]))
        setError(!tempError)
        if (name === 'changeUrl') {
            setUrlExist(false)
        }
    }

    const removePassword = () =>{
        webSocket.emit('removeNotePassword', url, { password: '' });
        auth?.setHasPassword(false);
        setData('');
    }

    useEffect(()=>{
        const getNoteResponseHandler = (res: {
            isNoteExist: boolean;
            note: null | any;
        }) => {
            console.log(res)
            setPending(false)
            if (res.isNoteExist) {
                setUrlExist(true);
            } else {
                setUrlExist(false);
                setPending(true);
                webSocket.emit('updateNoteKey',url, data);
            }
        }
        const updateNoteKeyResponseHandler = () => {
            setPending(false);
            navigate(`/${data}`);
            setModalOpen(false);
            toastContext?.setToast(true, 'URL updated successfully');
        }
        const updateNotePasswordResponseHandler = () => {
            setPending(false)
            setModalOpen(false)
            toastContext?.setToast(true, 'Password created successfully')
            auth?.setHasPassword(true);
            auth?.setIsAuthenticated(true);
        }

        // if(name === 'changeUrl'){
            webSocket.on('getNoteResponse', getNoteResponseHandler)
            webSocket.on('updateNoteKeyResponse', updateNoteKeyResponseHandler)
        // }
        // else{
            webSocket.on('updateNotePasswordResponse', updateNotePasswordResponseHandler)
        // }

        return () => {
            webSocket.off('getNoteResponse', getNoteResponseHandler)
            webSocket.off('updateNoteKeyResponse', updateNoteKeyResponseHandler);
            webSocket.off('updateNotePasswordResponse', updateNotePasswordResponseHandler);
        }
    }, [])

    useEffect(()=>{
        setUrlExist(false);
    }, [id])

    useEffect(() => {
        if (modalOpen) {
            setTimeout(() => {
                inputRef.current?.focus()
                inputRef.current?.select()
            }, 0);
        }

    }, [modalOpen])

    useEffect(() => {
        if (error) {
            setShowError(true)
        }
    }, [error])

    //this is used to set the updated prop value to state, 
    // if this is not done then state won't be updated.
    useEffect(() => {
        setData(value || '');
    }, [value]);

    return (
        <>
            <Modal
                open={modalOpen}
                onClose={handleClose}
                sx={{
                    '& .MuiBackdrop-root': {
                        backgroundColor: 'rgb(0 0 0 / 25%)'
                    }
                }}
            >
                <Box display={'flex'}
                    alignContent={'center'}
                    justifyContent={'center'}
                    flexWrap={'wrap'}
                    height={'100%'}
                    width={'100%'}
                >
                    <Box
                        sx={(theme) => ({
                            width: '450px',
                            backgroundColor: "white",
                            borderRadius: '4px',
                            animation: 'jump 600ms ease-out',
                            boxShadow: '0px 2px 10px -2px black',
                            '@keyframes jump': {
                                '0%, 100%': { transform: 'scale(1)' },
                                '15%': { transform: 'scale(1.04)' },
                                '30%': { transform: 'scale(1)' },
                                '45%': { transform: 'scale(1.03)' },
                                '60%': { transform: 'scale(1)' },
                                '75%': { transform: 'scale(1.01)' },
                                '90%': { transform: 'scale(1)' },
                            },
                            '@media (max-width: 450px)':{
                                width:'90%'
                            }
                        })}
                    >

                        {
                            (auth?.hasPassword && name === 'password') ?
                                <>
                                    <Typography
                                        variant='h5'
                                        p={2}
                                        bgcolor={'#f4f4f4'}

                                    >
                                        <Icon
                                            sx={{
                                                verticalAlign: 'text-top'
                                            }}
                                        />
                                        {'Remove Password'}
                                    </Typography>

                                    <Divider />
                                    
                                    <Box p={2}>
                                        <Typography>Existing password found. Would you like to remove it?</Typography>
                                    </Box>

                                    <Divider />

                                    <Box p={2} display={'flex'} gap={2} bgcolor={'#f4f4f4'}>
                                        <Button variant='outlined' onClick={() => auth.logout(url)} >Logout</Button>
                                        <Box flex={1} display={'flex'} gap={2} justifyContent={'end'}>
                                            <Button variant='outlined' onClick={removePassword} >Yes</Button>
                                            <Button variant='contained' onClick={() => setModalOpen(false)}>No</Button>
                                        </Box>
                                    </Box>

                                </> :

                                <>
                                    <Typography
                                        variant='h5'
                                        p={2}
                                        bgcolor={'#f4f4f4'}
                                        sx={{'@media (max-width: 450px)':{
                                            padding:'8px',
                                            fontSize:"1.2rem"
                                        }}} 
                                    >
                                        <Icon
                                            sx={{
                                                verticalAlign: 'text-top',
                                               '@media (max-width: 450px)':{
                                                    fontSize:"1.4rem"
                                                }
                                            }}
                                        />
                                        {title}
                                    </Typography>

                                    <Divider />

                                    <Box p={2} sx={{'@media (max-width: 450px)':{
                                                    padding:'8px'
                                                }}}>
                                        <InputLabel htmlFor={name}>{label}</InputLabel>
                                        <TextField
                                            id={name}
                                            type={name === 'changeUrl' ? 'text' : 'password'}
                                            fullWidth
                                            placeholder={`e.g: ${placeholder}`}
                                            error={error}
                                            sx={{ 
                                                py: '8px',
                                                '@media (max-width: 450px)':{
                                                    '& .MuiInputBase-root': {
                                                        height: 40, 
                                                    },
                                                    
                                                } 
                                            }}
                                            value={data}
                                            inputRef={inputRef}
                                            onChange={handleChange}
                                            onTransitionEnd={() => {
                                                inputRef.current?.focus()
                                                inputRef.current?.select()
                                            }}
                                        
                                        />


                                        {showError &&
                                            <FormHelperText>
                                                <ul>
                                                    <li style={{ color: errorStates[0] ? 'green' : 'red' }}>Must be at least 8 characters long.</li>
                                                    <li style={{ color: errorStates[1] ? 'green' : 'red' }}>
                                                        {
                                                            name === 'password' ? 'Must Include at least one uppercase and lowercase letter.' : 'Must Include only letters and numbers.'
                                                        }
                                                    </li>
                                                    {name === 'password' && <li style={{ color: errorStates[2] ? 'green' : 'red' }}>Must Include at least one number.</li>}
                                                    {name === 'password' && <li style={{ color: errorStates[3] ? 'green' : 'red' }}>Must Include at least one special character.</li>}
                                                </ul>
                                            </FormHelperText>
                                        }
                                        {
                                            (name === 'changeUrl' && urlexist) &&
                                            <FormHelperText sx={{ color: color }}>
                                                Note Id already exist
                                            </FormHelperText>
                                        }

                                    </Box>

                                    <Divider />

                                    <Box p={2} display={'flex'} justifyContent={'end'} gap={2} bgcolor={'#f4f4f4'}>
                                        <Button variant='outlined' sx={{width:'91px'}} onClick={createHandler} disabled={(data == value) || error || urlexist || pending}>{pending ? <CircularProgress size={25} /> : 'Create'}</Button>
                                        <Button variant='contained' onClick={() => setModalOpen(false)}>Cancel</Button>
                                    </Box>
                                </>
                        }

                    </Box>
                </Box>
            </Modal>


        </>
    )
}

export default ModalComponent
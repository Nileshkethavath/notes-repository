import { EditNote } from '@mui/icons-material'
import { Box, Button, FormHelperText, Stack, TextField, Typography } from '@mui/material'
import { useAuth } from './AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import {useForm} from 'react-hook-form'
import { useEffect, useState } from 'react'

export const Login = () => {
    const {id = ''} = useParams()
    const auth = useAuth()
    const [valid, setValid] = useState(false)
    const navigate = useNavigate()
    const {register, handleSubmit, watch} = useForm<{password: string}>()

    const passwordWatch = watch('password');

    useEffect(()=>{
        if(valid){
            setValid(false)
        }
    }, [passwordWatch])

    const submitHandler = (data: {password: string}) => {
        if(auth){
            auth.login(id, data.password).then((res)=>{
                if(!res){
                    setValid(true);
                }else{
                    setValid(false)
                    console.log('success')
                    navigate(`/${id}`, {replace: true});
                }
            })
        }
    }

    return (
        <Stack sx={{
            height: '100vh', width: '100vw', justifyContent: 'center',
            alignItems: 'center', backgroundColor: '#ededed'
        }}>
            <form onSubmit={handleSubmit(submitHandler)}>
                <Box sx={{ width: '100%', maxWidth: '450px', 
                        backgroundColor: 'white', borderRadius: '4px', 
                        boxShadow: '0px 2px 10px -2px black', padding: '16px' 
                        }}>
                    <Typography
                        variant='h6'
                        fontWeight={'700'}
                    >
                        C Notes
                        <EditNote
                            sx={() => ({
                                verticalAlign: 'middle',
                                fontSize: '2rem'
                            })}
                        />
                    </Typography>
                    <Box>
                        <TextField
                            label='Enter password...'
                            type='password'
                            fullWidth
                            sx={{
                                margin: '16px 0'
                            }}
                            error={valid}
                            {...register('password')}
                        >
                        </TextField>

                        <Button variant='contained' type='submit' fullWidth sx={{padding:'10px'}}>Login</Button>
                    </Box>
                    <FormHelperText  sx={{color:'red', textAlign:'center', marginTop:'8px', fontWeight:"600"}}>
                        {valid && "Incorrect Password"}
                    </FormHelperText>
                </Box>
            </form>
        </Stack>
    )
}

export default Login
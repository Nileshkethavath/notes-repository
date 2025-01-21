import React, { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from './AuthContext';
import { webSocket } from '../utils/webSocket'

const ProtectedRoute = (props: {componentType: string, Component: React.FC}) => {
    const auth = useAuth();
    const {id = ''} = useParams();
    const [checking, setChecking] = useState(true)
    const {componentType, Component} = props;

    function validatePattern() {
        return (id && /[A-Za-z0-9]{8,25}/.test(id));
    }

    useEffect(()=>{
        const checkNoteResponseHandler = (res: {isNoteExist: boolean, hasPassword: boolean}) => {
            setChecking(false);
            if(res.isNoteExist){
                auth?.setNewNote(false);
                auth?.setHasPassword(res.hasPassword ? true : false);
                auth?.setIsAuthenticated(res.hasPassword ? false : true);
            }else{
                auth?.setNewNote(true);
                auth?.setHasPassword(false);
                auth?.setIsAuthenticated(true);
            }
        }

        if(!validatePattern()){
            auth?.setIsValid(false)
            setChecking(false);
        }else{
            auth?.setIsValid(true);

            webSocket.emit('checkNote', id);

            webSocket.on('checkNoteResponse', checkNoteResponseHandler)
        }

        return () =>{
            webSocket.off('checkNoteResponse', checkNoteResponseHandler)
        }
            
    }, [id])

    const redirectHandler = (type: string) => {
        if(auth){
            const {newNote, hasPassword, isAuthenticated} = auth;
            if(newNote){
                return type === 'home' ? <Component/> : <Navigate to={`/${id}`} replace/>
            }else{
                if(hasPassword){
                    if(isAuthenticated){
                        return type === 'home' ? <Component/> : <Navigate to={`/${id}`} replace/>
                    }else{
                        return type === 'home' ? <Navigate to={`/login/${id}`} replace/> : <Component/>
                    }
                }else{
                    return type === 'home' ? <Component/> : <Navigate to={`/${id}`} replace/>
                }
            }
        }
    }

        if(checking){
            return (
                <div style={{ display: 'flex', justifyContent: 'center', 
                              alignItems: 'center', height: '100vh', 
                              backgroundColor:"rgb(0 0 0 / 10%)" }}>
                    <CircularProgress  />
                </div>
            )
        }else{
            if (!auth?.isValid) {
                return <Navigate to={'/invalid'} replace />;
            }

            return redirectHandler(componentType);
        }

    


}

export default ProtectedRoute
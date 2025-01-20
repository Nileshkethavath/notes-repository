import React, { useEffect, useState } from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from './AuthContext';
import { webSocket } from '../utils/webSocket'

const ProtectedRoute = (props: {componentType: string, Component: React.FC}) => {
    const auth = useAuth();
    const {id = ''} = useParams();
    const [checking, setChecking] = useState(true)
    const {componentType, Component} = props;
    console.log(auth);

    function validatePattern() {
        return (id && /[A-Za-z0-9]{8,25}/.test(id));
    }

    useEffect(()=>{
            
                if(!validatePattern()){
                    auth?.setIsValid(false)
                    console.log('auth', id, true)
                }else{
                    console.log('auth', id, false)
                    auth?.setIsValid(true);
    
                    webSocket.emit('checkNote', id);
    
                    webSocket.on('checkNoteResponse', (res) => {
                        setChecking(false);
                        console.log('respone', res)
                        if(res.isNoteExist){
                            auth?.setNewNote(false);
                            auth?.setHasPassword(res.hasPassword ? true : false);
                            auth?.setIsAuthenticated(res.hasPassword ? false : true);
                        }else{
                            auth?.setNewNote(true);
                            auth?.setHasPassword(false);
                            auth?.setIsAuthenticated(true);
                        }
                    })
                }
            
        }, [id])


    const redirectHandler = (type: string) => {
        if(auth){
            const {newNote, hasPassword, isAuthenticated} = auth;
            if(newNote){
                return type === 'home' ? <Component/> : <Navigate to={`/${id}`}/>
            }else{
                if(hasPassword){
                    if(isAuthenticated){
                        return type === 'home' ? <Component/> : <Navigate to={`/${id}`}/>
                    }else{
                        return type === 'home' ? <Navigate to={`/login/${id}`} /> : <Component/>
                    }
                }else{
                    return type === 'home' ? <Component/> : <Navigate to={`/${id}`}/>
                }
            }
        }
    }

    // if(!network.isOnline){
    //     return <OfflineComponent/>
    // }

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


/*

newNote = false => /home
hasPassword = true;
isAuthenticated = true;

-> home
    check for exist => show => loading
        -> yes
            -> password
                -> yes => redirect /login
                -> no => same
        -> no
            -> same

-> login


    check for exist => show => loading
        -> yes
            -> password
                -> yes => same 
                            -> valid => redirect /home
                            -> invalid => same page
                -> no => redirect /home
        -> no
            -> redirect /home




    

*/
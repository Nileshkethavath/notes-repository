import { useEffect, useState } from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import { getNote } from '../utils/databaseFunctions';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from './AuthContext';

const ProtectedRoute = (props: {componentType: string, Component: React.FC}) => {
    const {id = ''} = useParams();
    const location = useLocation()
    const [redirect, setRedirect] = useState<string | null>(null)
    const [checking, setChecking] = useState(true)
    const auth = useAuth();
    console.log('protected route');

    function validatePattern() {
        return (id && /[A-Za-z0-9]{8,25}/.test(id));
    }
    const redirectFunction = (comp: string, url1:string | null, url2: string | null) => {
            props.componentType.match(`${comp}`) ?
            setRedirect(url1) :
            setRedirect(url2)
    }

    useEffect(()=>{
        setRedirect(null);
    },[location.pathname])

    useEffect(()=>{
        
            if(!validatePattern()){
                setRedirect('/invalid')
                setChecking(false)
            }else{
                getNote(id).then((res)=>{
                    setChecking(false)
                    if(res.isDataExist){
                        auth?.setNewNote(false);
                        if(res.data.password){
                            auth?.setHasPassword(true)
                            redirectFunction('home', `/login/${id}`, null)
                        }else{
                            auth?.setHasPassword(false)
                            redirectFunction('home', null, `/${id}`)
                        }
                    }else{
                        auth?.setNewNote(true);
                        redirectFunction('home', null, `/${id}`)
                    }
                })
            }
        
    }, [])

    // if(!network.isOnline){
    //     return <OfflineComponent/>
    // }

    if((props.componentType === 'home') && ((auth?.isAuthenticated || auth?.newNote || ((auth?.newNote === false) && !auth.hasPassword)) )){
        const {Component} = props;
        return <Component/>
    }

    if((props.componentType === 'login') && ((auth && (( auth.newNote === false) && (auth.hasPassword && !auth.isAuthenticated))) )){
        const {Component} = props;
        return <Component/>
    }

    if(!checking){
        const {Component} = props;
        console.log('4',redirect)

        if(redirect){
            return <Navigate to={redirect} replace={true}/>
        }else{
            return <Component/>
        }
    }else{
        return (
            <div style={{ display: 'flex', justifyContent: 'center', 
                          alignItems: 'center', height: '100vh', 
                          backgroundColor:"rgb(0 0 0 / 10%)" }}>
                <CircularProgress  />
            </div>
        );
    }


}

export default ProtectedRoute


/*

newNote = false => /home
hasPassword = true;
isAuthenticated = true;

-> home
    check for exist
        -> yes
            -> password
                -> yes => redirect /login
                -> no => same
        -> no
            -> same

-> login

    if(isAuthenticated || newNote || (newNote != null && !hasPassword)){
        <home/>
    }

    if((newNote != null && (hasPassword && !isAuthenticated)){
        <login/>
    }


    check for exist
        -> yes
            -> password
                -> yes => same 
                            -> valid => redirect /home
                            -> invalid => same page
                -> no => redirect /home
        -> no
            -> redirect /home



*/
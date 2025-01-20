import React, { Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { verifyPassword } from '../utils/password';
import { authNameSpace, webSocket } from '../utils/webSocket';


interface AuthContextType {
    login: (url: string, password: string) => Promise<boolean>;
    logout: (url: string) => void;
    isAuthenticated: boolean;
    setIsAuthenticated: Dispatch<SetStateAction<boolean>>
    newNote: boolean | null;
    setNewNote: Dispatch<SetStateAction<boolean | null>>
    hasPassword: boolean | null;
    setHasPassword: Dispatch<SetStateAction<boolean | null>>;
    setIsValid: Dispatch<SetStateAction<boolean | null>>;
    isValid: boolean | null;
    setPending: Dispatch<SetStateAction<boolean>>;
    pending: boolean | null;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);

export const useAuth = () => useContext(AuthContext);


export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const [newNote, setNewNote] = useState<boolean | null>(null);
    const [hasPassword, setHasPassword] = useState<boolean | null>(null);
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [pending, setPending] = useState(false);
    


    const login = (url: string, password: string) => {
        authNameSpace.emit('getNote', url);
        
        return new Promise<boolean>((resolve, reject) => {
            authNameSpace.on('getNoteResponse', async (data) => {
                let isMatch = await verifyPassword(password, data.note.password);
    
                if(data.isNoteExist && isMatch){
                    setIsAuthenticated(true)
                    setHasPassword(true)
                    resolve(true);
                }else{
                    setIsAuthenticated(false)
                    resolve(false);
                }
    
            })
        })
    }

    const logout = (url: string) => {
        // localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        navigate(`/login/${url}`, {replace: true});
            
    }

    return (
        <AuthContext.Provider value={{login, logout, isAuthenticated, setIsAuthenticated, newNote, setNewNote, hasPassword, setHasPassword, isValid, setIsValid, pending, setPending}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider



/*

-> haspassword
            -> authenticated
                -> yes
                    ->


*/
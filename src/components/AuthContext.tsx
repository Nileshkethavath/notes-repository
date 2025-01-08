import React, { Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'
import { getNote } from '../utils/databaseFunctions';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyPassword } from '../utils/password';


interface AuthContextType {
    login: (url: string, password: string) => Promise<boolean>;
    logout: (url: string) => void;
    isAuthenticated: boolean;
    setIsAuthenticated: Dispatch<SetStateAction<boolean>>
    newNote: boolean | null;
    setNewNote: Dispatch<SetStateAction<boolean | null>>
    hasPassword: boolean;
    setHasPassword: Dispatch<SetStateAction<boolean>>
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
    const [hasPassword, setHasPassword] = useState<boolean>(false);

    useEffect(()=>{
        
    }, [])


    const login = async (url: string, password: string) => {
        const {isDataExist, data} = await getNote(url);
        let isLoggedIn = false;
        let isMatch = await verifyPassword(password, data.password);

        if(isDataExist && isMatch){
            setIsAuthenticated(true)
            // localStorage.setItem('authToken', JSON.stringify({pathname: url, loggedIn: true}));
            setHasPassword(true)
            isLoggedIn = true;
        }else{
            setIsAuthenticated(false)
            isLoggedIn = false
        }

        return isLoggedIn;
    }

    const logout = (url: string) => {
        // localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        navigate(`/login/${url}`, {replace: true});
            
    }

    return (
        <AuthContext.Provider value={{login, logout, isAuthenticated, setIsAuthenticated, newNote, setNewNote, hasPassword, setHasPassword}}>
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
import React, { Dispatch, SetStateAction, useContext, useState } from 'react'

type ToastContextProps = {
    setOpen: Dispatch<SetStateAction<boolean>>,
    setToast: (open: boolean, message: string) => void,
    open: boolean,
    message: string
}

const ToastContext = React.createContext<ToastContextProps | null>(null)

export const useToastContext = () => useContext(ToastContext);

export const ToastContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('')
    
    const setToast = (open: boolean, message: string) => {
        setOpen(open)
        setMessage(message)
    }

    return(
        <ToastContext.Provider value={{setOpen, setToast, open, message}}>
            {children}
        </ToastContext.Provider>
    )
}

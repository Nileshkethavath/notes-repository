import React, { useEffect, useState } from 'react'
import {OfflineComponent} from './OfflineComponent';
import { Box } from '@mui/material';

export const OfflineHandlerComp: React.FC<{children: React.ReactNode}> = ({ children}) => {
    const [isOnline, setIsOnline] = useState(window.navigator.onLine);

    useEffect(()=>{
        const updateOnlineStatus = () => setIsOnline(navigator.onLine)

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
        }
    }, [])

    return(
        <Box>
            {isOnline ? children : <OfflineComponent/>}
        </Box>
    )

}

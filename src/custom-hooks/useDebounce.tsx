import React, { useEffect, useState } from 'react'

export const useDebounce = (value: string, time: number = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    useEffect(()=>{
        const timer = setTimeout(()=>setDebouncedValue(value),time);

        return ()=>clearTimeout(timer);
    }, [value, time])

    return debouncedValue;
}

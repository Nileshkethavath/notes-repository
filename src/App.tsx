import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import generateID from './utils/generateID'
import { Login } from './components/Login'
import Home from './components/Home'
import AuthProvider from './components/AuthContext'
import { Error } from './components/Error'
import ProtectedRoute from './components/ProtectedRoute'
import {OfflineHandlerComp} from './components/OfflineHandlerComp'
import { ToastContextProvider } from './components/ToastContext'
import AutoCloseToast from './components/ToastComponent'
import { webSocket } from './utils/webSocket'
import { useEffect, useState } from 'react'

function App() {

  const id = generateID();

  useEffect(()=>{
    document.title = 'Notes'
    return () => {
      webSocket.close();
    }
  }, [])

  return (
    <OfflineHandlerComp>
      <AuthProvider>
        <ToastContextProvider>
          <Routes>

            {/* public routes */}
            <Route path='/' element={<Navigate to={`/${id}`} />} />

            {/* invalid route */}
            <Route path='/invalid' element={<Error />} />

            {/* private routes */}
            <Route path='/:id' element={<ProtectedRoute componentType='home' Component={Home} />} />
            <Route path='/login/:id' element={<ProtectedRoute componentType='login' Component={Login} />} />

            {/* invalid routes */}
            <Route path='*' element={<Navigate to={'/invalid'} replace={true} />} />

          </Routes>

          <AutoCloseToast/>
        </ToastContextProvider>
      </AuthProvider>
    </OfflineHandlerComp>
  )
}


export default App;

import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'quill/dist/quill.snow.css';


import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  
    <BrowserRouter>
      <App />
    </BrowserRouter>
)

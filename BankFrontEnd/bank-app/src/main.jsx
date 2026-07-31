import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Pages/Home/Home'
import "./utils/i18n/i18n"

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Home/>
  </StrictMode>,
)

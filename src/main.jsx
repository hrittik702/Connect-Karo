import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import CollegeAdminLogin from './college-admin/login.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/college-admin/login" element={<CollegeAdminLogin />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

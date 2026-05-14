import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import '@fontsource-variable/mona-sans'
import './index.css'

// Yahan koi bhi direct page (jaise login) import nahi hoga
// App component ke andar hi saari routing (App.jsx) handle ho rahi hai

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#111111',
            color: '#f5f5f5',
            border: '1px solid #b87d10',
            borderRadius: '10px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#d4a017', secondary: '#111111' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#111111' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)

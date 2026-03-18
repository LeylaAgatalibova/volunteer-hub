import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1e1e14',
            color: '#f4f4f0',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            borderRadius: '10px',
            border: '1px solid #333325',
          },
          success: {
            iconTheme: { primary: '#5a9d7c', secondary: '#f4f4f0' },
          },
          error: {
            iconTheme: { primary: '#e85520', secondary: '#f4f4f0' },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)

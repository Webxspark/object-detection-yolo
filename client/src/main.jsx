import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GlobalContextProvider } from './context/global-context.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalContextProvider>
      <App />
    </GlobalContextProvider>
  </StrictMode>,
)

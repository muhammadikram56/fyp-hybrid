import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import { AudioProvider } from './contexts/AudioContext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

import { ThemeProvider } from './contexts/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <AudioProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </AudioProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)


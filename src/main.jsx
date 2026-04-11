import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import '/public/css/all.min.css'
import '/public/css/style.css'
import './index.css'
import App from './App.jsx'
import { EduorProvider } from './context/EduorContext'
import { ProviderStore } from './storeConfig'
import { Store } from './store'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProviderStore store={Store}>
      <BrowserRouter>
        <EduorProvider>
          <App />
        </EduorProvider>
      </BrowserRouter>
    </ProviderStore>
  </StrictMode>,
)
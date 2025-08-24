import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { MotionConfig } from 'motion/react'

import { AppProvider } from './context/AppContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppProvider>
      <MotionConfig viewport={{once: true}}>
        <App />
      </MotionConfig>
    </AppProvider>
  </BrowserRouter>,
)


import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { MotionConfig } from 'motion/react';
import { AuthProvider } from './context/AuthContext.jsx';

// swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <MotionConfig viewport={{ once: true }}>
      <App />
    </MotionConfig>
  </AuthProvider>
);

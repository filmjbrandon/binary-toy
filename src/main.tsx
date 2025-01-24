import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'; // Adjust based on your folder structure
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
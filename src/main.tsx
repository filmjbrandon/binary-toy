import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'; // Adjust based on your folder structure
import reportWebVitals from './reportWebVitals';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log)
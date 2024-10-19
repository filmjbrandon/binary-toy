import React from 'react';
import ReactDOM from 'react-dom/client'; // Correct import for React 18+
import App from './App'; // Adjust based on your folder structure
import reportWebVitals from './reportWebVitals';
import './index.css';

// Line 6 potential issue: React 18 requires `createRoot`
const rootElement = document.getElementById('root');

// Line 15: React 18 uses `createRoot` instead of `render`
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement); // Use createRoot in React 18
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log)
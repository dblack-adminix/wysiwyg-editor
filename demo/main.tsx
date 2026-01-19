import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Полный UI с иконками
// import HeadlessDemo from './HeadlessDemo'; // Headless демо

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

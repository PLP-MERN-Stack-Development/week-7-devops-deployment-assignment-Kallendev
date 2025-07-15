import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PostProvider } from './contexts/PostContext'; 
import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PostProvider>
      <App />
    </PostProvider>
  </React.StrictMode>
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import {Provider} from 'react-redux'
import { store } from './redux/store';
import axios from 'axios';

axios.interceptors.request.use((config) => {
  const userId = localStorage.getItem("userId");
  if (userId) {
    config.headers["user-id"] = userId; 
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for (let registration of registrations) {
      registration.unregister().then(function(boolean) {
        console.log('Service worker unregistered successfully:', boolean);
      });
    }
  }).catch(function(err) {
    console.error('Service worker unregister failed:', err);
  });
}

if ('caches' in window) {
  caches.keys().then(cacheNames => {
    cacheNames.forEach(cacheName => {
      caches.delete(cacheName).then(function(boolean) {
        console.log('Cache deleted successfully:', boolean);
      });
    });
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
  <BrowserRouter>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </BrowserRouter>
  </Provider>
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="949941928895-kvs8hpfbvd0kedq5g41k80n118b1gmin.apps.googleusercontent.com">

      <Provider store={store}>
        <App />
      </Provider>

    </GoogleOAuthProvider>
  </React.StrictMode>
);

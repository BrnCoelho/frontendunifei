import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import CrudUsuarios from './components/CrudUsuarios';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    < CrudUsuarios></CrudUsuarios>
  </React.StrictMode>
);


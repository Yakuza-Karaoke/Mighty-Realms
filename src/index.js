import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Game from './App';
//import { Cell, Field, ConfirmButton} from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <Cell/>
    <Field/>
    <ConfirmButton/> */}
    <Game/>
  </React.StrictMode>
);


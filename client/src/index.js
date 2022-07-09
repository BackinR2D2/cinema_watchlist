import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

document.addEventListener("DOMContentLoaded", function(event) {
  ReactDOM.render(
    <React.StrictMode>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
});
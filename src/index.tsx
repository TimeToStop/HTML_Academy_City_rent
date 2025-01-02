
import ReactDOM from 'react-dom/client';
import App from './components/app/app';
import React from 'react';
import { offers } from './mocks/offers';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App places={offers} />
  </React.StrictMode>
);

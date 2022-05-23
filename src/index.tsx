import 'handsontable/dist/handsontable.full.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { name, version } from '../package.json';
import App from './App';
import './index.css';
import { rootReducer } from './Redux/rootReducer';

// eslint-disable-next-line no-console
console.log(`${name} version: ${version}`);

export const store = createStore(rootReducer, composeWithDevTools());
const app = (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import ChatProxy from './utils/chatProxy';
const proxy = new ChatProxy();
ReactDOM.render(<App ChatProxy={proxy} />, document.getElementById('root'));
registerServiceWorker();

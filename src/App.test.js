import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ChatProxy from './utils/chatProxy';


it('renders without crashing', () => {
  const proxy = new ChatProxy();
  const div = document.createElement('div');
  ReactDOM.render(<App ChatProxy={proxy} />, div);
  ReactDOM.unmountComponentAtNode(div);
});

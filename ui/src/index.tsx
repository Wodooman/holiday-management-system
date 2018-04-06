import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import App from './App';
import { Provider } from 'react-redux';
import configureStore from './state/store/configureStore';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider >,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

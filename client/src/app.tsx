import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';

const root = createRoot(document.body);
root.render(
  <Provider store={store}>
    <h2>Hello from React!</h2>
  </Provider>
);

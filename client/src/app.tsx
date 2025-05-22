import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import Home from './components/Home';
import { store } from './store';
import './styles/auth.global.scss';

const AppContent = () => {
  return <Home />;
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);
root.render(<App />);

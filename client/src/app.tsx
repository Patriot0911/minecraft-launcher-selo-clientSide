import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import Window from './components/Window';
import { store } from './store';
import './styles/auth.global.scss';

const AppContent = () => {
  return <Window />;
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

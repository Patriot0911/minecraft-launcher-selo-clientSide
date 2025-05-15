import { createRoot } from 'react-dom/client';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { useAppSelector } from './store/hooks';
import Home from './components/Home';
import Auth from './components/Auth/Auth';
import { store } from './store';
import GameVersionService from './scripts/game-version/game-version.service';
import './styles/auth.global.scss';

const AppContent = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      GameVersionService.fetchAll().then(
        (state) => {
          console.log({state});
        }
      );
    }
  }, [isAuthenticated]);

  return isAuthenticated ? <Home /> : <Auth />;
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

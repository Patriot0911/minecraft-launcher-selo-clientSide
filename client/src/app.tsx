import { createRoot } from 'react-dom/client';
import { useEffect, } from 'react';
import { Provider } from 'react-redux';
import Home from './components/Home';
import { store } from './store';
import GameVersionService from './scripts/game-version/game-version.service';
// add index file

const App = () => {
  useEffect(
    () => {
      // just test, but
      // use repository
      GameVersionService.fetchAll().then(
        (state) => {
          console.log({state});
        }
      )
    }, []
  );
  return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
};

const root = createRoot(document.body);
root.render(<App />);

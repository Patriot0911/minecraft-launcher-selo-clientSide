import { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import Auth from '../Auth/Auth';
import styles from './styles.module.scss';
import WindowController from '../WindowController';
import GameVersionsList from '../GameVersionsList';

const Home = () => {
  const [showAuth, setShowAuth] = useState(false);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const selectedVersion = useAppSelector((state) => state.versions.versions.selectedVersion);

  useEffect(() => {
    if (isAuthenticated) {
      setShowAuth(false);
    }
  }, [isAuthenticated]);

  const toggleAuth = () => {
    setShowAuth(!showAuth);
  };

  return (
    <div className={styles['window-wrapper']}>
      <WindowController />
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <h2>Game Versions</h2>
          <GameVersionsList />
        </div>
        <div className={styles.mainContent}>
          <div className={styles.authContainer}>
            {isAuthenticated ? (
              <div className={styles.authButton} onClick={toggleAuth}>
                {user?.username}
              </div>
            ) : (
              <button className={styles.authButton} onClick={toggleAuth}>
                Login / Register
              </button>
            )}
          </div>

          {showAuth && (
            <>
              <div className={styles.modalBackdrop} onClick={toggleAuth} />
              <div className={styles.authOverlay}>
                <Auth onClose={toggleAuth} />
              </div>
            </>
          )}
          {
            selectedVersion && (
              <div className={styles.versionContent}>
                <h2>Minecraft {selectedVersion}</h2>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Home;

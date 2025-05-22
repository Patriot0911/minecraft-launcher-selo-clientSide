import { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import Auth from '../Auth/Auth';
import styles from './styles.module.scss';
import WindowController from '../WindowController';

const gameVersions = [
  { id: '1.20.4', name: '1.20.4', type: 'release' },
  { id: '1.20.2', name: '1.20.2', type: 'release' },
  { id: '1.19.4', name: '1.19.4', type: 'release' },
  { id: '1.18.2', name: '1.18.2', type: 'release' },
  { id: '1.17.1', name: '1.17.1', type: 'release' },
];

const Home = () => {
  const [selectedVersion, setSelectedVersion] = useState(gameVersions[0]);
  const [showAuth, setShowAuth] = useState(false);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      setShowAuth(false);
    }
  }, [isAuthenticated]);

  const handleVersionSelect = (version: typeof gameVersions[0]) => {
    setSelectedVersion(version);
  };

  const toggleAuth = () => {
    setShowAuth(!showAuth);
  };

  return (
    <div className={styles['window-wrapper']}>
      <WindowController />
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <h2>Game Versions</h2>
          <ul className={styles.versionList}>
            {gameVersions.map((version) => (
              <li
                key={version.id}
                className={`${styles.versionItem} ${
                  selectedVersion.id === version.id ? styles.active : ''
                }`}
                onClick={() => handleVersionSelect(version)}
              >
                {version.name}
              </li>
            ))}
          </ul>
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

          <div className={styles.versionContent}>
            <h2>Minecraft {selectedVersion.name}</h2>
            <p>Type: {selectedVersion.type}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

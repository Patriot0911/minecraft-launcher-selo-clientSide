import { useAppSelector } from '../../store/hooks';
import { useEffect, useState } from 'react';
import AuthModal from './AuthModal';

import styles from './styles.module.scss';

const Auth = () => {
  const [showAuth, setShowAuth] = useState(false);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      setShowAuth(false);
    }
  }, [isAuthenticated]);

  const toggleAuth = () => {
    setShowAuth(!showAuth);
  };

  return (
    <>
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
            <AuthModal onClose={toggleAuth} />
          </div>
        </>
      )}
    </>
  );
};

export default Auth;

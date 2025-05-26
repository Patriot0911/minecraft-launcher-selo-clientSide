import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { useEffect, useState, useRef } from 'react';
import { logoutThunk } from '../../store/thunks/authThunk';
import AuthModal from './AuthModal';
import Dropdown from '../ui/Dropdown';

import styles from './styles.module.scss';

const Auth = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownTriggerRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      setShowAuth(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (user) {
      setShowAuth(false);
    }
  }, [user]);

  const toggleAuth = () => {
    setShowAuth(!showAuth);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const dropdownItems = [
    {
      label: 'Settings',
      onClick: () => console.log('Settings clicked')
    },
    {
      label: 'Payments',
      onClick: () => console.log('Payments clicked')
    },
    {
      label: 'Logout',
      onClick: () => {
        dispatch(logoutThunk());
        setShowDropdown(false);
      }
    }
  ];

  return (
    <>
      <div className={styles.authContainer}>
        {isAuthenticated ? (
          <div className={styles.authButton} onClick={toggleDropdown} ref={dropdownTriggerRef}>
            {user?.username}
            <Dropdown
              items={dropdownItems}
              isOpen={showDropdown}
              onClose={() => setShowDropdown(false)}
              triggerRef={dropdownTriggerRef}
            />
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

import { useState } from 'react';
import Auth from '../Auth';

import styles from './styles.module.scss';

const accounts = [
  'Classic',
  'SeLo',
  // 'Mojang',
];

const AccountCard = () => {
  const [selectedAcc, setSelectedAcc] = useState(0);
  return (
    <div className={styles['accounts-wrapper']}>
      <div
        className={styles['heading']}
        style={{
          gridTemplateColumns: `repeat(${accounts.length}, 1fr)`
        }}
      >
        <div
          className={
            `${0 == selectedAcc && `${styles.first} `} ${
                accounts.length-1 == selectedAcc && ` ${styles.last} `
              }
              ${styles.selector}
          `}
          style={{
            left: `${selectedAcc * 138.8}px`,
          }}
        />
        {
          accounts.map(
            (name, index) => (
              <span
                key={name}
                className={selectedAcc == index ? styles.selected : ''}
                onClick={() => setSelectedAcc(index)}
              >
                {name}
              </span>
            )
          )
        }
      </div>
      <div className={styles.body}>
        {
          selectedAcc == 0 ? (
            <div className={styles.field}>
              <input
                placeholder='Enter Nickname'
              />
            </div>
          ) : <Auth />
        }
      </div>
    </div>
  );
};

export default AccountCard;

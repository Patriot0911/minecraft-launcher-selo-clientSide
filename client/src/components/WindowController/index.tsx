import styles from './styles.module.scss';

const WindowController = () => {
  const closeWindow = () => window.windowControls.close();
  const maximizeWindow = () => window.windowControls.maximize();
  const minimizeWindow = () => window.windowControls.minimize();
  return (
    <div className={styles['window-wrapper']}>
      <div className={styles['title']}>
        SeLo
      </div>
      <div className={styles['buttons']}>
        <button
          className={`
            ${styles['window-action']} ${styles['hide']}
          `}
          onClick={minimizeWindow}
        ></button>
        {/* <button
          className={`
            ${styles['window-action']} ${styles['max']}
          `}
          onClick={maximizeWindow}
        ></button> */}
        <button
          className={`
            ${styles['window-action']} ${styles['close']}
          `}
          onClick={closeWindow}
        ></button>
      </div>
    </div>
  );
};

export default WindowController;

import styles from './styles.module.scss';

const WindowController = () => {
  const closeWindow = () => window.windowControls.close();
  const maximizeWindow = () => window.windowControls.maximize();
  const minimizeWindow = () => window.windowControls.minimize();
  return (
    <div className={styles['window-wrapper']}>
      <button className={styles['window-action']} onClick={minimizeWindow}>_</button>
      <button className={styles['window-action']} onClick={maximizeWindow}>[]</button>
      <button className={styles['window-action']} onClick={closeWindow}>X</button>
    </div>
  );
};

export default WindowController;

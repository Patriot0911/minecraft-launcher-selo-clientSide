import WindowController from "../WindowController";
import { PropsWithChildren } from "react";

import styles from './styles.module.scss';

const Layout = ({ children, }: PropsWithChildren) => {
  return (
    <div className={styles['window-wrapper']}>
      <WindowController />
      <div className={styles.container}>
        {children}
      </div>
    </div>
  );
};

export default Layout;

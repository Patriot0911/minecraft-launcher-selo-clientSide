import { PropsWithChildren } from 'react';
import styles from './styles.module.scss';

const Sidebar = ({ children, }: PropsWithChildren) => {
  return (
    <div className={styles.sidebar}>
      {children}
    </div>
  );
};

export default Sidebar;

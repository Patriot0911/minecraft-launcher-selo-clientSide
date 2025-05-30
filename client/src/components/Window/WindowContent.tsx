import { useAppSelector } from "../../store/hooks";
import Auth from "../Accounts/Auth";
import styles from './styles.module.scss';

const WindowContent = () => {
  const selectedVersion = useAppSelector((state) => state.versions.versions.selectedVersion);
  return (
    <div className={styles.mainContent}>
      {/* <Auth /> */}
      <div></div>
    </div>
  );
};

export default WindowContent;

import { useAppSelector } from '../../store/hooks';
import styles from './styles.module.scss';
import GameVersions from '../GameVersions';
import Sidebar from '../Layout/Sidebar';
import Layout from '../Layout';
import Auth from '../Auth';

const Home = () => {
  const selectedVersion = useAppSelector((state) => state.versions.versions.selectedVersion);
  return (
    <Layout>
      <Sidebar>
        <GameVersions />
      </Sidebar>
      <div className={styles.mainContent}>
        <Auth />
        {
          selectedVersion && (
            <div className={styles.versionContent}>
              <h2>Minecraft {selectedVersion}</h2>
            </div>
          )
        }
      </div>
    </Layout>
  );
};

export default Home;

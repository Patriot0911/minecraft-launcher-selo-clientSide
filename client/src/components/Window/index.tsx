import AccountCard from '../Accounts/AccountCard';
import GameVersions from '../GameVersions';
import Layout from '../Layout';
import styles from './styles.module.scss';


const Home = () => {
  return (
    <Layout>
      <div className={styles['sidebar-wrapper']}>
        <GameVersions />
        <AccountCard />
      </div>
      <div className={styles.mainContent}>
        
      </div>
    </Layout>
  );
};

export default Home;

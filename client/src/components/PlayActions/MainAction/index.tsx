import GameVersionsService from '../.../../../../scripts/client/services/game-versions.service';
import { playVersionsThunk } from '../../../store/thunks/versionsThunk';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import styles from './styles.module.scss';

const MainAction = () => {
  const { selectedVersion, installed, } = useAppSelector((state) => state.versions.versions);
  const dispatch = useAppDispatch();

  const folderHandle = () =>
    GameVersionsService.getInstance().openFolder();
  const buttonHandle = () =>
    dispatch(playVersionsThunk());

  return (
    <div className={styles['bottom-section']}>
      <div className={styles['button-wrapper']}>
        <div className={styles['action-bar']}>
          <span
            className={styles.item}
            onClick={folderHandle}
          >Folder</span>
        </div>
        <button
          className={`${styles['action-button']}`}
          disabled={!selectedVersion}
          onClick={buttonHandle}
        >
          {installed.includes(selectedVersion?.versionId) ? 'Play' : 'Install'}
        </button>
      </div>
    </div>
  );
};

export default MainAction;

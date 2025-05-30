import { loadVersionsThunk, } from "../../store/thunks/versionsThunk";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectVersion } from "../../store/slices/versionsSlice";
import { useEffect, } from "react";

import styles from './styles.module.scss';

const GameVersions = () => {
  const dispatch = useAppDispatch();
  const {
    versions: { vanila: { data, }, selectedVersion, },
  } = useAppSelector((state) => state.versions);

  const selectItem = (id: string) => dispatch(selectVersion(id));

  useEffect(() => {
    dispatch(loadVersionsThunk({
      page: 1,
      pageSize: 100,
      versionType: 'release',
    }));
  }, []);

  return (
    <div className={styles['versions-wrapper']}>
      <div className={styles['versions-list']}>
        {
          data.map(
            (state) => (
              <div
                key={state.id}
                className={`${styles['item']} ${selectedVersion === state.id ? styles.selected : ''}`}
                onClick={() => selectItem(state.id)}
              >
                <div className={styles['version-avatar']}>
                  {/* <img
                    src="https://icon-library.com/images/minecraft-png-icon/minecraft-png-icon-12.jpg"
                  /> */}
                </div>
                <div className={styles['version-info']}>
                  <div className={styles['body']}>
                    <div className={styles['game-version']}>
                      {state.versionId}
                    </div>
                    <div className={styles['extra']}>
                      vanial
                    </div>
                  </div>
                  {
                    false && (
                      <div>
                        {/* need to install ? */}
                      </div>
                    )
                  }
                </div>
              </div>
            )
          )
        }
      </div>
    </div>
  );
};

export default GameVersions;

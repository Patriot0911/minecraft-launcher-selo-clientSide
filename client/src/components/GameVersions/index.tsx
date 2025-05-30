import { loadVersionsThunk, } from "../../store/thunks/versionsThunk";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectVersion } from "../../store/slices/versionsSlice";
import { useEffect } from "react";

import styles from "./styles.module.scss";

interface IGameVersion {
  id: string;
  versionId: string;
}

const GameVersions = () => {
  const dispatch = useAppDispatch();
  const {
    versions: {
      vanila: { data },
      selectedVersion,
    },
  } = useAppSelector((state) => state.versions);

  const selectItem = (id: string) => dispatch(selectVersion(id));

  useEffect(() => {
    dispatch(
      loadVersionsThunk({
        page: 1,
        pageSize: 100,
        versionType: "release",
      })
    );
  }, []);

  return (
    <div className={styles['versions-wrapper']}>
      { data && data.length > 0 ? (
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
                  </div>
                  <div className={styles['version-info']}>
                    <div className={styles['body']}>
                      {state.versionId}
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
      ) : (
        <div className={styles["no-versions"]}>
          <h1>No versions found</h1>
          <p></p>
        </div>
      )}
    </div>
  );
};

export default GameVersions;

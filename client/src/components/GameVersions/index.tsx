import { LuLibrary } from "react-icons/lu";
import { RiInstallLine } from "react-icons/ri";
import { loadVersionsThunk } from "../../store/thunks/versionsThunk";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectVersion } from "../../store/slices/versionsSlice";
import { useEffect, useState } from "react";
import Input from "../ui/Input";
import List from "../ui/List";

import styles from './styles.module.scss';

const GameVersions = () => {
  const [search, setSearch] = useState<string>('');
  const dispatch = useAppDispatch();
  const {
    versions: { vanila: { data, }, selectedVersion, },
  } = useAppSelector((state) => state.versions);

  const selectItem = (id: string) => dispatch(selectVersion(id));

  useEffect(() => {
    dispatch(loadVersionsThunk({
      page: 1,
      pageSize: 50,
      versionType: 'release',
    }));
  }, []);

  return (
    <div className={styles['versions-wrapper']}>
      <Input
        onChange={(event) => setSearch(event.target.value)}
        value={search}
        placeholder={'Search by version'}
      />
      <div className={styles['list']}>
        <List
          items={data.map(
            (state) => ({
              displayName: state.versionId,
              name: state.id,
            })
          )}
          selectedItem={selectedVersion}
          setSelectedItem={selectItem}
        />
      </div>
      <div className={styles['tabs-list']}>
        <button className={`${styles['tab']} ${styles['selected']}`}>
          <LuLibrary />
        </button>
        <button className={styles['tab']}>
          <RiInstallLine />
        </button>
      </div>
    </div>
  );
};

export default GameVersions;

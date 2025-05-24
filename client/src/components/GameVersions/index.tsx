import { loadVersionsThunk } from "../../store/thunks/versionsThunk";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectVersion } from "../../store/slices/versionsSlice";
import { useEffect, useState } from "react";
import List from "../ui/List";
import Input from "../ui/Input/Index";

import styles from './styles.module.scss';

const GameVersions = () => {
  const [search, setSearch] = useState<string>(undefined);
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
    </div>
  );
};

export default GameVersions;

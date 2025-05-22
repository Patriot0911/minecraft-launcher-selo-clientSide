import { loadVersionsThunk } from "../../store/thunks/versionsThunk";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectVersion } from "../../store/slices/versionsSlice";
import { useEffect, useState } from "react";
import List from "../ui/List";

const GameVersionsList = () => {
  const [search, setSearch] = useState();
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
    }))
  }, []);

  return (
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
  );
};

export default GameVersionsList;

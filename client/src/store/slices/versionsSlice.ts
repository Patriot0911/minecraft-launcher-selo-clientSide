import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadVersionsThunk } from '../thunks/versionsThunk';
import { IGameVersion } from '../../models/game-versions';

interface VersionsState {
  loading: boolean;
  error: string | null;
  versions: {
    selectedVersion: string;
    vanila: {
      total: number;
      data: IGameVersion[];
    }
  }
};

const initialState: VersionsState = {
  loading: false,
  error: null,
  versions: {
    selectedVersion: null,
    vanila: {
      total: 0,
      data: [],
    },
  },
};

const versionsSlice = createSlice({
  name: 'versions',
  initialState,
  reducers: {
    selectVersion: (state, action: PayloadAction<string>) => {
      state.versions.selectedVersion = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadVersionsThunk.pending, (state) => {
      state.error = null;
      state.loading = true;
    });
    builder.addCase(loadVersionsThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.versions.vanila = {
        data: action.payload.data,
        total: action.payload.meta.total,
      };
    });
    builder.addCase(loadVersionsThunk.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });
  },
});

export const {
  selectVersion,
} = versionsSlice.actions;

export default versionsSlice.reducer;

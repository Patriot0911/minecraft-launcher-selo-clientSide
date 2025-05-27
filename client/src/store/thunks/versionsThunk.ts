import GameVersionsService from "../../scripts/client/services/game-versions.service";
import { IVersionsQueries } from "../../models/game-versions";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loadVersionsThunk = createAsyncThunk(
  'versions/load',
  async (query: IVersionsQueries, { rejectWithValue }) => {
    try {
      const response = await GameVersionsService.getInstance().getVersions(query);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  }
);

export const playVersionsThunk = createAsyncThunk(
  'versions/play',
  async (_, { rejectWithValue, getState }) => {
    const { versions: { versions: { selectedVersion, vanila, }, }, } = (getState() as any);
    const manifest = vanila.data.find(
      (state: any) => state.id === selectedVersion
    );
    try {
      const response = await GameVersionsService.getInstance().playVersion(manifest.packageUrl);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  }
);

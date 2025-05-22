import GameVersionsService from "../../scripts/client/services/game-versions.service";
import { IVersionsQueries } from "../../models/game-versions";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loadVersionsThunk = createAsyncThunk(
  'versions/load',
  async (query: IVersionsQueries, { rejectWithValue }) => {
    try {
      const response = await GameVersionsService.getInstance().getVersions(query)
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  }
);

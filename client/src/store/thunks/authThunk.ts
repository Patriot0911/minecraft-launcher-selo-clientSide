import { createAsyncThunk } from "@reduxjs/toolkit/dist";
import { LoginCredentials, RegisterCredentials } from "../../models/auth";
import AuthService from "../../scripts/services/auth.service";

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await AuthService.getInstance().login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await AuthService.getInstance().register(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Reguster failed');
    }
  }
);

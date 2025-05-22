import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginThunk, registerThunk } from '../thunks/authThunk';

interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  roles: Role[];
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(loginThunk.fulfilled, (state, action) => {
      state.loading = false;
      // state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    })
    .addCase(loginThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(registerThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(registerThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      // state.user = action.payload;
      state.error = null;
    })
    .addCase(registerThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }
});

export const {
  registerFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;

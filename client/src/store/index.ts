import { configureStore } from '@reduxjs/toolkit';
import versionseducer from './slices/versionsSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    versions: versionseducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

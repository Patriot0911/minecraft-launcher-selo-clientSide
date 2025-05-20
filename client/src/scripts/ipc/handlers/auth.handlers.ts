import { ipcMain } from 'electron';
import { API_URL } from '../constants';

interface LoginCredentials {
  login: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export const setupAuthHandlers = () => {
  ipcMain.handle('login', async (event, credentials: LoginCredentials) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    return {
      ...data,
      status: res.status,
    };
  });

  ipcMain.handle('register', async (event, credentials: RegisterCredentials) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    return {
      ...data,
      status: res.status,
    };
  });
}; 
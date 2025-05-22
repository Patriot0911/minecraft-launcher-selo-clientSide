import type { LoginCredentials, RegisterCredentials, } from '../../../../models/auth';
import { IElectronResponse } from '../../../../types/handlers';
import AuthMapper from '../mappers/auth.mappers';
import { API_URL } from '../../constants';

const headers = { 'Content-Type': 'application/json', };

const authHandlers = {
  login: async (credentials: LoginCredentials): Promise<IElectronResponse> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      body: JSON.stringify(credentials),
      method: 'POST',
      headers,
    });
    const data = await res.json();
    if(!res.ok)
      return {
        data,
        state: false,
        status: res.status,
        message: data.message,
      };
    return {
      data: AuthMapper.loginMapper(data),
      state: true,
      status: res.status,
    };
  },
  register: async (credentials: RegisterCredentials): Promise<IElectronResponse> => {
    const res = await fetch(`${API_URL}/auth/register`, {
      body: JSON.stringify(credentials),
      method: 'POST',
      headers,
    });
    const data = await res.json();
    return {
      data,
      state: true,
      status: res.status,
    };
  },
};

export default authHandlers;

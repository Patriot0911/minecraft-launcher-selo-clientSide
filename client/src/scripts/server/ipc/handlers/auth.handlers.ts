import type { LoginCredentials, RegisterCredentials, } from '../../../../models/auth';
import { IElectronResponse } from '../../../../types/handlers';
import AuthMapper from '../mappers/auth.mappers';
import { createRequest, createAuthorizedRequest } from '../utils/request.utils';

const authHandlers = {
  login: async (credentials: LoginCredentials): Promise<IElectronResponse<any>> => {
    const res = await createRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (!res.state) return res;
    return {
      ...res,
      data: AuthMapper.loginMapper(res.data),
    };
  },

  register: async (credentials: RegisterCredentials): Promise<IElectronResponse<any>> => {
    return createRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  logout: async (token: string): Promise<IElectronResponse<any>> => {
    return createAuthorizedRequest('/auth/logout', token, {
      method: 'POST',
    });
  },

  me: async (token: string): Promise<IElectronResponse<any>> => {
    return createAuthorizedRequest('/auth/me', token, {
      method: 'GET',
    });
  },

  refreshToken: async (refreshToken: string): Promise<IElectronResponse<any>> => {
    return createAuthorizedRequest('/auth/refresh', refreshToken, {
      method: 'POST',
    });
  },
};

export default authHandlers;

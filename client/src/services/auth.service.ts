import { API_URL } from '../scripts/api.constants';

declare global {
  interface Window {
    electron: {
      login: (credentials: LoginCredentials) => Promise<AuthResponse>;
      register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
    }
  }
}

interface LoginCredentials {
  login: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  id: string;
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  status: number;
  message?: string;
  details?: string[];
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;

  private constructor() {
    this.token = localStorage.getItem('token');
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  private clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const data = await window.electron.login(credentials);
    if (data.status !== 200) {
      throw new Error(data.message);
    }
    this.setToken(data.accessToken);
    return data;
  }

  public async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const data = await window.electron.register(credentials);

    if (data.status !== 200) {
      const message = data?.details?.map((detail: any) => detail).join('\n') ?? data.message;
      throw new Error(message);
    }
    this.setToken(data.accessToken);
    return data;
  }

  public async logout() {
    this.clearToken();
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }
}

export default AuthService; 
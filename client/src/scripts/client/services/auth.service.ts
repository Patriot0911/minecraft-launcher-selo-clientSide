import { AuthResponse, LoginCredentials, RegisterCredentials, } from "../../../models/auth";

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private refreshToken: string | null = null;

  private constructor() {
    this.token = localStorage.getItem('token');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private setTokens(token: string, refreshToken: string) {
    this.token = token;
    this.refreshToken = refreshToken;
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private clearTokens() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data, state, message, } = await window.electron.auth.login(credentials);
    if (!state) {
      throw new Error(message);
    };
    this.setTokens(data.tokens.accessToken, data.tokens.refreshToken);
    return data;
  }

  public async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { data, state, message: errorMessage, } = await window.electron.auth.register(credentials);
    if (!state) {
      const message = data?.details?.map((detail: any) => detail).join('\n') ?? errorMessage;
      throw new Error(message);
    };
    this.setTokens(data.tokens.accessToken, data.tokens.refreshToken);
    return data;
  }

  public async logout() {
    const token = this.token;
    if (!token) {
      throw new Error('No token found');
    }
    await window.electron.auth.logout(token);
    this.clearTokens();
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }
}

export default AuthService;

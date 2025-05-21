import { AuthResponse, LoginCredentials, RegisterCredentials, } from "../../models/auth";

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
    const { data, state, message, } = await window.electron.auth.login(credentials);
    if (!state) {
      throw new Error(message);
    };
    this.setToken(data.accessToken);
    return data;
  }

  public async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { data, state, message: errorMessage, } = await window.electron.auth.register(credentials);
    if (!state) {
      const message = data?.details?.map((detail: any) => detail).join('\n') ?? errorMessage;
      throw new Error(message);
    };
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

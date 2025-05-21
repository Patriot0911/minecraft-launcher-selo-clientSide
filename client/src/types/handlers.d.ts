declare global {
  interface Window {
    electron: {
      auth: {
        login: (credentials: LoginCredentials) => Promise<AuthResponse>;
        register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
      };
    };
  }
};

export interface IElectronResponse {
  state: boolean;
  status: number;
  message?: string;
  data: any;
};

export type HandlerFn = (...args: any[]) => Promise<IElectronResponse>;
export type HandlerMap = Record<string, Record<string, HandlerFn>>;

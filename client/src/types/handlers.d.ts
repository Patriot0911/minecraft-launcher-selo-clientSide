import authHandlers from "../scripts/ipc/handlers/auth.handlers";

declare global {
  interface Window {
    electron: IElectronAPI;
    windowControls: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
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

export interface IElectronAPI {
  auth: typeof authHandlers;
};

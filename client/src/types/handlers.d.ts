import gameVersionsHandlers from "../scripts/server/ipc/handlers/game-versions.handlers";
import authHandlers from "../scripts/server/ipc/handlers/auth.handlers";

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

export interface IElectronResponse<T> {
  state: boolean;
  status: number;
  message?: string;
  data: T;
};

export type HandlerFn = (...args: any[]) => Promise<IElectronResponse>;
export type HandlerMap = Record<string, Record<string, HandlerFn>>;

export interface IElectronAPI {
  auth: typeof authHandlers;
  gameVersions: typeof gameVersionsHandlers;
};

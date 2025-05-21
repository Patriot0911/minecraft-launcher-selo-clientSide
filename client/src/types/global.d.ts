import authHandlers from "../scripts/ipc/handlers/auth.handlers";

export declare global {
  interface Window {
    electron: {
      auth: typeof authHandlers;
    };
  };
  namespace NodeJS {
    interface ProcessEnv {
      API_URL: string;
    };
  };
};

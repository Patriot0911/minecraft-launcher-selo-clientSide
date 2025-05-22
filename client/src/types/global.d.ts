import authHandlers from "../scripts/ipc/handlers/auth.handlers";

export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_URL: string;
    };
  };
};

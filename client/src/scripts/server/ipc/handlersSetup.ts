import { HandlerFn, HandlerMap, } from "../../../types/handlers";
import authHandlers from "./handlers/auth.handlers";
import { isProduction } from "../constants";
import { ipcMain } from "electron";

const handlersList: HandlerMap = {
  auth: authHandlers,
};

const reqWrapper = (func: HandlerFn) => async (...args: any[]) => {
  console.log('IPC CALL', func.name, args);
  const res = await func(...args);
  console.log('IPC RESPONSE', func.name, res);
  if(!res.state) {
    console.error('IPC ERROR', func.name, res.message);
  };
  return res;
};

const handlersSetup = async () => {
  for(const [key, handlers] of Object.entries(handlersList)) {
    for(const h in handlers) {
      const handleKey = <keyof typeof handlers> h;
      const handler = isProduction ? handlers[handleKey] : reqWrapper(handlers[handleKey]);
      ipcMain.handle(
        `${key}/${h}`,
        (_, ...args) => handler(...args),
      );
    };
  };
};

export default handlersSetup;

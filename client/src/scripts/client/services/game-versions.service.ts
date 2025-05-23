import { IVersionsQueries } from "../../../models/game-versions";

class GameVersionsService {
  private static instance: GameVersionsService;

  private constructor() {};

  public static getInstance(): GameVersionsService {
    if (!GameVersionsService.instance) {
      GameVersionsService.instance = new GameVersionsService();
    };
    return GameVersionsService.instance;
  };

  public async getVersions(query: IVersionsQueries) {
    const { data, state, message, } = await window.electron.gameVersions.getVersions(query);
    if (!state) {
      throw new Error(message);
    };
    return data;
  };
};

export default GameVersionsService;

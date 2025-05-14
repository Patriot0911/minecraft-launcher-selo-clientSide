import { API_URL, } from '../api.constants';

class GameVersionService {
  private static readonly basePath = `${API_URL}/game-versions`;

  static async fetchAll() { // add filter builder
    const res = await fetch(this.basePath);
    const data = await res.json();
    // add mapper
    return data;
  };
};

export default GameVersionService;

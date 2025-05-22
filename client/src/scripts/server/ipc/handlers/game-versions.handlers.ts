import { IVersionsQueries, TGameVersionResponse } from '../../../../models/game-versions';
import { IElectronResponse } from '../../../../types/handlers';
import { API_URL } from '../../constants';

const headers = { 'Content-Type': 'application/json', };

const gameVersionsHandlers = {
  getVersions: async (query: IVersionsQueries): Promise<IElectronResponse<TGameVersionResponse>> => {
    const { page, pageSize, versionType, } = query;
    const url = new URL(`${API_URL}/game-versions`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('pageSize', pageSize.toString());
    url.searchParams.append('sortOrder', 'desc');
    url.searchParams.append('sortColumn', 'releasedAt');
    url.searchParams.append('versionType', versionType);
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });
    const data = await res.json();
    if(!res.ok)
      return {
        data,
        state: false,
        status: res.status,
        message: data.message,
      };
    return {
      data,
      state: true,
      status: res.status,
    };
  },
};

export default gameVersionsHandlers;

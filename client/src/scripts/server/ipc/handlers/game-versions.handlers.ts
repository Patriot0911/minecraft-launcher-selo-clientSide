import { IVersionsQueries, TGameVersionResponse } from '../../../../models/game-versions';
import { IElectronResponse } from '../../../../types/handlers';
import QueryParamBuilder from '../utils/queryParamBuilder';
import ClientInstaller from '../utils/clientInstaller';
import { API_URL } from '../../constants';
import { shell, } from 'electron';
import path from 'path';

const headers = { 'Content-Type': 'application/json', };

// to settings
const specificPath: string = undefined;

const gameVersionsHandlers = {
  getVersions: async (query: IVersionsQueries): Promise<IElectronResponse<TGameVersionResponse>> => {
    const searchParams = QueryParamBuilder.getFilter(
      'apiVersions',
      { sortOrder: 'desc', sortColumn: 'releasedAt', ...query, }
    );
    const res = await fetch(
      `${API_URL}/game-versions?${searchParams}`, {
        method: 'GET',
        headers,
      }
    );
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
  getInstalledVersions: async (): Promise<IElectronResponse<any>> => {
    const rootDir = specificPath || process.cwd();
    const targetDir = path.join(rootDir, 'installed_versions');
    console.log({ targetDir, });
    return {
      state: true,
      status: 200,
      data: {},
    };
  },
  installVersion: async (versionId: string, manifestUrl: string, reDownload?: boolean): Promise<IElectronResponse<any>> => {
    const rootDir = specificPath || process.cwd();
    const installer = new ClientInstaller(versionId, manifestUrl, rootDir, reDownload);
    await installer.fullInstall();
    return {
      state: true,
      status: 200,
      data: {},
    };
  },
  openFolder: async (): Promise<IElectronResponse<void>> => {
    const rootDir = specificPath || process.cwd();
    const targetDir = path.join(rootDir, 'installed_versions');
    shell.openPath(targetDir);
    return {
      state: true,
      status: 200,
      data: undefined
    };
  },
};


export default gameVersionsHandlers;

import { IVersionsQueries, TGameVersionResponse } from '../../../../models/game-versions';
import { IElectronResponse } from '../../../../types/handlers';
import QueryParamBuilder from '../utils/queryParamBuilder';
import downloadFile from '../utils/downloadFile';
import { API_URL } from '../../constants';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

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
  installVersion: async (manifestUrl: string): Promise<IElectronResponse<any>> => {
    const rootDir = specificPath || process.cwd();
    const targetDir = path.join(rootDir, 'installed_versions');
    const manifestRes = await fetch(manifestUrl);
    const manifestData = await manifestRes.json();

    const clientJarUrl = manifestData.downloads.client.url;
    // додати перевірку
    // чи існує файл версії? etc
    await downloadFile(clientJarUrl, `${targetDir}/versions/${manifestData.id}.jar`);

    for(const lib of manifestData.libraries) {
      const artifact = lib.downloads?.artifact;
      console.log(lib);
      if(artifact?.url) {
        const filePath = path.join(`${targetDir}/libraries`, artifact.path);
        await downloadFile(artifact.url, filePath);
      };
    };

    const assetIndexRes = await fetch(manifestData.assetIndex.url);
    const assetIndex = await assetIndexRes.json();

    console.log('assets');

    const assetContent = JSON.stringify(assetIndex);
    const assetIndexPath = `${targetDir}/assets/indexes/${manifestData.id}.json`;

    fs.mkdirSync(path.dirname(assetIndexPath), { recursive: true });
    const writeStream = fs.createWriteStream(assetIndexPath);
    writeStream.write(assetContent);
    writeStream.end();

    for(const asset of Object.values(assetIndex.objects)) {
      const hash = (asset as any).hash;
      const subdir = hash.substring(0, 2);
      const assetUrl = `https://resources.download.minecraft.net/${subdir}/${hash}`;
      const assetPath = path.join(`${targetDir}/assets`, 'objects', subdir, hash);
      console.log(asset);
      await downloadFile(assetUrl, assetPath);
    };

    console.log('done');

    startMinecraftClient(manifestData.id);

    return {
      state: true,
      status: 200,
      data: {},
    };
  },
};


async function startMinecraftClient(versionId: string) {
  const rootDir = specificPath || process.cwd();
  const targetDir = path.join(rootDir, 'installed_versions');

  const username = 'TestUser';
  const javaPath = 'java';

  const baseDir = targetDir;
  const librariesDir = path.join(baseDir, 'libraries');
  const clientJar = path.join(baseDir, `versions/${versionId}.jar`);
  const assetDir = path.join(baseDir, 'assets');

  console.log({clientJar});

  function collectClasspath() {
    const jars = [];

    function walk(currentPath: string) {
      if (!fs.existsSync(currentPath)) return;
      const files = fs.readdirSync(currentPath);
      for (const file of files) {
        const fullPath = path.join(currentPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
          walk(fullPath);
        } else if (file.endsWith('.jar')) {
          jars.push(fullPath);
        }
      }
    }

    walk(librariesDir);
    jars.push(clientJar);
    return jars.join(process.platform === 'win32' ? ';' : ':');
  };

  const classpath = collectClasspath();
  const args = [
    '-Xmx2G',
    // '-Djava.library.path=' + nativesDir,
    '-cp', classpath,
    'net.minecraft.client.main.Main',
    '--username', username,
    '--version', versionId,
    '--gameDir', baseDir,
    '--assetsDir', assetDir,
    '--assetIndex', versionId,
    '--accessToken', '0', // піратка
    '--userType', 'legacy',
  ];


  console.log('Launching Minecraft...');
  const mc = spawn(javaPath, args, { stdio: 'inherit' });

  mc.on('exit', (code: any) => {
    console.log(`Minecraft exited with code ${code}`);
  });
};


export default gameVersionsHandlers;

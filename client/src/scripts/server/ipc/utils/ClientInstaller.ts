import path from 'path';
import fs from 'fs';
import ClientLauncher from "./ClientLauncher";
import FileManager from './FileManager';
import os from 'os';
import unzipper from 'unzipper';

class ClientInstaller {
  #versionId: string;
  #manifestUrl: string;
  #targetDir: string;
  #rewrite: boolean;
  #manifestData: any;

  constructor(versionId: string, manifestUrl: string, rootDir: string, rewrite?: boolean) {
    this.#manifestUrl = manifestUrl;
    this.#versionId = versionId;
    this.#targetDir = path.join(rootDir, 'installed_versions');
    this.#rewrite = !!rewrite;
  };

  async fullInstall() {
    const isManifest = await this.getManifest();
    const isInstalled = await this.checkIfInstalledClient();
    // if(isInstalled && (!this.#rewrite || isManifest)) // потім додати можна відповідно збереження версій локально, аби не викликати маніфест
    //   return ClientLauncher.launchClient(this.#manifestData.id);
    await this.downloadClient();
    await this.downloadLibs();
    await this.downloadAssets();
    await this.downloadNatives();
    ClientLauncher.launchClient(this.#manifestData.id);
  };

  async getManifest() {
    const manifestRes = await fetch(this.#manifestUrl);
    if(!manifestRes.ok)
      return false;
    this.#manifestData = await manifestRes.json();
  };

  async checkIfInstalledClient(skipHash?: boolean) {
    const versionPath = path.join(this.#targetDir, 'versions', `${this.#versionId}.jar`);
    const exists = fs.existsSync(versionPath);
    if(exists && this.#manifestData && !skipHash) {
      const { downloads: { client: { sha1, }, }, } = this.#manifestData;
      const existingHash = await FileManager.calculateFileHash(versionPath);
      return existingHash === sha1;
    };
    return exists;
  };

  async downloadClient(ignoreHash?: boolean) {
    const clientJarUrl = this.#manifestData.downloads.client.url;
    await FileManager.downloadFile(
      clientJarUrl,
      `${this.#targetDir}/versions/${this.#manifestData.id}.jar`,
      ignoreHash ? undefined : this.#manifestData.downloads.client.sha1
    );
  };

  async downloadLibs(ignoreHash?: boolean) {
    for (const lib of this.#manifestData.libraries) {
      const artifact = lib.downloads?.artifact;
      if (artifact?.url && artifact?.path && artifact?.sha1) {
        const filePath = path.join(this.#targetDir, `libraries`, artifact.path);

        let shouldDownload = true;
        if (fs.existsSync(filePath) && !ignoreHash) {
          const existingHash = await FileManager.calculateFileHash(filePath);
          if (existingHash === artifact.sha1) {
            shouldDownload = false;
          } else {
            console.warn(`[WARN] Hash mismatch for ${artifact.path}, redownloading.`);
          }
        }

        if (shouldDownload) {
          await FileManager.downloadFile(
            artifact.url,
            filePath,
            undefined
          );
        }
      }
    }
  }

  async downloadNatives() {
    for (const lib of this.#manifestData.libraries) {
      if (!lib.natives) continue;

      const platform = (() => {
        switch (os.platform()) {
          case 'win32': return 'windows';
          case 'darwin': return 'osx';
          case 'linux': return 'linux';
          default: return null;
        }
      })();
      if (!platform) continue;

      if (!lib.natives[platform]) continue;

      const classifier = lib.natives[platform].replace('${arch}', os.arch());
      if (!lib.downloads?.classifiers?.[classifier]) continue;

      const nativeUrl = lib.downloads.classifiers[classifier].url;
      const nativePath = path.join(this.#targetDir, 'natives', path.basename(nativeUrl));

      fs.mkdirSync(path.dirname(nativePath), { recursive: true });

      await FileManager.downloadFile(nativeUrl, nativePath);

      await fs.createReadStream(nativePath)
        .pipe(unzipper.Extract({ path: path.join(this.#targetDir, 'natives') }))
        .promise();

      // fs.unlinkSync(nativePath);
    }
  };

  async downloadAssets(ignoreHash?: boolean) {
    const assetIndexRes = await fetch(this.#manifestData.assetIndex.url);
    const assetIndex = await assetIndexRes.json();
    const assetContent = JSON.stringify(assetIndex);
    const assetIndexPath = path.join(this.#targetDir, `assets/indexes`, `${this.#manifestData.id}.json`);

    fs.mkdirSync(path.dirname(assetIndexPath), { recursive: true });
    const writeStream = fs.createWriteStream(assetIndexPath);
    writeStream.write(assetContent);
    writeStream.end();

    for(const asset of Object.values(assetIndex.objects)) {
      const hash = (asset as any).hash;
      const subdir = hash.substring(0, 2);
      const assetUrl = `https://resources.download.minecraft.net/${subdir}/${hash}`;
      const assetPath = path.join(this.#targetDir, `assets`, 'objects', subdir, hash);
      await FileManager.downloadFile(
        assetUrl,
        assetPath,
        ignoreHash ? undefined : hash
      );
    };
  };
};

export default ClientInstaller;

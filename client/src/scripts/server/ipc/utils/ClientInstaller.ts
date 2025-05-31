import path from 'path';
import fs from 'fs';
import ClientLauncher from "./ClientLauncher";
import FileManager from './fileManager';


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
    this.#rewrite = rewrite;
  };

  async fullInstall() {
    await this.getManifest();
    const isInstalled = await this.checkIfInstalledClient();
    if(isInstalled && !this.#rewrite)
      return ClientLauncher.launchClient(this.#manifestData.id);
    await this.downloadClient();
    await this.downloadLibs();
    await this.downloadAssets();
    ClientLauncher.launchClient(this.#manifestData.id);
  };

  async getManifest() {
    const manifestRes = await fetch(this.#manifestUrl);
    if(!manifestRes.ok)
      throw new Error('Cannot get manifest file');
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
    for(const lib of this.#manifestData.libraries) {
      const artifact = lib.downloads?.artifact;
      if(artifact?.url) {
        const filePath = path.join(this.#targetDir, `libraries`, artifact.path);
        await FileManager.downloadFile(
          artifact.url,
          filePath,
          ignoreHash ? undefined : artifact.sha1
        );
      };
    };
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

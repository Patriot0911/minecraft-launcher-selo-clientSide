import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';

const streamPipeline = promisify(pipeline);

class FileManager {
  static async calculateFileHash(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = createHash('sha256');
      const stream = fs.createReadStream(filePath);
      stream.on('data', chunk => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }

  static async downloadFile(url: string, destPath: string, expectedHash?: string) {
    if(fs.existsSync(destPath) && expectedHash) {
      const existingHash = await this.calculateFileHash(destPath);
      if(existingHash === expectedHash) {
        console.log(`File already exists and hash matches: ${destPath}`);
        return false;
      };
      console.log(`Hash mismatch, redownloading: ${destPath}`);
    };

    const response = await fetch(url);
    if(!response.ok || !response.body) {
      throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
    };

    const nodeStream = response.body as unknown as NodeJS.ReadableStream;
    fs.mkdirSync(path.dirname(destPath), { recursive: true });

    const writer = fs.createWriteStream(destPath);
    await streamPipeline(nodeStream, writer);

    if(expectedHash) {
      const downloadedHash = await this.calculateFileHash(destPath);
      if(downloadedHash !== expectedHash)
        throw new Error(`Hash mismatch after download: expected ${expectedHash}, got ${downloadedHash}`);
    };
    return true;
  };
};

export default FileManager;

import fs from 'node:fs';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';

const streamPipeline = promisify(pipeline);

async function downloadFile(url: string, destPath: string) {
  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
  }
  const nodeStream = response.body as unknown as NodeJS.ReadableStream;
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  const writer = fs.createWriteStream(destPath);
  await streamPipeline(nodeStream, writer);
};

export default downloadFile;

import fs from 'fs/promises';
import path from 'path';

async function downloadFile(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}`);

  await fs.mkdir(path.dirname(dest), { recursive: true });

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await fs.writeFile(dest, buffer);
}

async function downloadRuntime(manifest, baseDir) {
  for (const [filePath, fileInfo] of Object.entries(manifest.files)) {
    const fullPath = path.join(baseDir, filePath);

    if (fileInfo.type === 'directory') {
      await fs.mkdir(fullPath, { recursive: true });
      continue;
    }

    const url = fileInfo.downloads.raw.url;

    console.log(`Downloading ${filePath}...`);
    await downloadFile(url, fullPath);

    if (fileInfo.executable) {
      // Для Unix-систем зробити файл виконуваним
      await fs.chmod(fullPath, 0o755);
    }
  }
}

// Виклик
(async () => {
  const manifestUrl = 'https://piston-meta.mojang.com/v1/packages/3bfc5fdcc28d8897aa12f372ea98a9afeb11a813/manifest.json';
  const baseDir = './java-runtime';

  const res = await fetch(manifestUrl);
  const manifest = await res.json();

  await downloadRuntime(manifest, baseDir);

  console.log('Runtime downloaded successfully');
})();

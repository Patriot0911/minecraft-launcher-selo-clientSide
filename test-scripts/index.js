const { spawn } = require('child_process');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

(async () => {
  const res = await fetch('https://launchermeta.mojang.com/mc/game/version_manifest.json');
  const data = await res.json();
  const { versions, } = data;
  const latestVersion = versions[0];
  const { url: versionMetaUrl, } = latestVersion;

  const versionMetaRes = await fetch(versionMetaUrl);
  const versionMetaData = await versionMetaRes.json();

  console.log('Executing script...');

  const clientJarUrl = versionMetaData.downloads.client.url;
  await downloadFile(clientJarUrl, `downloads/version-${versionMetaData.id}/client.jar`);

  for(const lib of versionMetaData.libraries) {
    const artifact = lib.downloads?.artifact;
    if(artifact?.url) {
      const filePath = path.join(__dirname, `downloads/version-${versionMetaData.id}/libraries`, artifact.path);
      await downloadFile(artifact.url, filePath);
    };
  };

  const assetIndexRes = await axios.get(versionMetaData.assetIndex.url);
  const assetIndex = assetIndexRes.data;

  const assetContent = JSON.stringify(assetIndex);

  const assetIndexPath = path.join(__dirname, `downloads/version-${versionMetaData.id}/assets/indexes/${versionMetaData.id}`);
  fs.mkdirSync(path.dirname(assetIndexPath), { recursive: true });
  const writeStream = fs.createWriteStream(assetIndexPath);
  writeStream.write(assetContent);
  writeStream.end();

  for(const asset of Object.values(assetIndex.objects)) {
    const hash = asset.hash;
    const subdir = hash.substring(0, 2);
    const assetUrl = `https://resources.download.minecraft.net/${subdir}/${hash}`;
    const assetPath = path.join(__dirname, `downloads/version-${versionMetaData.id}/assets`, 'objects', subdir, hash);
    await downloadFile(assetUrl, assetPath);
  };
  console.log('Done');


  startMinecraftClient(versionMetaData.id);
})();


async function downloadFile(url, destPath) {
  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream',
  });

  fs.mkdirSync(path.dirname(destPath), { recursive: true });

  const writer = fs.createWriteStream(destPath);
  return new Promise((resolve, reject) => {
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

async function startMinecraftClient(version) {
  const username = 'TestUser';
  const javaPath = 'java'; // хз за це, може треба буде брати JAVA_HOME


  const baseDir = path.join(__dirname, `downloads/version-${version}`);
  const librariesDir = path.join(baseDir, 'libraries');
  const clientJar = path.join(baseDir, `client.jar`);
  const assetDir = path.join(baseDir, 'assets');
  // const nativesDir = path.join(baseDir, 'natives'); // це МОЖЛИВО потрібна хрінь, якщо чиста джава стоїть. Поки за це не дивився у конкретиці

  function collectClasspath() {
    const jars = [];

    function walk(currentPath) {
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
    '--version', version,
    '--gameDir', baseDir,
    '--assetsDir', assetDir,
    '--assetIndex', version,
    '--accessToken', '0', // піратка
    '--userType', 'legacy',
  ];


  console.log('Launching Minecraft...');
  const mc = spawn(javaPath, args, { stdio: 'inherit' });

  mc.on('exit', code => {
    console.log(`Minecraft exited with code ${code}`);
  });
};

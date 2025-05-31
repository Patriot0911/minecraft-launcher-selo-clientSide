
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

class ClientLauncher {
  static ramSize: number = 16;

  static launchClient(versionId: string) {
    const rootDir = process.cwd();
    const targetDir = path.join(rootDir, 'installed_versions');

    const username = 'TestUser';
    const javaPath = "java";

    const baseDir = targetDir;
    const librariesDir = path.join(baseDir, 'libraries');
    const clientJar = path.join(baseDir, 'versions', `${versionId}.jar`);
    const assetDir = path.join(baseDir, 'assets');
    const nativesDir = path.join(baseDir, 'natives');

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
      `-Djava.library.path=${nativesDir}`,
      `-Xmx${this.ramSize}G`,
      '-cp', classpath,
      'net.minecraft.client.main.Main',
      '--username', username,
      '--version', versionId,
      '--gameDir', baseDir,
      '--assetsDir', assetDir,
      '--assetIndex', versionId,
      '--accessToken', '0',
      '--userType', 'legacy',
    ];

    fs.writeFileSync('classpath.txt', args.join(' '));

    console.log('Launching Minecraft...');
    const mc = spawn(javaPath, ['@classpath.txt'], { stdio: 'inherit', });

    mc.on('exit', (code: any) => {
      console.log(`Minecraft exited with code ${code}`);
    });
  };
};

export default ClientLauncher;

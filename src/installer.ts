import { downloadFile } from "./download-mgr";
import { extractFile } from "./extractor";
import path from "path";
import envPaths from "env-paths-ts";
import { mkdirp } from "mkdirp";

interface SetupOptions {
  outputDir: string;
  id: string;
  downloadLink: string;
  cacheDir?: string;
  force?: boolean;
  displayName?: string;
  skipSetup: () => Promise<boolean>;
}

export async function setupQT(options: SetupOptions): Promise<string> {
  const { downloadLink, cacheDir, force, displayName, outputDir, id, skipSetup } = options;

  const downloadName = displayName || id;

  const archivePath = path.resolve(cacheDir || envPaths(`${id}`).cache, path.basename(downloadLink));

  await mkdirp(outputDir);

  if ((await skipSetup()) && !force) {
    console.log(`Skipping installation for ${downloadName}...`);
    return outputDir;
  }

  console.log(`Downloading ${downloadName}...`);
  await downloadFile(downloadLink, archivePath, { name: downloadName, skipIfExists: !force });
  await extractFile(archivePath, outputDir);
  console.log(`Installed ${downloadName} to ${outputDir}`);

  return outputDir;
}

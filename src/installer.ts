import { downloadFile } from "./download-mgr";
import { extractFile } from "./extractor";
import path from "path";
import envPaths from "env-paths";
import mkdir from "make-dir";

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

  const archivePath = path.resolve(cacheDir || envPaths(`${id}`).cache, path.basename(downloadLink));

  await mkdir.makeDirectory(outputDir);

  if ((await skipSetup()) && !force) {
    console.log(`Skipping installation for ${displayName}...`);
    return outputDir;
  }

  await downloadFile(downloadLink, archivePath);
  await extractFile(archivePath, outputDir);
  console.log(`Installed ${displayName} to ${outputDir}`);

  return outputDir;
}

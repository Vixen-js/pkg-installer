import { unpack } from "7zip-min";
import fs from "fs/promises";
import { ExtractError } from "./errors";

function unpackFile(archivePath: string, outputDir: string): Promise<void> {
  return new Promise((resolve, reject) => {
    unpack(archivePath, outputDir, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

export async function extractFile(archivePath: string, outputDir: string): Promise<void> {
  console.log(`Extracting ${archivePath} to ${outputDir} ...`);
  try {
    await fs.access(archivePath);
  } catch (e) {
    throw new ExtractError(`Archive ${archivePath} does not exist.`);
  }

  await unpackFile(archivePath, outputDir);
  return;
}

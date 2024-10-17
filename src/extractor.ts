import { unpack } from "7zip-min";
import util from "util";
import fs from "fs";
import { ExtractError } from "./errors";

const fsExists = util.promisify(fs.exists);

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
  if (!(await fsExists(archivePath))) {
    throw new ExtractError(`Archive ${archivePath} does not exist.`);
  }

  await unpackFile(archivePath, outputDir);
  return;
}

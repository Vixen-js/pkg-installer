import util from "util";
import fs from "fs";
import path from "path";
import stream from "stream";
import mkdir from "make-dir";
import Progress from "progress";
import { DownloadError } from "./errors";

const pipeline = util.promisify(stream.pipeline);
const fsExists = util.promisify(fs.exists);

interface DownloadOptions {
  name?: string;
  skipIfExists?: boolean;
}

function setProgress(tokens: string, totalAmount: number): stream.PassThrough {
  const passThrough = new stream.PassThrough();
  const progress = new Progress(tokens, { total: totalAmount });
  passThrough.on("data", (chunk) => progress.tick(chunk.length));

  return passThrough;
}

export async function downloadFile(fileLink: string, outputPath: string, options: DownloadOptions = {}): Promise<void> {
  const name = options.name ?? "";
  const res = await fetch(fileLink);
  if (!res.ok) {
    throw new DownloadError(`Failed to download ${name}:${fileLink}. ${res.statusText}`);
  }
  if (options.skipIfExists && (await fsExists(outputPath))) {
    return console.warn(`⚠️ Archive already exists at ${outputPath}. Skipping Download...`);
  }

  await mkdir.makeDirectory(path.dirname(outputPath));
  const total = +`${res.headers.get("content-length") ?? 0}`;
  const totalInMb = (total / 1024 / 1024).toFixed(2);
  await pipeline(
    res.body!,
    setProgress(`Downloading ${name} [:bar] :percent of ${totalInMb} MB :etas`, total),
    fs.createWriteStream(outputPath),
  );
}

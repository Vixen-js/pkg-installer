import fsp from "fs/promises";
import fs from "fs";
import path from "path";
import { mkdirp } from "mkdirp";
import Progress from "progress";
import { DownloadError } from "./errors";

interface DownloadOptions {
  name?: string;
  skipIfExists?: boolean;
}

export async function downloadFile(fileLink: string, outputPath: string, options: DownloadOptions = {}): Promise<void> {
  const name = options.name ?? "";
  const res = await fetch(fileLink);
  if (!res.ok) {
    throw new DownloadError(`Failed to download ${name}:${fileLink}. ${res.statusText}`);
  }
  if (options.skipIfExists) {
    try {
      await fsp.access(outputPath);
      return console.warn(`⚠️ Archive already exists at ${outputPath}. Skipping Download...`);
    } catch (e) {}
  }

  await mkdirp(path.dirname(outputPath));
  const total = +`${res.headers.get("content-length") ?? 0}`;
  const totalInMb = (total / 1024 / 1024).toFixed(2);

  const reader = res.body!.getReader();
  const stream = fs.createWriteStream(outputPath);
  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    const bar = new Progress(`Downloading ${name} [:bar] :percent of ${totalInMb}MB :etas`, {
      complete: "=",
      incomplete: " ",
      width: 20,
      total: total,
    });

    bar.tick(value.byteLength);
    stream.write(value);
  }
  stream.close();
  return;
}

import path from "path";
import fs from "fs";
import { setupQT } from "../src/index";
import { outputDir, TIMEOUT, metadata } from "./utils";

describe("SetupQT for darwin", () => {
  const osType = "darwin";
  const _outputDir = outputDir(osType);
  let outPath = "";
  const skipSetup = async (): Promise<boolean> => {
    return fs.existsSync(path.resolve(_outputDir, "6.6.0", "macos", "lib"));
  };
  beforeAll(async () => {
    outPath = await setupQT({ outputDir: _outputDir, downloadLink: metadata.darwin, skipSetup, id: "vixen-js-qt" });
  }, TIMEOUT);

  test("check if output path is same as specified: ", () => {
    expect(outPath).toBe(_outputDir);
  });

  test("check if qt exists", () => {
    const expectedPath = `6.6.0/macos`;
    const doesQtExist = fs.existsSync(path.resolve(_outputDir, expectedPath));
    expect(doesQtExist).toBe(true);
  });
});

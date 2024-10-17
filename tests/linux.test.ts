import path from "path";
import fs from "fs";
import { setupQT } from "../src/index";
import { outputDir, TIMEOUT, metadata } from "./utils";

describe("SetupQT for linux", () => {
  const osType = "linux";
  const outDir = outputDir(osType);
  let outPath = "";
  const skipSetup = async (): Promise<boolean> => {
    return fs.existsSync(path.resolve(outDir, "5.13.0", "gcc_64", "lib"));
  };
  beforeAll(async () => {
    outPath = await setupQT({ outputDir: outDir, skipSetup, downloadLink: metadata.linux, id: "vixen-js-qt" });
  }, TIMEOUT);

  test("check if output path is same as specified: ", () => {
    expect(outPath).toBe(outDir);
  });

  test("check if qt exists", () => {
    const expectedPath = `5.13.0/gcc_64`;
    const doesQtExist = fs.existsSync(path.resolve(outDir, expectedPath));
    expect(doesQtExist).toBe(true);
  });
});

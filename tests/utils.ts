import path from "path";

export const TIMEOUT = 60000;
export const outputDir = (osType: string) => path.resolve(__dirname, `../output/${osType}`);

export const metadata = {
  darwin:
    "https://download.qt.io/online/qtsdkrepository/mac_x64/desktop/qt6_660/qt.qt6.660.clang_64/6.6.0-0-202310040910qtbase-MacOS-MacOS_12-Clang-MacOS-MacOS_12-X86_64-ARM64.7z",
  linux:
    "https://download.qt.io/online/qtsdkrepository/linux_x64/desktop/qt6_660/qt.qt6.660.gcc_64/6.6.0-0-202310040911qtbase-Linux-RHEL_8_6-GCC-Linux-RHEL_8_6-X86_64.7z",
};

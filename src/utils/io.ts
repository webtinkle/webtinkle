import { existsSync, lstatSync, readdirSync, rmdirSync, unlinkSync } from "fs";
import { getConfigOption } from "../config";

export function rimraf(path: string) {
    if (existsSync(path)) {
        readdirSync(path).forEach((file) => {
          const curPath = path + "/" + file;
          if (lstatSync(curPath).isDirectory()) { // recurse
            rimraf(curPath);
          } else { // delete file
            unlinkSync(curPath);
          }
        });
        rmdirSync(path);
      }
}

export function getNginxConfigFolder() {
    const configFolder = getConfigOption("nginx.configFolder");
    if (!lstatSync(configFolder).isDirectory()) {
        throw new Error("nginx.configFolder must point to a directory.");
    }
    return configFolder;
}

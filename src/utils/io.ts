import { lstatSync } from "fs";
import { getConfigOption } from "../config";

export function getNginxConfigFolder() {
    const configFolder = getConfigOption("nginx.configFolder");
    if (!lstatSync(configFolder).isDirectory()) {
        throw new Error("nginx.configFolder must point to a directory.");
    }
    return configFolder;
}

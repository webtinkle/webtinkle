import { existsSync, unlinkSync, writeFileSync } from "fs";
import { join } from "path";

export function getConfig() {
    try {
        return require("../config.json");
    } catch (ex) {
        try {
            return require("../config.fallback.json");
        } catch (ex) {
            throw new Error("Cannot load config.json");
        }
    }
}

export function setConfig(config: string) {
    const configFilePath = join(__dirname, "../config.json");
    if (existsSync(configFilePath)) {
        unlinkSync(configFilePath);
    }
    writeFileSync(configFilePath, JSON.stringify(config, undefined, 4));
}

export function getConfigOption(property: string) {
    const config = getConfig();
    if (typeof config[property] === "undefined") {
        return null;
    }
    return config[property];
}

export function setConfigOption(property: string, value: any) {
    const config = getConfig();
    config[property] = value;
    setConfig(config);
}

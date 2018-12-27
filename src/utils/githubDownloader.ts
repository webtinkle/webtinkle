import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import request from "request-promise-native";
import { rimraf } from "./io";
import { logger } from "./logging";

export interface IRepo {
    user: string;
    repo: string;
    branch: string;
}

export function getDirectoryData(repo: IRepo, path: string) {
    return request({
        headers: {
            "User-Agent": "webtinkle",
        },
        json: true,
        method: "get",
        uri: `https://api.github.com/repos/${repo.user}/${repo.repo}/contents/${path}?ref=${repo.branch}`,
    });
}

export function isDirectory(repo: IRepo, path: string) {
    return getDirectoryData(repo, path)
        .then((res) => res instanceof Array);
}

export function getFileData(repo: IRepo, path: string) {
    return request({
        headers: {
            "User-Agent": "webtinkle",
        },
        method: "get",
        uri: `https://raw.githubusercontent.com/${repo.user}/${repo.repo}/${repo.branch}/${path}`,
    });
}

export async function download(repo: IRepo, originPath: string, localPath: string) {
    if (await isDirectory(repo, originPath)) {
        if (existsSync(localPath)) {
            rimraf(localPath);
        }
        mkdirSync(localPath);

        for (const file of await getDirectoryData(repo, originPath)) {
            await download(repo, join(originPath, file.name), join(localPath, file.name));
        }
    } else {
        logger.debug("Downloading file '" + originPath + "'");
        const fileData = await getFileData(repo, originPath);
        writeFileSync(localPath, fileData);
        logger.debug("Downloaded file '" + originPath + "'");
    }
}

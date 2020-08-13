import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import axios from "axios";
import { rimraf } from "./io";
import { logger } from "./logging";

export interface IRepo {
    user: string;
    repo: string;
    branch: string;
}

export async function getDirectoryData(repo: IRepo, path: string) {
    const req = await axios({
        headers: {
            "User-Agent": "webtinkle",
            "Content-Type": "application/json",
        },
        method: "get",
        url: `https://api.github.com/repos/${repo.user}/${repo.repo}/contents/${path}?ref=${repo.branch}`,
    });
    return req.data;
}

export async function isDirectory(repo: IRepo, path: string) {
    const res = await getDirectoryData(repo, path);
    return res instanceof Array;
}

export async function getFileData(repo: IRepo, path: string) {
    const req = await axios({
        headers: {
            "User-Agent": "webtinkle",
        },
        method: "get",
        url: `https://raw.githubusercontent.com/${repo.user}/${repo.repo}/${repo.branch}/${path}`,
    });
    return req.data;
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

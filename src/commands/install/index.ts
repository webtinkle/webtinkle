import { CommanderStatic } from "commander";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { catchActionErrors } from "../../utils/error";
import { download, IRepo, isDirectory } from "../../utils/githubDownloader";
import { logger } from "../../utils/logging";

export function initialize(program: CommanderStatic) {

    program
        .command("install <templateName>")
        .alias("i")
        .description("Install a template")
        .action(catchActionErrors(execute));

}

export async function execute(templateName: string, opt: any) {
    if (!templateName.match(/^[A-Za-z0-9_\-]+$/)) {
        throw new Error("Invalid template name format, expected /^[A-Za-z0-9_\-]+$/");
    }

    const repo: IRepo = {
        branch: "master",
        repo: "webtinkle-templates",
        user: "webtinkle",
    };

    const templateFolder = join(__dirname, "../../../templates");

    if (!existsSync(templateFolder)) {
        mkdirSync(templateFolder);
    }

    if (!await isDirectory(repo, "/" + templateName)) {
        throw new Error("File found but a folder was expected.");
    }

    logger.info("Downloading template '" + templateName + "'");
    await download(repo, "/" + templateName, join(templateFolder, templateName));
    logger.info("Downloaded template '" + templateName + "'");
}

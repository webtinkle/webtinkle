import { CommanderStatic } from "commander";
import { join } from "path";
import { catchActionErrors } from "../../utils/error";
import { logger } from "../../utils/logging";
import rimraf from "rimraf";

export function initialize(program: CommanderStatic) {

    program
        .command("uninstall <templateName>")
        .description("Uninstall an installed template")
        .action(catchActionErrors(execute));

}

export async function execute(templateName: string, opt: any) {
    if (!templateName.match(/^[A-Za-z0-9_\-]+$/)) {
        throw new Error("Invalid template name format, expected /^[A-Za-z0-9_\-]+$/");
    }

    const templateFolder = join(__dirname, "../../../templates");

    logger.info("Removing template '" + templateName + "'");
    rimraf.sync(join(templateFolder, templateName));
    logger.info("Removed template '" + templateName + "'");
}

import { CommanderStatic } from "commander";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { prompt } from "inquirer";
import { join } from "path";
import { generateConfigFromTemplate } from "../../nginx/configPreprocessor";
import { Template } from "../../nginx/Template";
import { catchActionErrors } from "../../utils/error";
import { getNginxConfigPath } from "../../utils/io";
import { logger } from "../../utils/logging";

export function initialize(program: CommanderStatic) {

    program
        .command("add <domain>")
        .description("Add a website configuration to NGINX.")
        .usage("<domain> -t <template>")
        .option("-t, --template <name>", "Selects a template to use")
        .action(catchActionErrors(execute));

}

export async function execute(domain: string, opt: any) {
    const nginxConfigPath = getNginxConfigPath();

    const templateName = typeof opt.template !== "undefined" && opt.template != null ? opt.template : "default";
    const path = __dirname + "/../../../templates/" + templateName;

    let wtkFileData: any = {};
    let removeOldFiles = false;
    let removeOldFilesConfirmed = false;
    logger.debug("Checking for existing files.");

    if (existsSync(join(nginxConfigPath, domain + ".conf"))) {
        removeOldFiles = true;
        logger.debug("Existing '" + domain + ".conf' found.");
    }

    if (existsSync(join(nginxConfigPath, domain + ".wtk"))) {
        logger.debug("Existing '" + domain + ".wtk' found.");
        wtkFileData = JSON.parse(readFileSync(join(nginxConfigPath, domain + ".wtk")).toString());
        if (wtkFileData.template !== templateName) {
            removeOldFiles = true;
            logger.debug("File template don't correspond to chosen template.");
        } else {
            const value = await prompt<any>([
                {
                    message: "Do you want to use the previous template configuration?",
                    name: "confirm",
                    type: "confirm",
                },
            ]);

            if (value.confirm) {
                removeOldFiles = false;
            } else {
                removeOldFiles = true;
                removeOldFilesConfirmed = false;
            }
        }
    }

    if (removeOldFiles) {
        if (!removeOldFilesConfirmed) {
            const value = await prompt<any>([
                {
                    message: "An existing configuration file was found. Remove it?",
                    name: "confirm",
                    type: "confirm",
                },
            ]);

            if (!value.confirm) {
                logger.info("Cancelled.");
                return;
            }
        }
        logger.silly("Removal confirmed.");

        wtkFileData = {};
        if (existsSync(join(nginxConfigPath, domain + ".conf"))) {
            unlinkSync(join(nginxConfigPath, domain + ".conf"));
        }
        if (existsSync(join(nginxConfigPath, domain + ".wtk"))) {
            unlinkSync(join(nginxConfigPath, domain + ".wtk"));
        }
    }

    if (!existsSync(path)) {
        throw new Error("Template '" + templateName + "' was not found.");
    }
    if (!existsSync(path + "/template.conf")) {
        throw new Error("File '" + templateName + "/template.conf" + "' was not found.");
    }

    const hasTemplateScript = existsSync(path + "/template.js");

    let preprocessedVariables = { DOMAIN: domain };

    if (hasTemplateScript) {
        let template: Template;

        try {
            // TODO: Use a better template system
            // It works™
            global.Template = Template;
            const moduleFile = path + "/template.js";
            const templateClass = require(moduleFile);
            template = new templateClass();
            if (typeof wtkFileData.values !== "undefined") {
                logger.silly("Applying previous values", wtkFileData.values);
                template.__lastValues_ = wtkFileData.values;
                logger.silly("Applied previous values", template.__lastValues_);
            }
        } catch (ex) {
            if (process.env.VERBOSE) {
                logger.error(ex);
            }
            throw new Error("An error occured while initializing template.");
        }

        logger.debug("Running template beforeAdding()");

        await template.beforeAdding();

        logger.debug("Completed template beforeAdding()");

        preprocessedVariables = { ...preprocessedVariables, ...template.variables };
        wtkFileData = {
            template: templateName,
            values: template.__lastValues_,
        };
    }

    logger.debug("Generating template...");
    const config = generateConfigFromTemplate(path + "/template.conf", preprocessedVariables);
    logger.debug("Generated template.");

    logger.debug(config);

    writeFileSync(join(nginxConfigPath, domain + ".conf"), config);

    if (hasTemplateScript && wtkFileData !== "" && wtkFileData !== "{}") {
        writeFileSync(join(nginxConfigPath, domain + ".wtk"), JSON.stringify(wtkFileData));
    }
    logger.info("Added " + domain + " to NGINX.");
    logger.info("Restart NGINX to apply changes.");
}

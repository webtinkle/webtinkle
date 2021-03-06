import { CommanderStatic } from "commander";
import { existsSync, unlinkSync } from "fs";
import { join } from "path";
import { getNginxConfigFolder } from "../../utils/io";
import { logger } from "../../utils/logging";

export function initialize(program: CommanderStatic) {

    program
        .command("remove <domain>")
        .alias("rm")
        .description("Remove a website configuration from NGINX.")
        .option("-t, --template <name>", "Selects a template to use")
        .action(execute);

}

export function execute(domain: string, opt: any) {
    const nginxConfigFolder = getNginxConfigFolder();

    if (existsSync(join(nginxConfigFolder, domain + ".conf"))) {
        logger.silly("Removing " + domain + ".conf");
        unlinkSync(join(nginxConfigFolder, domain + ".conf"));
        logger.silly("Removed " + domain + ".conf");
    }
    if (existsSync(join(nginxConfigFolder, domain + ".wtk"))) {
        logger.silly("Removing " + domain + ".wtk");
        unlinkSync(join(nginxConfigFolder, domain + ".wtk"));
        logger.silly("Removed " + domain + ".wtk");
    }
    logger.info("Removed " + domain + " from NGINX.");
    logger.info("Restart NGINX to apply changes.");
}

import program from "commander";
import { lstatSync, readdirSync } from "fs";
import { getConfigOption } from "./config";
import { parseLogLevel, setLogLevel } from "./utils/logging";

// tslint:disable-next-line:no-var-requires
const { version } = require("../package.json");

program.version(version);

program.option("-L, --loglevel [level]", "Sets the logging level [info]", "info");

program.on("option:loglevel", function(this: { loglevel: string }) {
    const logLevel = parseLogLevel(this.loglevel);
    setLogLevel(logLevel);
});

program.on("command:*", () => {
    console.error("Invalid command: %s\nSee --help for a list of available commands.", program.args.join(" "));
    process.exit(1);
});

for (const file of readdirSync(__dirname + "/commands")) {
    // tslint:disable-next-line:no-var-requires
    const command = require("./commands/" + file);
    command.initialize(program);
}

program.parse(process.argv);

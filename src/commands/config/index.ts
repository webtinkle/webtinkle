import { CommanderStatic } from "commander";
import { getConfig, getConfigOption, setConfigOption } from "../../config";
import { catchActionErrors } from "../../utils/error";

export function initialize(program: CommanderStatic) {

    program
        .command("config [property] [value]")
        .alias("cfg")
        .description("Get configuration properties, or set a property to a value if the value is specified.")
        .action(catchActionErrors(execute));

}

export async function execute(property: string | undefined, value: string | undefined, opt: any) {
    if (typeof property === "undefined" && typeof value === "undefined") {

        const config = getConfig();
        for (const prop in config) {
            if (typeof config[prop] !== "undefined") {
                console.log(prop, "=", config[prop]);
            }
        }

    } else if (typeof property !== "undefined" && typeof value === "undefined") {

        console.log(getConfigOption(property));

    } else if (typeof property !== "undefined" && typeof value !== "undefined") {

        setConfigOption(property, value);

    }
}

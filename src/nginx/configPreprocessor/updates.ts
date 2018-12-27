import { IGroup, ILiteral } from "nginx-config-ast/build/parser";
import { variables } from ".";
import { logger } from "../../utils/logging";

export function ifStatement(group: IGroup) {
    let isExpected = true;

    const args = [];
    for (const arg of group.args!) {
        if (arg.type !== "literal") { throw new Error("Invalid argument provided in %if"); }
        args.push((<ILiteral> arg).value);
    }

    if (args[0] === "not") {
        args.shift();
        isExpected = false;
    }

    for (const arg of args) {
        // If a variable was expected but doesn't exists or if a variable wasn't expected but does exists
        if (
               (typeof variables[arg] === "undefined" || variables[arg] === "") && isExpected
            || (typeof variables[arg] !== "undefined" || variables[arg] !== "") && !isExpected
        ) {

            if (isExpected) {
                logger.silly(arg + " was expected but was not found.");
            } else {
                logger.silly(arg + " was not expected but was found.");
            }

            logger.silly("Removing %if statement");
            // Doesn't return any statement
            return [];
        }
    }

    logger.silly("Returning %if child statements");
    // Return child statements
    return group.statements;
}

export function variableLiteralValue(literal: ILiteral) {
    literal.value = literal.value.replace(/(.|^)%([a-zA-Z\_][a-zA-Z0-9\_]*)/g, (match, previousChar, variable) => {
        if (previousChar === "%") { return match.substring(1); }

        return typeof variables[variable] !== "undefined"
            ? variables[variable]
            : "";
    });

    return literal;
}

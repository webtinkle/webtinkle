import { readFileSync } from "fs";
import { generateAST, generateConfig } from "nginx-config-ast";
import { visitProgram } from "./visitor";

export let variables: any = {};

export function generateConfigFromTemplate(file: string, vars: any) {
    let code = readFileSync(file).toString();

    // Some little regular expressions to don't have to fork nginx-config-ast
    // Replaces "%if " with "__template_if "
    code = code.replace(/%if /, "__template_if ");

    let ast = generateAST(code, { noComments: true });

    variables = vars;

    ast = visitProgram(ast);
    return generateConfig(ast);
}

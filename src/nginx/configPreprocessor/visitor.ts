import {
    IDeclarationStatement,
    IGroup,
    ILiteral,
    INode,
    IProgram,
    IStatement,
} from "nginx-config-ast/build/parser";
import { logger } from "../../utils/logging";
import { ifStatement, variableLiteralValue } from "./updates";

export function visitProgram(ast: IProgram) {
    logger.silly("Start visiting program");

    ast.statements = <IStatement[]> visitNodes(ast.statements);

    logger.silly("End visiting program");
    return ast;
}

function visitGroup(group: IGroup) {
    if (group.name.value.substr(0, 11) === "__template_") {
        switch (group.name.value.substr(11)) {

            // %if VARIABLE {}
            case "if":
                if (group.args == null || group.args.length <= 0) { break; }
                return ifStatement(group);

        }
    }

    group.statements = <IStatement[]> visitNodes(group.statements);

    return group;
}

function visitDeclaration(statement: IDeclarationStatement) {
    return statement;
}

function visitLiteralString(literal: ILiteral) {
    // We replace variable placeholders by their values
    return variableLiteralValue(literal);
}

// Below is more boring stuff but also the most important

function visitNode(node: INode): INode | INode[] {
    switch (node.type) {
        case "statement":
        case "group":
            return visitStatement(<IStatement> node);
        case "literal":
            return visitLiteral(<ILiteral> node);
        default:
            return node;
    }
}

function visitNodes(nodes: INode[]): INode[] {
    const newNodes = [];
    for (const node of nodes) {
        const newNode = visitNode(node);

        if (newNode instanceof Array) {
            for (const child of newNode) {
                newNodes.push(child);
            }
        } else {
            newNodes.push(newNode);
        }
    }

    return newNodes;
}

function visitStatement(statement: IStatement) {
    let newStatement: IStatement | IStatement[];

    const oldStatementName = statement.name.value;
    logger.silly("Start visiting " + statement.type + ": " + oldStatementName);

    if (statement.type === "group") {
        newStatement = visitGroup(<IGroup> statement);
    } else {
        newStatement = visitDeclaration(<IDeclarationStatement> statement);
    }

    if (newStatement instanceof Array) {
        newStatement.forEach((s) => s.args != null && (
            s.args = visitNodes(s.args)
        ));
    } else {
        if (newStatement.args != null) {
            newStatement.args = visitNodes(newStatement.args);
        }
    }

    let comparison = "";
    if (oldStatementName !== statement.name.value) {
        comparison = "  [ -> " + statement.name.value + " ]";
    }
    logger.silly("End visiting " + statement.type + ": " + oldStatementName + comparison);
    return newStatement;
}

function visitLiteral(literal: ILiteral) {
    const oldLiteral = literal.value;
    logger.silly("Start visiting literal: " + oldLiteral);

    // We replace variable placeholders by their values
    literal = visitLiteralString(literal);

    let comparison = "";
    if (oldLiteral !== literal.value) {
        comparison = "  [ -> " + literal.value + " ]";
    }
    logger.silly("End visiting literal: " + oldLiteral + comparison);
    return literal;
}

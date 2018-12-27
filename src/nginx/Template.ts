import { Answers, prompt, Question } from "inquirer";
import { isAbsolute } from "path";
import { URL } from "url";
import { logger } from "../utils/logging";

export interface IQuestion {
    name: string;
    message?: string;
    type?: string;
    default?: string;
    validate?: string | ((str: string) => boolean);
    optional?: boolean;
    [key: string]: any;
}

export class Template {
    // tslint:disable-next-line:variable-name
    public __lastValues_: Answers = {};

    public variables: any = {};

    public beforeAdding(): Promise<string> {
        if (process.env.VERBOSE) {
            logger.verbose("beforeAdding() was not overridden");
        }

        return new Promise((ok) => ok());
    }

    public askQuestions(questions: IQuestion[], cb: (str: Answers) => void) {
        const newQuestions: Array<Question<Answers>> = [];
        for (const question of questions) {
            if (typeof question.validate === "string") {
                switch (question.validate) {
                    case "path":
                        question.validate = isAbsolute;
                        break;
                    case "address":
                        question.validate = (input) => {
                            try {
                                const url = new URL(input);
                                return url != null;
                            } catch (err) {
                                return false;
                            }
                        };
                        break;
                }
            }

            if (typeof question.name === "undefined") {
                throw new TypeError("Name is undefined.");
            }

            const {
                optional,
                name,
            } = question;

            if (typeof this.__lastValues_[name] !== "undefined") {
                question.default = this.__lastValues_[name];
            }

            if (optional) {
                const previousValidate = question.validate; // Variables are used to avoid infinite recursions
                question.validate = (str: string) => (
                    str.trim() === "" || typeof previousValidate !== "function" || previousValidate(str)
                );

                if (typeof question.message !== "undefined") {
                    question.message += " (optional)";
                } else {
                    question.message = name + " (optional)";
                }
            }

            const previousValidate2 = question.validate; // Variables are used to avoid infinite recursions
            question.validate = (str) => (
                typeof previousValidate2 !== "function" || previousValidate2(str)
            );

            newQuestions.push(<Question<Answers>> question);
        }

        return prompt(newQuestions)
            .then((values) => {
                logger.silly("Received answers", values);
                this.__lastValues_ = {...this.__lastValues_, ...values};
                cb(values);
                return values;
            });
    }

    public addVariable(name: string, value: string) {
        if (!name.match(/[A-Za-z\_][A-Za-z0-9\_]*/)) {
            throw new Error("Invalid name format. Expected '[A-Za-z\\_][A-Za-z0-9\\_]*' format.");
        }
        logger.silly("Adding variable", { [name]: value });
        this.variables[name] = value;
    }
}

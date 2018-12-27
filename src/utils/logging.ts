import winston, { createLogger, format } from "winston";

export const logLevels = [ "error", "warn", "info", "verbose", "debug", "silly" ];

const transports = {
    console: new winston.transports.Console({ level: "info" }),
};

export const logger = createLogger({
    format: format.combine(format.colorize(), format.simple()),
    level: "info",
    transports: [
        transports.console,
    ],
});

export function setLogLevel(level: string) {
    process.env.VERBOSE = logLevels.indexOf(level) >= logLevels.indexOf("verbose") as any;
    transports.console.level = level;
}

export function parseLogLevel(level: string) {
    let logLevel = "info";

    let intValue = parseInt(level, 10);
    if (!isNaN(intValue)) {
        if (intValue < 0) {
            intValue = 0;
        }
        if (intValue >= logLevels.length) {
            intValue = logLevels.length - 1;
        }
        logLevel = logLevels[intValue];
    } else {
        logLevel = level;
    }

    if (logLevels.indexOf(logLevel) === -1) {
        throw new Error("Invalid log level: " + logLevel + ".");
    }

    return logLevel;
}

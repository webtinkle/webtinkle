import ts from "gulp-typescript";
import rimraf from "rimraf";

import { dest, series, src } from "gulp";
import { join } from "path";

const tsProject = ts.createProject("./tsconfig.prod.json");
const tsDevProject = ts.createProject("./tsconfig.dev.json");

const delay = (time: number) => (cb: any) => setTimeout(cb, time);

function removeBuild(cb: any) {
    rimraf(join(__dirname, "build"), cb);
}

export const clean = series(
    removeBuild,
    delay(20), // This delay let the operating system unlock the files and the folders
);

export function buildDev() {
    return src(["typings/*", "src/**/*"])
        .pipe(tsDevProject())
        .pipe(dest("build"));
}

export function build() {
    return src(["typings/*", "src/**/*"])
        .pipe(tsProject())
        .pipe(dest("build"));
}

export const dev = series(
    clean,
    buildDev,
);

export const prod = series(
    clean,
    build,
);

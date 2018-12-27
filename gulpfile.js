var gulp = require('gulp');
var ts = require('gulp-typescript');
var clean = require('gulp-clean');

var tsProject = ts.createProject("./tsconfig.prod.json");
var tsDevProject = ts.createProject("./tsconfig.dev.json");

gulp.task("clean:remove-build", function() {
    return gulp.src("build")
        .pipe(clean())
});

gulp.task("clean", ["clean:remove-build"], function(done) {
    setTimeout(done, 20); // This delay let the operating system unlock the files and the folders
});

gulp.task("ts:build-dev", ["clean"], function() {
    return gulp.src(["typings/*", "src/**/*"])
        .pipe(tsDevProject())
        .pipe(gulp.dest("build"));
});

gulp.task("ts:build", ["clean"], function() {
    return gulp.src(["typings/*", "src/**/*"])
        .pipe(tsProject())
        .pipe(gulp.dest("build"));
});

gulp.task("dev", ["ts:build-dev"], function() {});

gulp.task("prod", ["ts:build"], function() {});
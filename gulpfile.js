"use strict";

const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const del = require("del");

var notify = require("gulp-notify");
//css
const postcss = require("gulp-postcss");

var precss = require("precss");
var autoprefixer = require("autoprefixer");
var cssnano = require("cssnano");

const plugins = [
    precss(),
    autoprefixer({ grid: true }),
    cssnano()
];

//js
const uglify = require("gulp-uglify");
//html
const fileinclude = require("gulp-file-include");

var startDir = "./src/";
var destDir = "./build/";

function _css() {
    return gulp
        .src(startDir + "styles.css")
        .pipe(sourcemaps.init())
        .pipe(postcss(plugins))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(destDir))
        .pipe(browserSync.stream());
}
const sass = require("gulp-sass");
sass.compiler = require("node-sass");

function css() {
    return gulp
        .src(startDir + "styles/styles.scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", notify.onError({
            message: "Error: <%= error.message %>",
            title: "SCSS error!"
        })))
        .pipe(postcss(plugins))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(destDir))
        .pipe(browserSync.stream());
}

function js() {
    return gulp
        .src(startDir + "**/*.js")
        .pipe(sourcemaps.init())
        .pipe(concat("scripts.js"))
        .pipe(
            uglify({
                toplevel: true
            })
        )
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(destDir))
        .pipe(browserSync.stream());
}

function html() {
    return gulp
        .src(startDir + "**/*.html")
        .pipe(
            fileinclude({
                prefix: "@",
                basepath: "@file"
            })
        )
        .pipe(gulp.dest(destDir))
        .pipe(browserSync.stream());
}

function assets() {
    return gulp.src("./_task/assets/**/*.*").pipe(gulp.dest(destDir + "/"));
}

function watch() {
    browserSync.init({
        server: {
            baseDir: destDir
        }
        // tunnel: true
    });

    gulp.watch(startDir + "**/*.scss", css);
    gulp.watch(startDir + "**/*.js", js);
    gulp.watch(startDir + "**/*.html", html);
}

gulp.task("clean", () => {
    del([destDir + "templates/"]);
    del([destDir + "css/"]);
    del([destDir + "styles.css.map"]);
});

gulp.task("dev", gulp.series(gulp.parallel(css, js, html, assets), watch));
gulp.task("build", gulp.series(css, js, html, assets));


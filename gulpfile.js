// Gulp.js configuration

const gulp = require("gulp"),
    sass = require("gulp-sass"),
    autoprefixer = require("autoprefixer"),
    postcss = require("gulp-postcss"),
    purgecss = require("@fullhuman/postcss-purgecss"),
    rollup = require("gulp-better-rollup"),
    browserSync = require("browser-sync").create();

// Folders
const src = "assets/src/",
    build = "assets/";

// JavaScript processing
function js() {
    return gulp
        .src(src + "js/**/*.js") // Procesar todos los archivos JS en src/js/
        .pipe(
            rollup(
                {
                    onwarn: function (message) {
                        if (/external dependency/.test(message)) return;
                    },
                },
                "es" // Define el formato de salida
            )
        )
        .pipe(gulp.dest(build + "js/")) // Coloca el archivo procesado en build/js/
        .pipe(browserSync.reload({ stream: true })); // Recarga el navegador automáticamente
}
exports.js = js;

// CSS processing
function css() {
    return gulp
        .src(src + "scss/main.scss", { allowEmpty: true })
        .pipe(
            sass({
                outputStyle: "nested",
                imagePath: "/images/",
                precision: 3,
                errLogToConsole: true,
            }).on("error", sass.logError)
        )
        .pipe(
            postcss([
                purgecss({ content: ["**/*.html", "**/*.php"] }),
                autoprefixer(),
            ])
        )
        .pipe(gulp.dest(build + "css/"))
        .pipe(browserSync.reload({ stream: true }));
}
exports.css = css;

// HTML processing
function html() {
    return gulp.src(["**/*.html", "**/*.php"]);
}
exports.html = gulp.series(html, css);

// Run all tasks
exports.build = gulp.parallel(exports.css, exports.js); // Incluye JS y CSS en las tareas principales

// Watch for file changes
function watch(done) {
    browserSync.init({
        server: {
            baseDir: "./",
        },
        tunnel: false,
    });

    // HTML changes
    gulp.watch(["**/*.html", "**/*.php"], html).on("change", browserSync.reload);

    // CSS changes
    gulp.watch(src + "scss/**/*", css);

    // JS changes
    gulp.watch(src + "js/**/*.js", js).on("change", browserSync.reload);

    done();
}

exports.watch = watch;

// Default task
exports.default = gulp.series(exports.build, exports.watch);


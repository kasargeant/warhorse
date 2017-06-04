/**
 * @file _warhorse.js
 * @description The Warhorse tasks default configuration.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

// Warhorse Tool Configuration (Draft v0.0.2)
// TODO = {
//     src: "src/",
//     dst: "dist/"
//
// };

// Warhorse task definitions
function tasks(warhorse) {

    "use strict";

    return {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // COMMANDS
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Commands are used to group together any arbitrary number of tasks.
        commands: {

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "build": function() {
                warhorse.task("Bundle project code", "browserify", {
                    outfile: "./test/data/client_dist/js/index.js"
                }, "./test/data/client_src/js/index.js");

                warhorse.task("Minify JavaScript code", "uglifyjs", {
                    compress: "",
                    mangle: "",
                    output: "./test/data/client_dist/js/index.min.js"
                }, "./test/data/client_dist/js/index.js");
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "distribute": function() {
                warhorse
                    .execute("precompile")
                    .execute("test")
                    .execute("lint")
                    .execute("build")
                    .execute("document");
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "clean": function() {
                warhorse.execute("clean-dist");
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "document": function() {
                warhorse.task("Document project", "jsdoc", {
                    configure: "./conf/jsdoc.json",
                    recurse: ""
                }, "./test/data/client_src/js/");
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "fix": function() {
                warhorse.task("Fix JavaScript code style", "jscs", {
                    config: "./conf/jscs.json",
                    fix: ""
                }, "./test/data/client_src/js/");
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "lint": function() {
                warhorse.task("Lint JavaScript code style", "jscs", {
                    config: "./conf/jscs.json"
                }, "./test/data/client_src/js/");

                warhorse.task("Lint JavaScript code quality", "jshint", {
                    config: "./conf/jshint.json",
                    "exclude-path": "./conf/.jshintignore"
                }, "./test/data/client_src/js/", true, true);
                // warhorse.task("Lint SASS stylesheets", "sass-lint", "./test/data/client_src/js/", {
                //     config: "./conf/.sass-lint.yml",
                //     "no-exit": "",
                //     verbose: ""
                // });
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "pack": function() {
                warhorse.task("Packing PNG files.", "imagemin", {
                    "plugin": "pngquant",
                    "out-dir": "./test/data/client_dist/img/png/"
                }, "./test/data/client_src/img/png/*.png");

                warhorse.task("Packing JPG files.", "imagemin", {
                    "plugin": "jpegtran",
                    "out-dir": "./test/data/client_dist/img/jpg/"
                }, "./test/data/client_src/img/jpg/*.jpg");

                warhorse.task("Packing GIF files.", "imagemin", {
                    "plugin": "gifsicle",
                    "out-dir": "./test/data/client_dist/img/gif/"
                }, "./test/data/client_src/img/gif/*.gif");

                warhorse.task("Packing SVG files.", "imagemin", {
                    "plugin": "svgo",
                    "out-dir": "./test/data/client_dist/img/svg/"
                }, "./test/data/client_src/img/svg/*.svg");

                warhorse.use("copy-ico", "./test/data/client_src/img/ico/*.ico", {});
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "precompile": function() {

                warhorse.task("Compile LESS stylesheets", "lessc", {
                    "relative-urls": "",
                    "include-path": "./test/data/client_src/less/"
                }, "./test/data/client_src/less/index.less ./test/data/client_dist/css/index.css", true, true);

                warhorse.task("Compile SASS stylesheets", "node-sass", {}, "./test/data/client_src/sass/index.scss ./test/data/client_dist/css/index.css");

                warhorse.task("Adapt CSS with post-processing", "postcss", {
                    use: "autoprefixer",
                    replace: ""
                }, "./test/data/client_dist/css/index.css");

                warhorse.task("Minify CSS stylesheets", "csso", {
                    input: "./test/data/client_dist/css/index.css",
                    output: "./test/data/client_dist/css/index.min.css"
                });
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "test": function() {
                warhorse.task("Test JavasScript code", "jest", {
                    config: "./conf/jest.json",
                    verbose: ""
                }, "./test/js/");
            }
        },

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // TASKS
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Each task describes a single 'pipeline' of actions upon a single file.
        tasks: {

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "build-js": function() {
                warhorse
                    .load()
                    .bundle({standalone: "module.exports"})
                    .minifyJS()
                    .save("./test/data/client_dist/js/" + warhorse.file.name, {compress: true});
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "clean-dist": function() {
                warhorse
                    .clean([
                        "./test/data/client_dist/img/ico/*",
                        "./test/data/client_dist/img/gif/*",
                        "./test/data/client_dist/img/jpg/*",
                        "./test/data/client_dist/img/png/*",
                        "./test/data/client_dist/img/svg/*",
                        "./test/data/client_dist/css/*",
                        "./test/data/client_dist/js/*",
                        "./test/data/client_dist/css/*"]);
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "copy-ico": function() {
                warhorse
                    .load({encoding: "binary"})
                    .save("./test/data/client_dist/img/ico/" + warhorse.file.name, {encoding: "binary"});
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "document-js": function() {
                warhorse.documentJS();
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "lint-js": function() {
                warhorse
                    .load()
                    .lintJS();
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "pack-gif": function() {
                warhorse
                    .load({encoding: "binary"})
                    .packGIF()
                    .save("./test/data/client_dist/img/gif/" + warhorse.file.name, {encoding: "binary"});
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "pack-jpg": function() {
                warhorse
                    .load({encoding: "binary"})
                    .packJPG()
                    .save("./test/data/client_dist/img/jpg/" + warhorse.file.name, {encoding: "binary"});
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "pack-png": function() {
                warhorse
                    .load({encoding: "binary"})
                    .packPNG()
                    .save("./test/data/client_dist/img/png/" + warhorse.file.name, {encoding: "binary"});
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "pack-svg": function() {
                warhorse
                    .load()
                    .packSVG()
                    .save("./test/data/client_dist/img/svg/" + warhorse.file.name);
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "precompile-less": function() {
                warhorse
                    .load()
                    .compileLESS()
                    .minifyCSS()
                    .save("./test/data/client_dist/css/" + warhorse.file.name);
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "precompile-sass": function() {
                warhorse
                    .load()
                    .compileSASS()
                    .minifyCSS()
                    .save("./test/data/client_dist/css/" + warhorse.file.name);
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "test-js": function() {
                warhorse
                    .testJS();
            }
        }
    };
}

// Exports
module.exports = tasks;

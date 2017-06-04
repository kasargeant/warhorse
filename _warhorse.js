/**
 * @file _warhorse.js
 * @description The Warhorse tasks default configuration.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

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
                warhorse.task("browserify", "./test/data/client_src/js/index.js", {output: "./test/data/client_dist/js/index.js"});
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
                warhorse.task("jsdoc", "./test/data/client_src/js/", {
                    configure: "./conf/jsdoc.json",
                    recurse: ""
                });
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "fix": function() {
                warhorse.task("jscs", "./test/data/client_src/js/", {
                    config: "./conf/jscs.json",
                    fix: ""
                });
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "lint": function() {
                warhorse.task("jscs", "./test/data/client_src/js/", {config: "./conf/jscs.json"});
                warhorse.task("jshint", "./test/data/client_src/js/", {
                    config: "./conf/jshint.json",
                    "exclude-path": "./conf/.jshintignore"
                }, true);
                // warhorse.task("sass-lint", "./test/data/client_src/js/", {
                //     config: "./conf/.sass-lint.yml",
                //     "no-exit": "",
                //     verbose: ""
                // });
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "pack": function() {
                warhorse.task("imagemin", "./test/data/client_src/img/png/*.png", {
                    "plugin": "pngquant",
                    "out-dir": "./test/data/client_dist/img/png/"
                });
                warhorse.task("imagemin", "./test/data/client_src/img/jpg/*.jpg", {
                    "plugin": "jpegtran",
                    "out-dir": "./test/data/client_dist/img/jpg/"
                });
                warhorse.task("imagemin", "./test/data/client_src/img/gif/*.gif", {
                    "plugin": "gifsicle",
                    "out-dir": "./test/data/client_dist/img/gif/"
                });
                warhorse.task("imagemin", "./test/data/client_src/img/svg/*.svg", {
                    "plugin": "svgo",
                    "out-dir": "./test/data/client_dist/img/svg/"
                });

                warhorse.use("copy-ico", "./test/data/client_src/img/ico/*.ico", {});
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "precompile": function() {
                warhorse.task("lessc", "./test/data/client_src/less/index.less ./test/data/client_dist/css/index.css", {
                    "relative-urls": "",
                    "include-path": "./test/data/client_src/less/"
                }, true);
                warhorse.task("node-sass", "./test/data/client_src/sass/index.scss ./test/data/client_dist/css/index.css", {});

                warhorse.task("postcss", "./test/data/client_dist/css/index.css", {
                    use: "autoprefixer",
                    replace: ""
                });

                warhorse.task("csso", "", {
                    input: "./test/data/client_dist/css/index.css",
                    output: "./test/data/client_dist/css/index.min.css"
                });
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "test": function() {
                warhorse.task("jest", "./test/js/", {
                    config: "./conf/jest.json",
                    verbose: ""
                });
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

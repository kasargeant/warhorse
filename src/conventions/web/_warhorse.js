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
            "build": function () {
                warhorse.use("build-js", "./src/index.js", {});
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "distribute": function () {
                warhorse
                    .execute("precompile")
                    .execute("test")
                    .execute("lint")
                    .execute("build")
                    .execute("document");
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "clean": function () {
                warhorse.execute("clean-dist");
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "document": function () {
                warhorse.use("document-js");
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "lint": function () {
                warhorse.use("lint-js", "./src/**/*.js", {});
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "pack": function () {
                warhorse.use("copy-ico", "./src/img/ico/*.ico", {});
                warhorse.use("pack-gif", "./src/img/gif/*.gif", {});
                warhorse.use("pack-jpg", "./src/img/jpg/*.jpg", {});
                warhorse.use("pack-png", "./src/img/png/*.png", {});
                warhorse.use("pack-svg", "./src/img/svg/*.svg", {});
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "precompile": function () {
                warhorse.use("precompile-less", "./src/less/index.less", {});
                //warhorse.use("precompile-sass", "./src/sass/index.scss", {});
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "test": function () {
                warhorse.use("test-js", "./test/js/", {});
            }
        },

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // TASKS
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Each task describes a single 'pipeline' of actions upon a single file.
        tasks: {

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "build-js": function () {
                warhorse
                    .load()
                    .bundle({standalone: "module.exports"})
                    .minifyJS()
                    .save("./dist/js/" + warhorse.file.name);
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "clean-dist": function () {
                warhorse
                    .clean([
                        "./dist/img/ico/*",
                        "./dist/img/gif/*",
                        "./dist/img/jpg/*",
                        "./dist/img/png/*",
                        "./dist/img/svg/*",
                        "./dist/css/*",
                        "./dist/js/*",
                        "./dist/css/*"]);
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "copy-ico": function () {
                warhorse
                    .load({encoding: "binary"})
                    .save("./dist/img/ico/" + warhorse.file.name, {encoding: "binary"});
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "document-js": function () {
                warhorse.documentJS();
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "lint-js": function () {
                warhorse
                    .load()
                    .lintJS();
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "pack-gif": function () {
                warhorse
                    .load({encoding: "binary"})
                    .packGIF()
                    .save("./dist/img/gif/" + warhorse.file.name, {encoding: "binary"});
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "pack-jpg": function () {
                warhorse
                    .load({encoding: "binary"})
                    .packJPG()
                    .save("./dist/img/jpg/" + warhorse.file.name, {encoding: "binary"});
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "pack-png": function () {
                warhorse
                    .load({encoding: "binary"})
                    .packPNG()
                    .save("./dist/img/png/" + warhorse.file.name, {encoding: "binary"});
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "pack-svg": function () {
                warhorse
                    .load()
                    .packSVG()
                    .save("./dist/img/svg/" + warhorse.file.name);
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "precompile-less": function () {
                warhorse
                    .load()
                    .compileLESS()
                    .minifyCSS()
                    .save("./dist/css/" + warhorse.file.name);
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "precompile-sass": function () {
                warhorse
                    .load()
                    .compileSASS()
                    .minifyCSS()
                    .save("./dist/css/" + warhorse.file.name);
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "test-js": function () {
                warhorse
                    .testJS();
            }
        }
    };
}

// Exports
module.exports = tasks;

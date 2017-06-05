/**
 * @file _warhorse.js
 * @description The Warhorse command configuration file (web convention).
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

// Warhorse task definitions
function tasks(warhorse) {
    "use strict";

    return {
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // COMMANDS
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Commands are used to group together any arbitrary number of tasks.
        commands: {

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "build": function() {
                warhorse.bundle("js", {
                    src: "src/index.js",
                    dst: "dist/index.js"
                });
                warhorse.minify("js", {
                    src: "dist/index.js",
                    dst: "dist/index.min.js"
                });
                warhorse.compress("js", {
                    src: "dist/index.min.js",
                    dst: "dist/index.tar.gz",
                    method: "tar.gz"
                });
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "distribute": function() {
                warhorse
                    .execute("process")
                    .execute("test")
                    .execute("lint")
                    .execute("build")
                    .execute("document");
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "clean": function() {
                warhorse.execute("clean-dist");
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "document": function() {
                warhorse.document("js", {
                    conf: "conf/jsdoc.json",
                    src: "src/js/"
                });
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "fix": function() {
                warhorse.fix("js", {
                    type: "style",
                    conf: "conf/jscs.json",
                    src: "src/js/"
                });
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "lint": function() {

                warhorse.lint("js", {
                    conf: "conf/jshint.json",
                    src: "src/js/",
                    exclude: "conf/.jshintignore"
                });
                warhorse.lint("js", {
                    type: "style",
                    conf: "conf/jscs.json",
                    src: "src/js/"
                });

                // warhorse.lint("sass", {
                //     conf: "conf/.sass-lint.yml"
                // });

            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "pack": function() {

                warhorse.pack("png", {
                    src: "src/img/png/*.png",
                    dst: "dist/img/png/",
                });

                warhorse.pack("gif", {
                    src: "src/img/gif/*.gif",
                    dst: "dist/img/gif/"
                });

                warhorse.pack("jpg", {
                    src: "src/img/jpg/*.jpg",
                    dst: "dist/img/jpg/"
                });

                warhorse.pack("svg", {
                    src: "src/img/svg/*.svg",
                    dst: "dist/img/svg/"
                });

                warhorse.use("copy-ico", "src/img/ico/*.ico", {});
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "process": function() {

                // warhorse.preprocess("less", {
                //     src: "src/less/index.less",
                //     dst: "dist/css/index.css",
                //     include: "src/less/"
                // });

                // warhorse.preprocess("sass", {
                //     src: "src/sass/index.scss",
                //     dst: "dist/css/index.css"
                // });

                // warhorse.postprocess("css", {
                //     src: "dist/css/index.css",
                //     dst: "dist/css/index.css",
                //     use: "autoprefixer"
                // });
                //
                // warhorse.minify("css", {
                //     src: "dist/css/index.css",
                //     dst: "dist/css/index.min.css"
                // });

            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "test": function() {
                warhorse.test("js", {
                    config: "conf/jest.json",
                    src: "./test/js/",
                    debug: true
                });
            }
        },

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // TASKS
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Each task describes a single 'pipeline' of actions upon a single file.
        tasks: {

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "clean-dist": function() {
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

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "copy-ico": function() {
                warhorse
                    .load({encoding: "binary"})
                    .save("./dist/img/ico/" + warhorse.file.name, {encoding: "binary"});
            }
        }
    };
}

// Exports
module.exports = tasks;

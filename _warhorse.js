/**
 * @file _warhorse.js
 * @description The Warhorse command configuration file (default).
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
                warhorse.version("git", {
                    action: "get-branch-name"
                });

                warhorse.bundle("js", {
                    src: "test/data/client_src/js/index.js",
                    dst: "test/data/client_dist/js/index.js"
                });
                warhorse.minify("js", {
                    src: "test/data/client_dist/js/index.js",
                    dst: "test/data/client_dist/js/index.min.js"
                });
                warhorse.compress("js", {
                    src: "test/data/client_dist/js/index.min.js",
                    dst: "test/data/client_dist/js/index.tar.gz",
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
                    src: "test/data/client_src/js/"
                });
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "fix": function() {
                warhorse.fix("js", {
                    type: "style",
                    conf: "conf/jscs.json",
                    src: "test/data/client_src/js/"
                });
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "lint": function() {

                warhorse.lint("js", {
                    conf: "conf/jshint.json",
                    src: "test/data/client_src/js/",
                    exclude: "conf/.jshintignore"
                });

                warhorse.lint("js", {
                    type: "style",
                    conf: "conf/jscs.json",
                    src: "test/data/client_src/js/"
                });

                // warhorse.lint("sass", {
                //     conf: "conf/.sass-lint.yml"
                // });

            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "pack": function() {

                warhorse.pack("png", {
                    src: "test/data/client_src/img/png/*.png",
                    dst: "test/data/client_dist/img/png/",
                });

                warhorse.pack("gif", {
                    src: "test/data/client_src/img/gif/*.gif",
                    dst: "test/data/client_dist/img/gif/"
                });

                warhorse.pack("jpg", {
                    src: "test/data/client_src/img/jpg/*.jpg",
                    dst: "test/data/client_dist/img/jpg/"
                });

                warhorse.pack("svg", {
                    src: "test/data/client_src/img/svg/*.svg",
                    dst: "test/data/client_dist/img/svg/"
                });

                warhorse.use("copy-ico", "./test/data/client_src/img/ico/*.ico", {});
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "process": function() {

                warhorse.preprocess("less", {
                    src: "test/data/client_src/less/index.less",
                    dst: "test/data/client_dist/css/index.css",
                    include: "test/data/client_src/less/"
                });

                warhorse.preprocess("sass", {
                    src: "test/data/client_src/sass/index.scss",
                    dst: "test/data/client_dist/css/index.css"
                });

                warhorse.postprocess("css", {
                    src: "test/data/client_dist/css/index.css",
                    dst: "test/data/client_dist/css/index.css",
                    use: "autoprefixer"
                });

                warhorse.minify("css", {
                    src: "test/data/client_dist/css/index.css",
                    dst: "test/data/client_dist/css/index.min.css"
                });

            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "publish": function() {
                // TODO - Implement 'publish' command functionality using module 'npm' for first case.
                // warhorse
                //     .execute("distribute")
                //     .version("git", {
                //      });
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "test": function() {

                warhorse.test("js", {
                    tooling: "tape",
                    src: "test/data/client_test/js/Tinter256.test.js",
                });

                // TAPE
                // warhorse.test("js", {
                //     tooling: "tape",
                //     src: "test/data/client_test/js/Tinter16.test.js",
                // });

                // warhorse.test("js", {
                //     config: "conf/jest.json",
                //     src: "./test/js/",
                //     debug: true
                // });
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
                        "./test/data/client_dist/img/ico/*",
                        "./test/data/client_dist/img/gif/*",
                        "./test/data/client_dist/img/jpg/*",
                        "./test/data/client_dist/img/png/*",
                        "./test/data/client_dist/img/svg/*",
                        "./test/data/client_dist/css/*",
                        "./test/data/client_dist/js/*",
                        "./test/data/client_dist/css/*"]);
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "copy-ico": function() {
                warhorse
                    .load({encoding: "binary"})
                    .save("./test/data/client_dist/img/ico/" + warhorse.file.name, {encoding: "binary"});
            }
        }
    };
}

// Exports
module.exports = tasks;

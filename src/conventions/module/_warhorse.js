/**
 * @file _warhorse.js
 * @description The Warhorse command configuration file (module convention).
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
                    src: "src/index.js",
                    dst: "dist/index.js"
                });
                warhorse.minify("js", {
                    src: "dist/index.js",
                    dst: "dist/index.min.js"
                });
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "distribute": function() {
                warhorse
                    .execute("clean")
                    .execute("lint")
                    .execute("test")
                    .execute("build")
                    .execute("document");
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "clean": function() {
                warhorse
                    .clean(["./dist/*"]);
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "document": function() {
                warhorse.document("js", {
                    conf: "conf/jsdoc.json"
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
                    type: "quality",
                    conf: "conf/jshint.json",
                    src: "src/js/",
                    exclude: "conf/.jshintignore"
                });
                warhorse.lint("js", {
                    type: "style",
                    conf: "conf/jscs.json",
                    src: "src/js/"
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
                    tooling: "jest",
                    debug: true,
                    config: "conf/jest.json",
                    src: "./test/js/"
                });
            }
        }
    };
}

// Exports
module.exports = tasks;

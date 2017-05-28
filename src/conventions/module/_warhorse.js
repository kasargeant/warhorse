/**
 * @file _warhorse.js
 * @description The Warhorse tasks default configuration.
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
                warhorse.use("build-js", "./src/index.js", {});
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "distribute": function() {
                warhorse
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
                warhorse.use("document-js");
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "lint": function() {
                warhorse.use("lint-js", "./src/js/*.js", {});
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "test": function() {
                warhorse.use("test-js", "./test/js/", {});
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
                    .save("./dist/" + warhorse.file.name);
            },

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            "clean-dist": function() {
                warhorse
                    .clean(["./dist/*"]);
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
            "test-js": function() {
                warhorse
                    .testJS();
            }
        }
    };
}

// Exports
module.exports = tasks;

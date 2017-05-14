/**
 * @file _warhorse.js
 * @description The Warhorse tasks default configuration.
 * @license See LICENSE file included in this distribution.
 */

// Warhorse task definitions
function tasks(warhorse) {

    "use strict";

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // COMMANDS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Commands are used to group together any arbitrary number of tasks.

    warhorse.cmd("build", function() {
        warhorse.use("build-js", "./src/index.js", {});
    });

    warhorse.cmd("distribute", function() {
        warhorse.use("build-js", "./src/index.js", {});
        warhorse.documentJS({});
    });

    warhorse.cmd("clean", function() {
        warhorse.execute("clean-dist");
    });

    warhorse.cmd("document", function() {
        warhorse.documentJS({});
    });

    warhorse.cmd("lint", function() {
        warhorse.use("lint-js", "./src/**/*.js", {});
    });
    
    warhorse.cmd("pack", function() {});

    warhorse.cmd("precompile", function() {});

    warhorse.cmd("test", function() {
        warhorse.use("test-js", "./test/*.test.js", {});
    });


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // TASKS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Each task describes a single 'pipeline' of actions upon a single file.

    warhorse.task("build-js", function() {
        warhorse.load()
            .bundle()
            .minifyJS()
            .save("./dist/js/" + warhorse.file.name);
    });

    warhorse.task("clean-dist", function() {
        warhorse.clean(["./test/data/client_dist/js/*"]);
    });

    warhorse.task("lint-js", function() {
        warhorse.load()
            .lintJS();
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    warhorse.task("test-js", function() {
        warhorse.testJS();
    });

}

// Exports
module.exports = tasks;

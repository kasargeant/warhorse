/**
 * @file tasks.js
 * @description The Warhorse tasks default configuration.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Warhorse task definitions
function tasks(warhorse) {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // TASKS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    warhorse.task("build-js", function() {
        // warhorse.load({})
        warhorse.bundle({})
            .minifyJS({})
            .save("./test/data/client_dist/js/" + warhorse.file.name);
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    warhorse.task("precompile-less", function() {
        warhorse.load({})
            .compileLESS({})
            // .minifyCSS({})
            .save("./test/data/client_dist/css/" + warhorse.file.name);
    });

    warhorse.task("precompile-sass", function() {
        warhorse.load({})
            .compileSASS({})
            .minifyCSS({})
            .save("./test/data/client_dist/css/" + warhorse.file.name);
    });


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // COMMANDS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    warhorse.cmd("build", function() {
        warhorse.use("build-js", "./test/data/client_src/js/*.js", {});
    });

    warhorse.cmd("distribute", function() {
        warhorse.use("precompile-less", "./test/data/client_src/less/index.less", {})
            .use("precompile-sass", "./test/data/client_src/sass/index.scss", {})
            .use("build-js", "./test/data/client_src/js/*.js", {})
            .documentJS({});
    });

    warhorse.cmd("document", function() {
        warhorse.documentJS({});
    });

    warhorse.cmd("init", function() {
        //warhorse.init({});
        // TODO - Implement command 'init'
    });

    warhorse.cmd("precompile", function() {
        warhorse.use("precompile-less", "./test/data/client_src/less/index.less", {});
        // warhorse.use("precompile-sass", "./test/data/client_src/sass/index.scss", {});
    });

}

// Exports
module.exports = tasks;

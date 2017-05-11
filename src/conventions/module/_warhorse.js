/**
 * @file _warhorse.js
 * @description The Warhorse tasks default configuration.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Warhorse task definitions
function tasks(warhorse) {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // COMMANDS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Commands are used to group together any arbitary number of tasks.
    warhorse.cmd("build", function() {
        warhorse.use("build-js", "./src/js/*.js", {});
    });

    warhorse.cmd("distribute", function() {
            .use("build-js", "./src/js/*.js", {})
            .documentJS({});
    });

    warhorse.cmd("clean", function() {
        warhorse.execute("clean-dist");
    });

    warhorse.cmd("document", function() {
        warhorse.documentJS({});
    });

    warhorse.cmd("init", function() {
        //warhorse.init({});
        // TODO - Implement command 'init'
    });

    warhorse.cmd("pack", function() {
    });

    warhorse.cmd("precompile", function() {
    });

    warhorse.cmd("test", function() {
        // TODO - Implement command 'test'
    });


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // TASKS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Each task describes a single 'pipeline' of actions upon a single file.
    warhorse.task("build-js", function() {
        warhorse.load({}).bundle({})
            .minifyJS({})
            .save("./dist/js/" + warhorse.file.name);
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    warhorse.task("clean-dist", function() {
        warhorse.clean([
            "./test/data/client_dist/img/ico/*",
            "./test/data/client_dist/img/gif/*",
            "./test/data/client_dist/img/jpg/*",
            "./test/data/client_dist/img/png/*",
            "./test/data/client_dist/img/svg/*",
            "./test/data/client_dist/css/*",
            "./test/data/client_dist/js/*",
            "./test/data/client_dist/css/*"]);
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    warhorse.task("copy-ico", function() {
        warhorse.load({encoding: "binary"})
            .save("./test/data/client_dist/img/ico/" + warhorse.file.name, {encoding: "binary"});
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    warhorse.task("pack-gif", function() {
        warhorse.load({encoding: "binary"})
            .packGIF({})
            .save("./test/data/client_dist/img/gif/" + warhorse.file.name, {encoding: "binary"});
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    warhorse.task("pack-jpg", function() {
        warhorse.load({encoding: "binary"})
            .packJPG({})
            .save("./test/data/client_dist/img/jpg/" + warhorse.file.name, {encoding: "binary"});
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    warhorse.task("pack-png", function() {
        warhorse.load({encoding: "binary"})
            .packPNG({})
            .save("./test/data/client_dist/img/png/" + warhorse.file.name, {encoding: "binary"});
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    warhorse.task("pack-svg", function() {
        warhorse.load({})
            .packSVG({})
            .save("./test/data/client_dist/img/svg/" + warhorse.file.name);
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    warhorse.task("precompile-less", function() {
        warhorse.load({})
            .compileLESS({})
            .minifyCSS({})
            .save("./test/data/client_dist/css/" + warhorse.file.name);
    });

    warhorse.task("precompile-sass", function() {
        warhorse.load({})
            .compileSASS({})
            .minifyCSS({})
            .save("./test/data/client_dist/css/" + warhorse.file.name);
    });



}

// Exports
module.exports = tasks;

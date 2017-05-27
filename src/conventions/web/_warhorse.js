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
        warhorse.use("precompile-less", "./src/less/index.less", {})
            .use("precompile-sass", "./src/sass/index.scss", {})
            .use("build-js", "./src/js/*.js", {})
            .documentJS({});
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

    warhorse.cmd("pack", function() {
        warhorse.use("copy-ico", "./src/img/ico/*.ico", {});
        warhorse.use("pack-gif", "./src/img/gif/*.gif", {});
        warhorse.use("pack-jpg", "./src/img/jpg/*.jpg", {});
        warhorse.use("pack-png", "./src/img/png/*.png", {});
        warhorse.use("pack-svg", "./src/img/svg/*.svg", {});
    });

    warhorse.cmd("precompile", function() {
        warhorse.use("precompile-less", "./src/less/index.less", {});
        // warhorse.use("precompile-sass", "./src/sass/index.scss", {});
    });

    warhorse.cmd("test", function() {
        warhorse.use("test-js", "./test/js/", {});
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
        warhorse.clean([
            "./dist/img/*",
            "./dist/img/ico/*",
            "./dist/img/gif/*",
            "./dist/img/jpg/*",
            "./dist/img/png/*",
            "./dist/img/svg/*",
            "./dist/css/*",
            "./dist/js/*",
            "./dist/css/*"]);
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    warhorse.task("copy-ico", function() {
        warhorse.load({encoding: "binary"})
            .save("./dist/img/ico/" + warhorse.file.name, {encoding: "binary"});
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    warhorse.task("lint-js", function() {
        warhorse.load()
            .lintJS();
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    warhorse.task("pack-gif", function() {
        warhorse.load({encoding: "binary"})
            .packGIF({})
            .save("./dist/img/gif/" + warhorse.file.name, {encoding: "binary"});
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    warhorse.task("pack-jpg", function() {
        warhorse.load({encoding: "binary"})
            .packJPG({})
            .save("./dist/img/jpg/" + warhorse.file.name, {encoding: "binary"});
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    warhorse.task("pack-png", function() {
        warhorse.load({encoding: "binary"})
            .packPNG({})
            .save("./dist/img/png/" + warhorse.file.name, {encoding: "binary"});
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    warhorse.task("pack-svg", function() {
        warhorse.load({})
            .packSVG({})
            .save("./dist/img/svg/" + warhorse.file.name);
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    warhorse.task("precompile-less", function() {
        warhorse.load({})
            .compileLESS({})
            .minifyCSS({})
            .save("./dist/css/" + warhorse.file.name);
    });

    warhorse.task("precompile-sass", function() {
        warhorse.load({})
            .compileSASS({})
            .minifyCSS({})
            .save("./dist/css/" + warhorse.file.name);
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    warhorse.task("test-js", function() {
        warhorse.testJS();
    });
}

// Exports
module.exports = tasks;

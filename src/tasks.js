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
            .save("./test/shared/client_dist/js/" + warhorse.file.name);
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    warhorse.task("precompile-less", function() {
        warhorse.load({})
            .compileLESS({})
            // .minifyCSS({})
            .save("./test/shared/client_dist/css/" + warhorse.file.name);
    });

    warhorse.task("precompile-sass", function() {
        warhorse.load({})
            .compileSASS({})
            .minifyCSS({})
            .save("./test/shared/client_dist/css/" + warhorse.file.name);
    });


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // COMMANDS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    warhorse.command("build", function() {
        warhorse.use("build-js", "./test/shared/client_src/js/*.js", {});
    });

    warhorse.command("distribute", function() {
        warhorse.use("precompile-less", "./test/shared/client_src/less/index.less", {})
            .use("precompile-sass", "./test/shared/client_src/sass/index.scss", {})
            .use("build-js", "./test/shared/client_src/js/*.js", {})
            .documentJS({});
    });

    warhorse.command("document", function() {
        warhorse.documentJS({});
    });

    warhorse.command("init", function() {
        warhorse.init({});
    });

    warhorse.command("precompile", function() {
        warhorse.use("precompile-less", "./test/shared/client_src/less/index.less", {});
        // warhorse.use("precompile-sass", "./test/shared/client_src/sass/index.scss", {});
    });

}

// Exports
module.exports = tasks;

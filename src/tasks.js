"use strict";

// Warhorse task definitions
function tasks(warhorse) {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // TASK: BUILD
    warhorse.task("build-js", function() {
        // warhorse.load({})
        warhorse.bundle({})
            .minifyJS({})
            .save("./test/shared/client_dist/js/" + warhorse.file.name);

    });

    warhorse.task("build", function() {
        warhorse.use("build-js", "./test/shared/client_src/js/*.js", {});
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // TASK: DISTRIBUTE
    warhorse.task("distribute", function() {
        warhorse.use("precompile-less", "./test/shared/client_src/less/index.less", {})
            .use("precompile-sass", "./test/shared/client_src/sass/index.scss", {})
            .use("build-js", "./test/shared/client_src/js/*.js", {})
            .document({});
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // TASK: DOCUMENT
    warhorse.task("document", function() {
        warhorse.document({});
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // TASK: INIT
    warhorse.task("init", function() {
        warhorse.init("./", function(file) {

        });
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // TASK: PRECOMPILE

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

    warhorse.task("precompile", function() {
        warhorse.use("precompile-less", "./test/shared/client_src/less/index.less", {});
        // warhorse.use("precompile-sass", "./test/shared/client_src/sass/index.scss", {});
    });


}

// Exports
module.exports = tasks;

// warhorse.execute("build");

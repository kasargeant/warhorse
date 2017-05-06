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
        warhorse.batch("./test/shared/client_src/js/*.js", warhorse.tasks["build-js"], {});
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
        warhorse.batch("./test/shared/client_src/less/index.less", warhorse.tasks["precompile-less"], {});
        // warhorse.batch("./test/shared/client_src/sass/index.scss", warhorse.tasks["precompile-sass"], {});
    });


}

// Exports
module.exports = tasks;

// warhorse.execute("build");

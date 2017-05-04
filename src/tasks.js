"use strict";

// Warhorse task definitions
function tasks(warhorse) {

    // TASK: BUILD
    warhorse.task("build", function() {
        warhorse.load("./test/shared/client_src/js/*.js", function(file) {
            warhorse.bundle(file, function(file) {
                warhorse.minifyJS(file, function(file) {
                    let dstPath = "./test/shared/client_dist/js/" + file.name;
                    warhorse.save(file, dstPath);
                });
            });
        });
    });



    // TASK: DOCUMENT
    warhorse.task("document", function() {
        warhorse.document("", function(file) {

        });
    });

    // TASK: INIT
    warhorse.task("init", function() {
        warhorse.init("./", function(file) {

        });
    });

    // TASK: PRECOMPILE
    warhorse.task("precompile", function() {
        warhorse.load("./test/shared/client_src/sass/index.scss", function(file) {
            warhorse.compileSASS(file, function(file) {
                warhorse.minifyCSS(file, function(file) {
                    let dstPath = "./test/shared/client_dist/css/" + file.name;
                    warhorse.save(file, dstPath);
                });
            });
        });
    });

    // TODO - Potential alternative for simple builds???
    // warhorse.task("precompile")
    //     .load("./test/shared/client_src/sass/index.scss")
    //     .compileSASS(file)
    //     .minifyCSS(file)
    //     .rename({directory: "./test/shared/client_dist/css/"})
    //     .save(file, dstPath);

}

// Exports
module.exports = tasks;

// warhorse.execute("build");

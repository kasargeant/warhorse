"use strict";

// Imports
// const fs = require("fs");
// const path = require("path");
// const glob = require("glob");
// const browserify = require("browserify");
// const uglify = require("uglify-js");
// const Warhorse = require("./core/Warhorse");

function tasks(warhorse) {

    // TASK: BUILD
    warhorse.task("build", function() {
        warhorse.load("./test/shared/client_src/js/*.js", function(file) {
            warhorse.bundle(file, function(file) {
                let dstPath = "./test/shared/client_dist/js/" + file.name;
                warhorse.save(file, dstPath);
            });

        });
    });

    // TASK: CREATE
    warhorse.task("create", function() {
        warhorse.create("./", function(file) {

        });
    });

    // TASK: DOCUMENT
    warhorse.task("document", function() {
        warhorse.document("./", function(file) {

        });
    });

    // TASK: PRECOMPILE
    warhorse.task("precompile", function() {
        warhorse.load("./test/shared/client_src/css/*.css", function(file) {
            warhorse.minifyCSS(file, function(file) {
                let dstPath = "./test/shared/client_dist/css/" + file.name;
                warhorse.save(file, dstPath);
            });
        });
    });
}

// Exports
module.exports = tasks;

// warhorse.execute("build");

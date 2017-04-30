"use strict";

// Imports
// const fs = require("fs");
// const path = require("path");
// const glob = require("glob");
// const browserify = require("browserify");
// const uglify = require("uglify-js");
// const Warhorse = require("./core/Warhorse");

function tasks(warhorse) {
    
    warhorse.task("build", function() {
        warhorse.load("./test/shared/client_src/*.js", function(file) {
            warhorse.bundle(file, function(file) {
                let dstPath = "./test/shared/client_dist/" + file.name;
                warhorse.save(file, dstPath);
            });

        });
    });

    warhorse.task("precompile", function() {
        warhorse.load("./test/shared/client_src/*.js", function(file) {
            warhorse.bundle(file, function(file) {
                let dstPath = "./test/shared/client_dist/" + file.name;
                warhorse.save(file, dstPath);
            });

        });
    });

}

// Exports
module.exports = tasks;

// warhorse.execute("build");

"use strict";

// Imports
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const browserify = require("browserify");
const uglify = require("uglify-js");
const Warhorse = require("./core/Warhorse");



const warhorse = new Warhorse({
    "bundle": {
        "minify": true
    }
});

// let filePath = "**/*.js";
// let filePath = "../../conf/.*";
// let filePaths = ["**/*.js", "../client/**/*.html"];
// warhorse.load(filePaths, console.log);
// warhorse.load("./src/**/index*.js", function(srcPath, fileContents) {
//     console.log(srcPath);
// });

warhorse.task("build", function() {
    warhorse.load("../test/shared/client_src/*.js", function(file) {
        warhorse.bundle(file, function(file) {
            let dstPath = "../test/shared/client_dist/" + file.name;
            warhorse.save(file, dstPath);
        });

    });
});

// warhorse.task("document", function() {
//
// });

warhorse.execute("build");

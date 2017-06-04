/**
 * @file index.js
 * @description Index and entry point for the Warhorse module.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Warhorse = require("./js/Warhorse");

// Runner
function run(moduleDirectory, workingDirectory, args, useDebug) {

    let userConfig = {};
    try {
        userConfig = require(workingDirectory + "/conf/warhorse.json");
    } catch(ex) {
        console.warn("No user configuration defined.");
    }

    const warhorse = new Warhorse(moduleDirectory, workingDirectory, userConfig, useDebug);

    console.log("Warhorse CLI location: " + warhorse.moduleDirectory);
    console.log();
    warhorse.cli(args);
    console.log();
}

// Exports
module.exports = run;

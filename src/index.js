/**
 * @file index.js
 * @description Index and entry point for the Warhorse module.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Warhorse = require("../src/classes/Warhorse");
const configureTasks = require("../warhorse.js");
//const tasks = require("../warhorse.js");

// Runner
function run(command, options) {

    const warhorse = new Warhorse(options);
    // warhorse.tasks = configureTasks(warhorse);
    configureTasks(warhorse);

    console.log();
    console.log(`WARHORSE working...`);
    warhorse.execute(command);
    console.log(`WARHORSE done.`);
}

// Exports
module.exports = run;

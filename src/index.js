/**
 * @file index.js
 * @description Index and entry point for the Warhorse module.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const chalk = require("chalk");
const WARHORSE_CONFIG = require("../conf/warhorse.json");
const Warhorse = require("./modules/Warhorse");

// Runner
function run(workingDirectory, args) {

    const warhorse = new Warhorse(WARHORSE_CONFIG);

    const configureTasks = require(workingDirectory + "/_warhorse.js");
    configureTasks(warhorse);

    console.log();
    console.log(chalk.inverse(`WARHORSE working...`));
    warhorse.executeCmd(args[0]);
    console.log(chalk.inverse(`WARHORSE done.`));
    console.log();
}

// Exports
module.exports = run;

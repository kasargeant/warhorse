"use strict";

const Warhorse = require("../src/core/Warhorse");
const configureTasks = require("../src/tasks");

function run(command, options) {

    const warhorse = new Warhorse(options);

    configureTasks(warhorse);

    console.log();
    console.log(`WARHORSE working...`);
    warhorse.execute(command);
    console.log(`WARHORSE done.`);
}

// Exports
module.exports = run;

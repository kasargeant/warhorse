"use strict";

const Warhorse = require("../src/core/Warhorse");
const configureTasks = require("../src/tasks");

function run(command, options) {

    const warhorse = new Warhorse(options);

    configureTasks(warhorse);

    warhorse.execute("build");
}

// Exports
module.exports = run;

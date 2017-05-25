"use strict";

// Imports
const Square = require("./js/Square");

/**
 * A function with the sole purpose of being exported.
 */
function calcArea() {
    let square = new Square(20);
    console.log(square.area());
}

// Exports
module.exports = calcArea;
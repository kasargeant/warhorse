"use strict";

// Imports
const Polygon = require("./Polygon");

// Component
class Square extends Polygon {
    constructor(length=10) { // ES6 features Default Parameters
        super(length, length); //call the parent method with super
        this.name = "Square";
    }

    get area() { //calculated attribute getter
        return this.height * this.width;
    }
}

// Exports
module.exports = Square;

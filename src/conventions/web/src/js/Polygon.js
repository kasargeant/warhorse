"use strict";

// Imports

// Component
class Polygon {
    constructor(height, width) { //class constructor
        this.name = "Polygon";
        this.height = height;
        this.width = width;
    }

    sayName() { //class method
        console.log("Hi, I am a", this.name + ".");
    }
}

// Exports
module.exports = Polygon;


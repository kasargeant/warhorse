const Polygon = require("./Polygon");

/**
 * This class is designed to test a linter analysis with a number of failures.
 */
class Circle extends Polygon {
    constructor(length=10) { // ES6 features Default Parameters
        super(length, length); //call the parent method with super
        this.name = 'Square';
    }

    get area() {
        let useless = 10;
        let also_useless = "hmmm";
        return this.height * this.width;
    }
}

// Exports
module.exports = Circle;

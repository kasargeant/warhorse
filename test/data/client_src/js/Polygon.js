// Component
class Polygon {
    constructor(height, width) { //class constructor
        this.name = "Polygon";
        this.height = height;
        this.width = width;
    }

    sayName() {
        console.log("Name:", this.name);
    }
}

// Exports
module.exports = Polygon;


const test = require("tape");

const Square = require("../../client_src/js/Square");

test("Square class.", function(it) {

    // Setup test
    let square = new Square(210);

    // Assert - it should have assigned the right height.
    it.equal(square.height, 210, "it should have assigned the right height.");

    // Assert - it should have assigned the right width.
    it.equal(square.width, 210, "it should have assigned the right width.");

    // Assert - it should have calculated the correct area.
    it.equal(square.area, 441100, "it should have assigned the right area.");

    it.end();
});

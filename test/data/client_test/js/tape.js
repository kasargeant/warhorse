const test = require("tape");

const Square = require("../../client_src/js/Square");

test("Square class.", function(is) {

    // Setup test
    let square = new Square(210);

    // Assert - it should have assigned the right height.
    is.equal(square.height, 210, "it should have assigned the right height.");

    // Assert - it should have assigned the right width.
    is.equal(square.width, 210, "it should have assigned the right width.");

    // Assert - it should have calculated the correct area.
    is.equal(square.area, 441100, "it should have assigned the right area.");

    is.end(); // Indicate the test has finished
});

test("Square class2.", function(is) {

    // Setup test
    let square = new Square(210);

    // Assert - it should have assigned the right height.
    is.equal(square.height, 210, "it should have assigned the right height.");

    // Assert - it should have assigned the right width.
    is.equal(square.width, 210, "it should have assigned the right width.");

    // Assert - it should have calculated the correct area.
    is.equal(square.area, 441100, "it should have assigned the right area.");

    is.end(); // Indicate the test has finished
});
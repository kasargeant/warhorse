/**
 * @file Warhorse Class unit tests
 * @author Kyle Alexis Sargeant
 */

"use strict";

// Imports
const Warhorse = require.requireActual("../src/core/Warhorse");

// Constants
const FILE_DUMMY = {
    original: "./test/data/client_src/js/index.js",
    path: "./test/data/client_src/js/",
    name: "index.js",
    stem: "index",
    extension: ".js",
    config: false
};


let warhorse = new Warhorse({
    "bundle": {
        "minify": true
    }
});



console.log("@@@@@@@" + warhorse.settings.directory);
// beforeAll(function() {
//
// });
//
// describe("Test check.", function() {
//     it("should be able to fail.", function() {
//         expect(false).toBe(true);
//     });
// });

describe("The Warhorse class", function() {

    // SYNCHRONOUS TESTS
    it("should be instantiatable", function() {
        expect(warhorse).toBeDefined();
    });

    it("should be able to parse a filepath", function() {
        let path = warhorse._splitPath("./test/data/client_src/index.js");
        expect(path.name).toBe("index.js"); // Sanity test - don't rely just on snapshots!!!
        expect(path).toMatchSnapshot();
    });

    // ASYNCHRONOUS TESTS
    it("should be able to load a file", function() {

        warhorse.file = FILE_DUMMY;
        warhorse.load({});
        expect(warhorse.file.content).toMatchSnapshot();

    });
});


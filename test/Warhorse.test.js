"use strict";

// Imports
const Warhorse = require.requireActual("../src/core/Warhorse");

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
        let path = warhorse.splitPath("./test/shared/client_src/index.js");
        expect(path.name).toBe("index.js"); // Sanity test - don't rely just on snapshots!!!
        expect(path).toMatchSnapshot();
    });

    // ASYNCHRONOUS TESTS
    it("should be able to load a file", function(done) {
        
        warhorse.load("./test/shared/client_src/index.js", function(file) {
            
            // If nothing loaded - fail!
            if(!file) {done.fail();}

            // Otherwise...
            expect(file.content).toMatchSnapshot();

            // Then exit async test.
            done();
        });

    });
});


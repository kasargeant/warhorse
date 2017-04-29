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
            if(!file) {done.fail();}
            // console.log(file.name);
            // warhorse.bundle(file, function(file) {
            //     // let dstPath = "../test/client_dist/" + file.name;
            //     // warhorse.save(file, dstPath);
            //     expect(tree).toMatchSnapshot();
            // });
            //console.log(JSON.stringify(file));
            expect(file.content).toMatchSnapshot();

            //expect(file.name).toBe("index.js");
            done();
        });

    });
});


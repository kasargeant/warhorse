/**
 * @file Warhorse.unit.js
 * @description Unit tests for the Warhorse Class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE.txt file included in this distribution.
 */

"use strict";

// Import Bayeux and extract selected vocabulary.
const Bayeux = require("bayeux");
const {given, test, unit} = Bayeux.TDD();

// Import Unit
const Warhorse = require("../../src/js/Warhorse");

// Constants
const moduleDirectory = __dirname;
const workingDirectory = process.cwd();
const options = {};
const useDebug = false;

// Test
unit("Class: Warhorse", function() {

    let warhorse = new Warhorse(moduleDirectory, workingDirectory, options, useDebug);

    test("instantiation", function(done) {

        given("an instance with existance").expect(warhorse).toNotEqual(undefined);
        given("an instance with default settings").expect(warhorse.defaults).toNotEqual(undefined);
        given("an instance with default language settings of 'es51'").expect(warhorse.defaults.language).toEqual("es51");

        done(); // Indicate the test is done.
    });

    test("task: bundle JS", function(done) {

        let type = "js";
        let options = {
            src: "test/data/client_src/js/index.js",
            dst: "test/data/client_dist/js/index.js"
        };

        let testBlock = function() {return warhorse.bundle(type, options);};

        //given("a valid JS source file path and destination").expect(testBlock).toNotThrow();

        // given("an instance with default settings").expect(warhorse.defaults).toNotEqual(undefined);
        // given("an instance with default language settings of 'es51'").expect(warhorse.defaults.language).toEqual("es51");

        done(); // Indicate the test is done.
    });


    //     // Public functions
    //     it("should be able to bundle JS code", function() {
    //         warhorse.file = JSON.parse(JSON.stringify(FILE_DUMMY_JS));
    //         warhorse.bundle({});
    //         expect(warhorse.file.content).toMatchSnapshot();
    //     });
    //
    //     //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //     it("should be able to compile LESS", function() {
    //         warhorse.file = JSON.parse(JSON.stringify(FILE_DUMMY_LESS));
    //         warhorse.compileLESS({});
    //         expect(warhorse.file.content).toMatchSnapshot();
    //     });
    //
    //     it("should be able to compile SASS", function() {
    //         warhorse.file = JSON.parse(JSON.stringify(FILE_DUMMY_SASS));
    //         warhorse.compileSASS({});
    //         expect(warhorse.file.content).toMatchSnapshot();
    //     });


});




// // Tests
// describe("Class: Warhorse", function() {
//
//     describe("Standard sanity check", function() {
//         it("contains spec with an positive expectation", function() {
//             expect(true).toBe(true);
//         });
//         it("contains spec with a negative expectation", function() {
//             expect(!true).toBe(false);
//         });
//     });

    //
    // describe("Instantiation", function() {
    //
    //     it("should be instantiatable", function() {
    //         expect(warhorse).toBeDefined();
    //     });
    //
    //     it("should be able to parse a filepath", function() {
    //         let path = warhorse._splitPath("./test/data/client_src/index.js");
    //         expect(path.name).toBe("index.js"); // Sanity test - don't rely just on snapshots!!!
    //         expect(path).toMatchSnapshot();
    //     });
    //
    // });
    //
    // describe("Actions", function() {
    //
    //     // Private functions (Only the critical 'building blocks'.)
    //     it("should be able to parse a filepath", function() {
    //         warhorse.file = JSON.parse(JSON.stringify(FILE_DUMMY_JS));
    //         let path = warhorse._splitPath("./test/data/client_src/index.js");
    //         expect(path.name).toBe("index.js"); // Sanity test - don't rely just on snapshots!!!
    //         expect(path).toMatchSnapshot();
    //     });
    //
    //     // Public functions
    //     it("should be able to bundle JS code", function() {
    //         warhorse.file = JSON.parse(JSON.stringify(FILE_DUMMY_JS));
    //         warhorse.bundle({});
    //         expect(warhorse.file.content).toMatchSnapshot();
    //     });
    //
    //     //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //     it("should be able to compile LESS", function() {
    //         warhorse.file = JSON.parse(JSON.stringify(FILE_DUMMY_LESS));
    //         warhorse.compileLESS({});
    //         expect(warhorse.file.content).toMatchSnapshot();
    //     });
    //
    //     it("should be able to compile SASS", function() {
    //         warhorse.file = JSON.parse(JSON.stringify(FILE_DUMMY_SASS));
    //         warhorse.compileSASS({});
    //         expect(warhorse.file.content).toMatchSnapshot();
    //     });
    //
    //     //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //     it("should be able to document JS code", function() {
    //         // TODO - implement test: document JS
    //     });
    //
    //     //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //     it("should be able to lint JS code", function() {
    //         warhorse.file = JSON.parse(JSON.stringify(FILE_DUMMY_JS_LINT_FAIL));
    //         warhorse.lintJS();
    //         console.log(warhorse.linterJSStats);
    //         expect(warhorse.linterJSStats.errors).toBe(1);
    //         expect(warhorse.linterJSStats.warnings).toBe(1);
    //     });
    //
    //     //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //     it("should be able to load a file", function() {
    //         warhorse.file = JSON.parse(JSON.stringify(FILE_DUMMY_JS));
    //         warhorse.load({});
    //         expect(warhorse.file.content).toBe(FILE_DUMMY_JS.content);
    //     });
    //
    //     //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //     it("should be able to minify CSS", function() {
    //         warhorse.file = JSON.parse(JSON.stringify(FILE_DUMMY_CSS));
    //         warhorse.minifyCSS({});
    //         expect(warhorse.file.content).toMatchSnapshot();
    //     });
    //
    //     it("should be able to minify JS code", function() {
    //         warhorse.file = JSON.parse(JSON.stringify(FILE_DUMMY_JS));
    //         warhorse.minifyJS({});
    //         expect(warhorse.file.content).toMatchSnapshot();
    //     });
    //
    //     //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //     // TODO - Implement asset packing tests
    //     // it("should be able to pack a GIF", function() {
    //     //     warhorse.file = JSON.parse(JSON.stringify(FILE_DUMMY_GIF));
    //     //     warhorse.packGIF({});
    //     //     expect(warhorse.file.content).toMatchSnapshot();
    //     // });
    //     //
    //     // it("should be able to pack a JPG", function() {
    //     //     warhorse.file = JSON.parse(JSON.stringify(FILE_DUMMY_JPG));
    //     //     warhorse.packJPG({});
    //     //     expect(warhorse.file.content).toMatchSnapshot();
    //     // });
    //     //
    //     // it("should be able to pack a PNG", function() {
    //     //     warhorse.file = JSON.parse(JSON.stringify(FILE_DUMMY_GIF));
    //     //     warhorse.packGIF({});
    //     //     expect(warhorse.file.content).toMatchSnapshot();
    //     // });
    //     //
    //     // it("should be able to pack a SVG", function() {
    //     //     warhorse.file = JSON.parse(JSON.stringify(FILE_DUMMY_SVG));
    //     //     warhorse.packSVG({});
    //     //     expect(warhorse.file.content).toMatchSnapshot();
    //     // });
    //
    //     // TODO -> tests for:-
    //     // rename
    //     // save
    //     // task
    //     // use
    //
    // });

// });
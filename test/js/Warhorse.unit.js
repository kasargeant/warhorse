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

        // given("an instance with existance").expect(warhorse).toNotEqual(undefined);

        given("an instance with default settings").expect(warhorse.defaults).toNotEqual(undefined);
        given("an instance with default language settings of 'es51'").expect(warhorse.defaults.language).toEqual("ses51");


        // given("plain").expect(Tinter.plain(DUMMY_STRING)).toEqual(`\x1b[0m${DUMMY_STRING}\x1b[0m`);
        // given("bright").expect(Tinter.bright(DUMMY_STRING)).toEqual(`\x1b[1m${DUMMY_STRING}\x1b[0m`);
        // given("dim").expect(Tinter.dim(DUMMY_STRING)).toEqual(`\x1b[2m${DUMMY_STRING}\x1b[0m`);
        // given("italic").expect(Tinter.italic(DUMMY_STRING)).toEqual(`\x1b[3m${DUMMY_STRING}\x1b[0m`);
        // given("underline").expect(Tinter.underline(DUMMY_STRING)).toEqual(`\x1b[4m${DUMMY_STRING}\x1b[0m`);
        // given("blink").expect(Tinter.blink(DUMMY_STRING)).toEqual(`\x1b[5m${DUMMY_STRING}\x1b[0m`);
        // given("blink2").expect(Tinter.blink2(DUMMY_STRING)).toEqual(`\x1b[6m${DUMMY_STRING}\x1b[0m`);
        // given("inverse").expect(Tinter.inverse(DUMMY_STRING)).toEqual(`\x1b[7m${DUMMY_STRING}\x1b[0m`);
        // given("hidden").expect(Tinter.hidden(DUMMY_STRING)).toEqual(`\x1b[8m${DUMMY_STRING}\x1b[0m`);

        done(); // Indicate the test is done.
    });


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
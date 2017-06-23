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

// Import utilities
const fs = require("fs");
const path = require("path");

// Import Unit
const Warhorse = require("../../src/js/Warhorse");

// Change working directory to project root
process.chdir("../..");

// Constants
const moduleDirectory = process.cwd() + "/";
const workingDirectory = process.cwd();
const options = {};
const useDebug = false;

// Helpers
// Failure-tolerant version of fs.unlinkSync(filePath) - won't crash if no file already exists!!!
const unlinkSync = function(filePath) {
    try {
        fs.unlinkSync(filePath);
    } catch(err) {}
};

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

        // Before test: Remove any existing dst file
        unlinkSync(options.dst);

        let testBlock = function() {warhorse.bundle(type, options);};

        given("a valid JS source file to bundle").expect(testBlock).toNotThrow();
        given("a valid JS bundle destination").expectFile(options.dst).toEqual(`(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require==\"function\"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error(\"Cannot find module '\"+o+\"'\");throw f.code=\"MODULE_NOT_FOUND\",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require==\"function\"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){\n// Component\nclass Polygon {\n    constructor(height, width) { //class constructor\n        this.name = \"Polygon\";\n        this.height = height;\n        this.width = width;\n    }\n\n    sayName() {\n        console.log(\"Name:\", this.name);\n    }\n}\n\n// Exports\nmodule.exports = Polygon;\n\n\n},{}],2:[function(require,module,exports){\nconst Polygon = require(\"./Polygon\");\n\nclass Square extends Polygon {\n    constructor(length=10) { // ES6 features Default Parameters\n        super(length, length); //call the parent method with super\n        this.name = \"Square\";\n    }\n\n    get area() { //calculated attribute getter\n        return this.height * this.width;\n    }\n}\n\n// Exports\nmodule.exports = Square;\n\n},{\"./Polygon\":1}],3:[function(require,module,exports){\n// Imports\nconst Square = require(\"./Square\");\n\nlet sq = new Square(30);\n\nconsole.log(sq.area);\n\n},{\"./Square\":2}]},{},[3]);\n`);

        // After test: Remove any existing dst file
        unlinkSync(options.dst);

        done(); // Indicate the test is done.
    });

    test("task: minify JS", function(done) {

        let type = "js";
        let options = {
            src: "test/data/client_src/js/index.js",
            dst: "test/data/client_dist/js/index.min.js"
        };

        // Before test: Remove any existing dst file
        unlinkSync(options.dst);

        let testBlock = function() {warhorse.minify(type, options);};

        given("a valid JS source file to minify").expect(testBlock).toNotThrow();
        given("a valid JS bundle destination").expectFile(options.dst).toEqual(`const Square=require("./Square");let sq=new Square(30);console.log(sq.area);`);

        // After test: Remove any existing dst file
        //unlinkSync(options.dst);

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
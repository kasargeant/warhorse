/**
 * @file Warhorse.test.js
 * @description Unit tests for the Warhorse Class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const fs = require.requireActual("fs");
const Warhorse = require.requireActual("../../src/js/Warhorse");

// Constants
let fileDummy;

// Setup dummy CSS file
fileDummy = {
    original: "./test/data/client_src/css/index.css",
    path: "./test/data/client_src/css/",
    name: "index.css",
    stem: "index",
    extension: ".css",
    config: false,
    content: null
};
fileDummy.content = fs.readFileSync(fileDummy.original).toString();
const FILE_DUMMY_CSS = Object.freeze(fileDummy);

// Setup dummy LESS file
fileDummy = {
    original: "./test/data/client_src/less/index.less",
    path: "./test/data/client_src/less/",
    name: "index.less",
    stem: "index",
    extension: ".less",
    config: false,
    content: null
};
fileDummy.content = fs.readFileSync(fileDummy.original).toString();
const FILE_DUMMY_LESS = Object.freeze(fileDummy);

// Setup dummy JS file
fileDummy = {
    original: "./test/data/client_src/js/index.js",
    path: "./test/data/client_src/js/",
    name: "index.js",
    stem: "index",
    extension: ".js",
    config: false,
    content: null
};
fileDummy.content = fs.readFileSync(fileDummy.original).toString();
const FILE_DUMMY_JS = Object.freeze(fileDummy);

// Setup dummy JS file (Linting - FAIL CASE)
fileDummy = {
    original: "./test/data/client_src/js/Circle.js",
    path: "./test/data/client_src/js/",
    name: "Circle.js",
    stem: "Circle",
    extension: ".js",
    config: false,
    content: null
};
fileDummy.content = fs.readFileSync(fileDummy.original).toString();
const FILE_DUMMY_JS_LINT_FAIL = Object.freeze(fileDummy);


// Setup dummy SASS file
fileDummy = {
    original: "./test/data/client_src/sass/index.scss",
    path: "./test/data/client_src/sass/",
    name: "index.scss",
    stem: "index",
    extension: ".scss",
    config: false,
    content: null
};
fileDummy.content = fs.readFileSync(fileDummy.original).toString();
const FILE_DUMMY_SASS = Object.freeze(fileDummy);


let warhorse = new Warhorse();

// Tests
describe("Class: Warhorse", function() {

    describe("Standard sanity check", function() {
        it("contains spec with an positive expectation", function() {
            expect(true).toBe(true);
        });
        it("contains spec with a negative expectation", function() {
            expect(!true).toBe(false);
        });
    });

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

});
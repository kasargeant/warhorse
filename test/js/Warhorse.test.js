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
const path = require.requireActual("path");
const Warhorse = require.requireActual("../../src/js/Warhorse");

// Helpers
// Failure-tolerant version of fs.readFileSync(filePath) - won't error if file missing.
const readSync = function(filePath) {
    try {
        return fs.readFileSync(filePath);
    } catch(err) {
        return null;
    }
};

// Constants
const warhorse = new Warhorse(process.cwd(), process.cwd(), {}, false);

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

    describe("Instantiation", function() {

        it("should be instantiatable", function() {
            expect(warhorse).toBeDefined();
        });

        it("should be able to parse a filepath", function() {
            let path = warhorse._splitPath("./test/data/client_src/index.js");
            expect(path.name).toBe("index.js"); // Sanity test - don't rely just on snapshots!!!
            expect(path).toMatchSnapshot();
        });

        it("should know it's (home) directory location", function() {
            expect(warhorse.moduleDirectory).toBe(process.cwd());
        });
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // TASKS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    describe("Tasks", function() {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // TASK: BUNDLE
        it("should be able to bundle JS code", function() {

            // Preparation
            const options = {
                debug: false, //i.e. turn off source-mapping.
                src: "./test/data/client_src/js/index.js",
                dst: "./test/data/client_dist/js/index.js"
            };

            // Test
            warhorse.bundle("js", options);

            // Evaluation
            let fileContent = readSync(path.resolve(options.dst)).toString();
            expect(fileContent).toMatchSnapshot();

        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // TASK: COMPRESS

        it("should be able to compress JS code", function() {

            // Preparation
            const options = {
                src: "test/data/client_dist/js/index.min.js",
                dst: "test/data/client_dist/js/index.tar.gz"
            };

            // Test
            warhorse.compress("js", options);

            // Evaluation
            let fileContent = readSync(path.resolve(options.dst));
            // expect(fileContent).toMatchSnapshot();
            expect(fileContent.length).toBeGreaterThan(198);
            expect(fileContent.length).toBeLessThan(205);

        });

        it("should be able to compress CSS code", function() {

            // Preparation
            const options = {
                src: "test/data/client_dist/css/index.css",
                dst: "test/data/client_dist/css/index.min.css"
            };

            // Test
            warhorse.compress("css", options);

            // Evaluation
            let fileContent = readSync(path.resolve(options.dst));
            // expect(fileContent).toMatchSnapshot();
            expect(fileContent.length).toBeGreaterThan(9268);
            expect(fileContent.length).toBeLessThan(9272);

        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // TASK: COPY

        it("should be able to copy a file", function() {

            // Preparation
            const options = {
                src: "test/data/client_dist/css/index.css",
                dst: "test/data/client_dist/css/index1.css"
            };

            // Test
            warhorse.copy("text", options);

            // Evaluation
            let fileContentSrc = readSync(path.resolve(options.src)).toString();
            let fileContentDst = readSync(path.resolve(options.dst)).toString();
            expect(fileContentDst).toBe(fileContentSrc);

        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // TASK: DOCUMENT
        //TODO - unit test: lint

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // TASK: LINT
        //TODO - unit test: lint

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // TASK: MINIFY
        it("should be able to minify JS code", function() {

            // Preparation
            const options = {
                debug: false, //i.e. turn off source-mapping.
                src: "./test/data/client_src/js/index.js",
                dst: "./test/data/client_dist/js/index.min.js"
            };

            // Test
            warhorse.minify("js", options);

            // Evaluation
            let fileContent = readSync(path.resolve(options.dst)).toString();
            expect(fileContent).toMatchSnapshot();
        });

        it("should be able to minify CSS code", function() {

            // Preparation
            const options = {
                debug: false, //i.e. turn off source-mapping.
                src: "./test/data/client_src/css/index.css",
                dst: "./test/data/client_dist/css/index.min.css"
            };

            // Test
            warhorse.minify("css", options);

            // Evaluation
            let fileContent = readSync(path.resolve(options.dst)).toString();
            expect(fileContent).toMatchSnapshot();
            // expect(fileContent).toBe("");

        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // TASK: PREPROCESS
        //TODO - unit test: preprocess

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // TASK: POSTPROCESS
        //TODO - unit test: postprocess




        //
        // //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // // TODO - Implement asset packing tests
        // // it("should be able to pack a GIF", function() {
        // //     warhorse.file = JSON.parse(JSON.stringify(FILE_DUMMY_GIF));
        // //     warhorse.packGIF({});
        // //     expect(warhorse.file.content).toMatchSnapshot();
        // // });
        // //
        // // it("should be able to pack a JPG", function() {
        // //     warhorse.file = JSON.parse(JSON.stringify(FILE_DUMMY_JPG));
        // //     warhorse.packJPG({});
        // //     expect(warhorse.file.content).toMatchSnapshot();
        // // });
        // //
        // // it("should be able to pack a PNG", function() {
        // //     warhorse.file = JSON.parse(JSON.stringify(FILE_DUMMY_GIF));
        // //     warhorse.packGIF({});
        // //     expect(warhorse.file.content).toMatchSnapshot();
        // // });
        // //
        // // it("should be able to pack a SVG", function() {
        // //     warhorse.file = JSON.parse(JSON.stringify(FILE_DUMMY_SVG));
        // //     warhorse.packSVG({});
        // //     expect(warhorse.file.content).toMatchSnapshot();
        // // });


    });

});

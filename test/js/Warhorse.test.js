/**
 * @file Warhorse.test.js
 * @description Unit tests for the Warhorse Class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Environment
const IS_CI = process.env.CI;
const IS_TRAVIS = process.env.TRAVIS;
// console.log("IS_CI: " + IS_CI);
// console.log("IS_TRAVIS: " + IS_TRAVIS);
// console.log("CWD: " + process.cwd());
// console.log("TRAVIS_BUILD_DIR: " + process.env.TRAVIS_BUILD_DIR);
// console.log("__dirname: " + __dirname);
// console.log("__filename: " + __dirname);

// Imports
const fs = require.requireActual("fs");
const path = require.requireActual("path");
const shell = require("shelljs");
const sinon = require("sinon");


const Warhorse = require.requireActual("../../src/js/Warhorse");
// let resolvedFilePath = path.resolve("./test/data/client_dist/js/index.js");
// console.log("RESOLVED: " + resolvedFilePath);
// console.log("FILE_EXISTS?: " + fs.existsSync(resolvedFilePath));

// Helpers
// Failure-tolerant version of fs.readFileSync(filePath) - won't error if file missing.
const readSync = function(filePath) {
    try {
        return fs.readFileSync(filePath);
    } catch(err) {
        return null;
    }
};


// Failure-tolerant version of fs.unlinkSync(filePath) - won't crash if no file already exists!!!
const deleteSync = function(filePath) {
    try {
        fs.unlinkSync(filePath);
    } catch(err) {
        console.error(err.code);
    }
};

// Constants
let warhorseDirectory = process.cwd();
if(IS_TRAVIS) {warhorseDirectory = process.env.TRAVIS_BUILD_DIR;} // Usually: "/home/travis/build/kasargeant/warhorse"

// - Dummy data
const DUMMY_OPTIONS = {
    debug: false, //i.e. turn off source-mapping.
    src: "./test/data/client_src/js/index.js",
    dst: "./test/data/client_dist/js/index.js"
};

// Unit
let warhorse = null;

// Tests
describe("Class: Warhorse", function() {

    beforeEach(() => {
        warhorse = new Warhorse(warhorseDirectory, process.cwd(), {}, false);
    });

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

    describe("Command resolution (default)", function() {

        beforeEach(() => {
            sinon.spy(warhorse, "_execute");
        });

        afterEach(() => {
            warhorse._execute.restore(); // Hardly necessary... but just for the symmetrical hell-of-it.
        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // TASK: BUNDLE
        it("should be able to resolve configurations for bundling: JS", function() {

            // Execute
            warhorse.bundle("js", DUMMY_OPTIONS);

            // Evaluate
            expect(warhorse._execute.callCount).toBe(1);
            expect(warhorse._execute.getCall(0).args[0]).toBe(process.cwd());
            expect(warhorse._execute.getCall(0).args[1]).toBe("./node_modules/.bin/browserify");
            expect(warhorse._execute.getCall(0).args[2]).toBe(process.cwd());
            expect(warhorse._execute.getCall(0).args[3]).toEqual(["./test/data/client_src/js/index.js"]);
            expect(warhorse._execute.getCall(0).args[4]).toEqual({"config": undefined, "debug": false, "exclude": undefined, "external": undefined, "outfile": "./test/data/client_dist/js/index.js", "recurse": true});
            expect(warhorse._execute.getCall(0).args[5]).toEqual({"debug": false, "dst": "./test/data/client_dist/js/index.js", "src": "./test/data/client_src/js/index.js", "useEqualsSign": false, "useOutput": "stdout"});

            // Clean-up
            deleteSync(DUMMY_OPTIONS.dst); // Clean-up
        });


        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // TASK: DOCUMENT
        it("should be able to resolve configurations for documenting: JS", function() {

            // Execute
            warhorse.document("js", DUMMY_OPTIONS);

            // Evaluate
            expect(warhorse._execute.callCount).toBe(1);
            expect(warhorse._execute.getCall(0).args[0]).toBe(process.cwd());
            expect(warhorse._execute.getCall(0).args[1]).toBe("./node_modules/.bin/jsdoc");
            expect(warhorse._execute.getCall(0).args[2]).toBe(process.cwd());
            expect(warhorse._execute.getCall(0).args[3]).toEqual([path.resolve(process.cwd(), "./test/data/client_src/js/index.js")]);
            expect(warhorse._execute.getCall(0).args[4]).toEqual({
                "configure": path.resolve(process.cwd(), "./conf/jsdoc.json"),
                "destination": path.resolve(process.cwd(), "./test/data/client_dist/js/index.js"),
                "recurse": true,
                "verbose": false
            });
            expect(warhorse._execute.getCall(0).args[5]).toEqual({
                "conf": "./conf/jsdoc.json",
                "debug": false,
                "dst": "./test/data/client_dist/js/index.js",
                "src": "./test/data/client_src/js/index.js",
                "useOutput": "stdout"
            });

            // Clean-up
            shell.rm("-rf", DUMMY_OPTIONS.dst); // Clean-up
        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // TASK: LINT
        it("should be able to resolve configurations for linting: JS quality", function() {

            // Execute
            warhorse.lint("js", {
                type: "quality",
                conf: "conf/jshint.json",
                src: "test/data/client_src/js/",
                exclude: "conf/.jshintignore"
            });

            // Evaluate
            expect(warhorse._execute.callCount).toBe(1);
            expect(warhorse._execute.getCall(0).args[0]).toBe(process.cwd());
            expect(warhorse._execute.getCall(0).args[1]).toBe("./node_modules/.bin/jshint");
            expect(warhorse._execute.getCall(0).args[2]).toBe(process.cwd());
            expect(warhorse._execute.getCall(0).args[3]).toEqual([path.resolve(process.cwd(), "./test/data/client_src/js")]);
            expect(warhorse._execute.getCall(0).args[4]).toEqual({
                "config": path.resolve(process.cwd(), "./conf/jshint.json"),
                "reporter": path.resolve(process.cwd(), "./node_modules/jshint-json/json.js")
            });
            expect(warhorse._execute.getCall(0).args[5].useEqualsSign).toBe(true);
            expect(warhorse._execute.getCall(0).args[5].useOutput).toBe("jshint");

            // Clean-up
        });
        // TASK: LINT
        it("should be able to resolve configurations for linting: JS style", function() {

            // Execute
            warhorse.lint("js", {
                type: "style",
                conf: "conf/jscs.json",
                src: "test/data/client_src/js/"
            });

            // Evaluate
            expect(warhorse._execute.callCount).toBe(1);
            expect(warhorse._execute.getCall(0).args[0]).toBe(process.cwd());
            expect(warhorse._execute.getCall(0).args[1]).toBe("./node_modules/.bin/jscs");
            expect(warhorse._execute.getCall(0).args[2]).toBe(process.cwd());
            expect(warhorse._execute.getCall(0).args[3]).toEqual([path.resolve(process.cwd(), "./test/data/client_src/js")]);
            expect(warhorse._execute.getCall(0).args[4]).toEqual({
                "config": path.resolve(process.cwd(), "./conf/jscs.json"),
                "reporter": "json"
            });
            expect(warhorse._execute.getCall(0).args[5].useEqualsSign).toBe(true);
            expect(warhorse._execute.getCall(0).args[5].useOutput).toBe("jscs");

            // Clean-up
        });

    });



    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // TASK: COMPRESS - doesn't use _execute


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
            expect(fs.existsSync(options.dst)).toBe(true);

            let fileContent = readSync(options.dst);
            deleteSync(options.dst); // Clean-up immediately after read and before expect - to avoid leaving debris.

            expect(fileContent.toString()).toMatchSnapshot();

        });


        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // TASK: COMPRESS

        it("should be able to compress JS code", function() {

            // Preparation
            const options = {
                src: "./test/data/client_src/js/index.js",
                dst: "./test/data/client_dist/js/index.js.tar.gz"
            };

            // Test
            warhorse.compress("js", options);

            // Evaluation
            expect(fs.existsSync(options.dst)).toBe(true);

            //let fileContent = readSync(options.dst);
            deleteSync(options.dst); // Clean-up immediately after read and before expect - to avoid leaving debris.

            // // TODO - Output is too variable to use these - need better option
            // expect(fileContent.length).toBeGreaterThan(205);
            // expect(fileContent.length).toBeLessThan(225);

        });

        it("should be able to compress CSS code", function() {

            // Preparation
            const options = {
                src: "./test/data/client_src/css/index.css",
                dst: "./test/data/client_dist/css/index.css.tar.gz"
            };

            // Test
            warhorse.compress("css", options);

            // Evaluation
            expect(fs.existsSync(options.dst)).toBe(true);

            //let fileContent = readSync(options.dst);
            deleteSync(options.dst); // Clean-up immediately after read and before expect - to avoid leaving debris.

            // // TODO - Output is too variable to use these - need better option
            // expect(fileContent.length).toBeGreaterThan(840);
            // expect(fileContent.length).toBeLessThan(870);

        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // TASK: COPY

        it("should be able to copy a text file", function() {

            // Preparation
            const options = {
                src: "./test/data/client_src/css/index.css",
                dst: "./test/data/client_dist/css/index.css"
            };

            // Test
            warhorse.copy("text", options);

            // Evaluation
            expect(fs.existsSync(options.dst)).toBe(true);

            let fileContentSrc = readSync(path.resolve(options.src)).toString();
            let fileContentDst = readSync(path.resolve(options.dst)).toString();
            deleteSync(options.dst); // Clean-up immediately after read and before expect - to avoid leaving debris.
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
            let fileContent = readSync(options.dst);
            deleteSync(options.dst); // Clean-up immediately after read and before expect - to avoid leaving debris.
            expect(fileContent.toString()).toMatchSnapshot();
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
            let fileContent = readSync(options.dst);
            deleteSync(options.dst); // Clean-up immediately after read and before expect - to avoid leaving debris.
            expect(fileContent.toString()).toMatchSnapshot();

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

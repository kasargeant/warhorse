/**
 * @file WarhorseConfiguration.test.js
 * @description Unit tests for the Warhorse Configuration files.
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
const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const sinon = require("sinon");

// Unit
const Warhorse = require("../../src/js/Warhorse");
const commandConfig = require("../../_warhorse");

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
let warhorseInstance = new Warhorse(warhorseDirectory, process.cwd(), {}, false);
let warhorse = sinon.stub(warhorseInstance);
let cmds = commandConfig(warhorse);

// Tests
describe("Class: Warhorse", function() {

    beforeEach(function() {

    });
    afterEach(function() {
        warhorse.bundle.reset();
        warhorse.clean.reset();
        warhorse.compress.reset();
        warhorse.copy.reset();
        warhorse.document.reset();
        // warhorse.fix.reset();
        warhorse.lint.reset();
        warhorse.minify.reset();
        warhorse.test.reset();
        warhorse.version.reset();
    });


    describe("Standard sanity check", function() {
        it("contains spec with an positive expectation", function() {
            expect(true).toBe(true);
        });
        it("contains spec with a negative expectation", function() {
            expect(!true).toBe(false);
        });
    });

    describe("User-configured commands", function() {
        it("should have a full set of tasks to support the command: build", function() {
            cmds.build();
            expect(warhorse.bundle.callCount).toBe(1);
            expect(warhorse.compress.callCount).toBe(1);
            expect(warhorse.minify.callCount).toBe(1);
            expect(warhorse.version.callCount).toBe(1);
        });

        it("should have a full set of tasks to support the command: clean", function() {
            cmds.clean();
            expect(warhorse.clean.callCount).toBe(1);
        });

        it("should have a full set of tasks to support the command: distribute", function() {
            cmds.distribute();
            expect(warhorse.execute.callCount).toBe(6);
        });

        it("should have a full set of tasks to support the command: document", function() {
            cmds.document();
            expect(warhorse.document.callCount).toBe(1);
        });

        // it("should have a full set of tasks to support the command: fix", function() {
        //     cmds.fix();
        //     expect(warhorse.fix.callCount).toBe(1);
        // });

        it("should have a full set of tasks to support the command: lint", function() {
            cmds.lint();
            expect(warhorse.lint.callCount).toBe(2);
        });

        it("should have a full set of tasks to support the command: pack", function() {
            cmds.pack();
            expect(warhorse.compress.callCount).toBe(4);
            expect(warhorse.copy.callCount).toBe(1);
        });

        it("should have a full set of tasks to support the command: fix", function() {
            cmds.process();
            expect(warhorse.preprocess.callCount).toBe(2);
            expect(warhorse.postprocess.callCount).toBe(1);
            expect(warhorse.minify.callCount).toBe(1);
        });

        // it("should have a full set of tasks to support the command: fix", function() {
        //     cmds.publish();
        //     expect(warhorse.publish.callCount).toBe(0); //TODO - Implement Publish unit test.
        // });

        it("should have a full set of tasks to support the command: distribute", function() {
            cmds.test();
            expect(warhorse.test.callCount).toBe(1);
        });

    });


});

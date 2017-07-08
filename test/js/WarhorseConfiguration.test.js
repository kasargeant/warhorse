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
const defaults = require("../../src/js/conf/defaults_testing");

// Constants
let warhorseDirectory = process.cwd();
if(IS_TRAVIS) {warhorseDirectory = process.env.TRAVIS_BUILD_DIR;} // Usually: "/home/travis/build/kasargeant/warhorse"

// Unit
let warhorse = new Warhorse(warhorseDirectory, process.cwd(), {}, false);

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
    describe("warhorse._executeTask", function() {

        // We cover all available exits from command() before testing.
        beforeEach(function() {
            sinon.stub(warhorse, "bundle");
            sinon.stub(warhorse, "clean");
            sinon.stub(warhorse, "compress");
            sinon.stub(warhorse, "copy");
            sinon.stub(warhorse, "document");
            // sinon.stub(warhorse, "fix");
            sinon.stub(warhorse, "lint");
            sinon.stub(warhorse, "minify");
            sinon.stub(warhorse, "preprocess");
            sinon.stub(warhorse, "postprocess");
            sinon.stub(warhorse, "test");
            sinon.stub(warhorse, "version");
        });
        afterEach(function() {
            warhorse.bundle.restore();
            warhorse.clean.restore();
            warhorse.compress.restore();
            warhorse.copy.restore();
            warhorse.document.restore();
            // warhorse.fix.restore();
            warhorse.lint.restore();
            warhorse.minify.restore();
            warhorse.preprocess.restore();
            warhorse.postprocess.restore();
            warhorse.test.restore();
            warhorse.version.restore();
        });

        const TEST_TOOL_CONFIG = {desc: "Testing tool", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false};

        it("should call the correct method for task: bundle:js", function() {
            // Test
            warhorse._executeTask(TEST_TOOL_CONFIG, {idn: "bundle:js", src: ["./test/data/client_src", "**/index.js"], dst: ["./test/data/client_dist", ".js"]});

            // Evaluate
            expect(warhorse.bundle.callCount).toBe(1);
            expect(warhorse.bundle.getCall(0).args[0]).toBe("js");
        });

        it("should call the correct method for task: compress:css", function() {
            // Test
            warhorse._executeTask(TEST_TOOL_CONFIG, {idn: "compress:css", src: ["./test/data/client_src/css", "**/*.css"], dst: ["./test/data/client_dist/css", ".min.css.tar.gz"]});

            // Evaluate
            expect(warhorse.compress.callCount).toBe(1);
            expect(warhorse.compress.getCall(0).args[0]).toBe("css");
        });
    });

    //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    // WARHORSE._EXECUTEPIPELINE
    describe("warhorse._executePipeline", function() {

        // We cover all available exits from command() before testing.
        beforeEach(function() {
            sinon.stub(warhorse, "_executeTask");
        });
        afterEach(function() {
            warhorse._executeTask.restore();
        });

        it("should handle typical values", function() {
            // Test
            warhorse._executePipeline("build", [
                {idn: "bundle:js", src: ["./test/data/client_src", "**/index.js"], dst: ["./test/data/client_dist", ".js"]},
            ]);

            // Evaluate
            expect(warhorse._executeTask.callCount).toBe(1);
            expect(warhorse._executeTask.getCall(0).args[0]).toEqual({"debug": false, "desc": "Bundling JS", "expandGlobs": true, "silent": false, "useEqualsSign": false, "useOutput": "stdout"});
            expect(warhorse._executeTask.getCall(0).args[1]).toEqual({"dst": ["./test/data/client_dist", ".js"], "idn": "bundle:js", "src": ["./test/data/client_src", "**/index.js"]});

        });
    });

    //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    // WARHORSE.COMMAND
    describe("warhorse.command", function() {

        // We cover all available exits from command() before testing.
        beforeEach(function() {
            sinon.stub(warhorse, "_cmdCreate");
            sinon.stub(warhorse, "_cmdDeploy");
            sinon.stub(warhorse, "_cmdWatch");
            sinon.stub(warhorse, "_executePipeline");
        });
        afterEach(function() {
            warhorse._cmdCreate.restore();
            warhorse._cmdDeploy.restore();
            warhorse._cmdWatch.restore();
            warhorse._executePipeline.restore();
        });

        it("should correctly route built-in command: create", function() {
            // Test
            warhorse.command(["create", "module"], {});

            // Evaluate exits
            expect(warhorse._cmdCreate.callCount).toBe(1);
            expect(warhorse._cmdDeploy.callCount).toBe(0);
            expect(warhorse._cmdWatch.callCount).toBe(0);
            expect(warhorse._executePipeline.callCount).toBe(0);

            // Evaluate args
            expect(warhorse._cmdCreate.getCall(0).args[0]).toBe("module");
        });

        it("should correctly route built-in command: watch", function() {
            // Test
            warhorse.command(["watch", "distribute"], {});

            // Evaluate exits
            expect(warhorse._cmdCreate.callCount).toBe(0);
            expect(warhorse._cmdDeploy.callCount).toBe(0);
            expect(warhorse._cmdWatch.callCount).toBe(1);
            expect(warhorse._executePipeline.callCount).toBe(0);

            // Evaluate args: workingDirectory, pipelineType, options
            expect(warhorse._cmdWatch.getCall(0).args[0]).toBe(process.cwd());
            expect(warhorse._cmdWatch.getCall(0).args[1]).toBe("distribute");
            expect(warhorse._cmdWatch.getCall(0).args[2].language).toEqual("es51");
        });


        it("should correctly route built-in command: deploy", function() {
            // Test
            warhorse.command(["deploy", "cordova"], {});

            // Evaluate exits
            expect(warhorse._cmdCreate.callCount).toBe(0);
            expect(warhorse._cmdDeploy.callCount).toBe(1);
            expect(warhorse._cmdWatch.callCount).toBe(0);
            expect(warhorse._executePipeline.callCount).toBe(0);

            // Evaluate args
            expect(warhorse._cmdDeploy.getCall(0).args[0]).toBe("cordova");
        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        it("should correctly route a pipeline command for a type: build/js", function() {
            // Test
            warhorse.command(["build", "js"], {});

            // Evaluate exits
            expect(warhorse._cmdCreate.callCount).toBe(0);
            expect(warhorse._cmdDeploy.callCount).toBe(0);
            expect(warhorse._cmdWatch.callCount).toBe(0);
            expect(warhorse._executePipeline.callCount).toBe(1);

            // Evaluate args
            expect(warhorse._executePipeline.getCall(0).args[0]).toBe("build");
            expect(warhorse._executePipeline.getCall(0).args[1]).toEqual([{"dst": ["./dist", ".js"], "idn": "bundle:js", "src": ["./src", "**/index.js"]}]);
        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        it("should correctly route a pipeline command for all types: build", function() {
            // Test
            warhorse.command(["build"], {});

            // Evaluate exits
            expect(warhorse._cmdCreate.callCount).toBe(0);
            expect(warhorse._cmdDeploy.callCount).toBe(0);
            expect(warhorse._cmdWatch.callCount).toBe(0);
            expect(warhorse._executePipeline.callCount).toBe(10);

            // Evaluate args
            expect(warhorse._executePipeline.getCall(0).args[0]).toBe("build");
            expect(warhorse._executePipeline.getCall(0).args[1]).toEqual([{"dst": ["./dist", ".js"], "idn": "bundle:js", "src": ["./src", "**/index.js"]}]);
        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        it("should not route an invalid command: INVALID", function() {

            // Setup
            sinon.stub(console, "log");

            // Test
            warhorse.command(["TEST_INVALID", "js"], {});

            // Evaluate exits
            expect(warhorse._cmdCreate.callCount).toBe(0);
            expect(warhorse._cmdDeploy.callCount).toBe(0);
            expect(warhorse._cmdWatch.callCount).toBe(0);
            expect(warhorse._executePipeline.callCount).toBe(0);

            // Evaluate console errors
            expect(console.log.callCount).toBe(1);
            expect(console.log.getCall(0).args[0]).toContain(`Unrecognised`);

            // Cleanup
            console.log.restore();
        });
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        it("should not route an invalid type: INVALID_TYPE", function() {

            // Setup
            sinon.stub(console, "log");

            // Test
            warhorse.command(["build", "INVALID_TYPE"], {});

            // Evaluate exits
            expect(warhorse._cmdCreate.callCount).toBe(0);
            expect(warhorse._cmdDeploy.callCount).toBe(0);
            expect(warhorse._cmdWatch.callCount).toBe(0);
            expect(warhorse._executePipeline.callCount).toBe(0);

            // Evaluate console errors
            expect(console.log.callCount).toBe(3);
            expect(console.log.getCall(2).args[0]).toContain(`Unrecognised`);

            // Cleanup
            console.log.restore();
        });
    });


});

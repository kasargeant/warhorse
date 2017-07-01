/**
 * @file CliHelper.test.js
 * @description Unit tests for the CliHelper Class (static).
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Environment
const IS_CI = process.env.CI;
const IS_TRAVIS = process.env.TRAVIS;

// Imports

// Unit
const CliHelper = require("../../src/js/helpers/CliHelper");

// Constants/Dummy data

// Tests
describe("Class: CliHelper", function() {

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
            expect(CliHelper).toBeDefined();
        });

    });
    // expect(path).toMatchSnapshot();

    // Command-line arguments are values (usually strings) ordered in simple sequence. e.g. someSrc.js someDst.min.js
    describe("Compiling: command line arguments (array)", function() {
        it("should be able to compile with empty args array", function() {
            let cmdLineArgs = CliHelper._compileCmdLineArgs([]);
            expect(cmdLineArgs).toBe("");
        });
        it("should be able to compile an array of a single arg", function() {
            let cmdLineArgs = CliHelper._compileCmdLineArgs(["test/data/client_src/js/index.js"]);
            expect(cmdLineArgs).toBe("test/data/client_src/js/index.js");
        });
        it("should be able to compile an array of two args", function() {
            let cmdLineArgs = CliHelper._compileCmdLineArgs(["test/data/client_src/js/index.js", "test/data/client_src/js/index.min.js"]);
            expect(cmdLineArgs).toBe("test/data/client_src/js/index.js test/data/client_src/js/index.min.js");
        });
        it("should be able to compile an array of multiple args of multiple types", function() {
            let cmdLineArgs = CliHelper._compileCmdLineArgs(["test/data/client_src/js/index.js", "test/data/client_src/js/index.min.js", true, 3]);
            expect(cmdLineArgs).toBe("test/data/client_src/js/index.js test/data/client_src/js/index.min.js true 3");
        });
    });

    describe("Compiling: command line arguments (string)", function() {
        it("should be able to compile with an empty string arg", function() {
            let cmdLineArgs = CliHelper._compileCmdLineArgs("");
            expect(cmdLineArgs).toBe("");
        });
        it("should be able to compile with a single string arg", function() {
            let cmdLineArgs = CliHelper._compileCmdLineArgs("someArg");
            expect(cmdLineArgs).toBe("someArg");
        });
        it("should be able to compile with a single string but mulitiple args", function() {
            let cmdLineArgs = CliHelper._compileCmdLineArgs("someArg --someOption=something");
            expect(cmdLineArgs).toBe("someArg --someOption=something");
        });
    });

    // Command-line argument options are values preceeded by some flag.
    // CASES WITHOUT OPTION EQUALS e.g. --someOption true
    describe("Compiling: command line argument options", function() {
        it("should be able to compile without args", function() {
            let cmdLineArgOptions = CliHelper._compileCmdLineArgsAsOptions({});
            expect(cmdLineArgOptions).toBe("");
        });
        it("should be able to compile arg options without values", function() {
            let cmdLineArgOptions = CliHelper._compileCmdLineArgsAsOptions({"recurse": true});
            expect(cmdLineArgOptions).toBe("--recurse");
        });
        it("should be able to compile arg options with values", function() {
            let cmdLineArgOptions = CliHelper._compileCmdLineArgsAsOptions({"outfile": "test/data/client_dist/js/index.js", "recurse": true});
            expect(cmdLineArgOptions).toBe("--outfile test/data/client_dist/js/index.js --recurse");
        });
    });

    // Command-line argument options are values preceeded by some flag.
    // CASES WITH OPTION EQUALS e.g. --someOption=true
    describe("Compiling: command line argument options (using equals sign assignment)", function() {
        it("should be able to compile without args", function() {
            let cmdLineArgOptions = CliHelper._compileCmdLineArgsAsOptions({}, {useEqualsSign: true});
            expect(cmdLineArgOptions).toBe("");
        });
        it("should be able to compile arg options without values", function() {
            let cmdLineArgOptions = CliHelper._compileCmdLineArgsAsOptions({"recurse": true}, {useEqualsSign: true});
            expect(cmdLineArgOptions).toBe("--recurse");
        });
        it("should be able to compile arg options with values", function() {
            let cmdLineArgOptions = CliHelper._compileCmdLineArgsAsOptions({"outfile": "test/data/client_dist/js/index.js", "recurse": true}, {useEqualsSign: true});
            expect(cmdLineArgOptions).toBe("--outfile=test/data/client_dist/js/index.js --recurse");
        });
    });

    // Final Command-line
    describe("Compiling: final command line", function() {
        it("should be able to compile a command line without args", function() {

            const EXECUTABLE_PATH = "/usr/bin/local/warhorse/node_modules/.bin/warhorse";
            const ARGS = ["./test/data/client_src/js/index.js"];
            const ARG_OPTIONS = {"debug": false,"outfile": "./test/data/client_dist/js/index.js", "recurse": true};
            const OPTIONS = {"debug": false, "useOutput": "stdout", "useEqualsSign": false, "src": "./test/data/client_src/js/index.js", "dst": "./test/data/client_dist/js/index.js"};

            let cmdLine = CliHelper._compileCmdLine(EXECUTABLE_PATH, ARGS, ARG_OPTIONS, OPTIONS);

            expect(cmdLine).toBe("/usr/bin/local/warhorse/node_modules/.bin/warhorse ./test/data/client_src/js/index.js --outfile ./test/data/client_dist/js/index.js --recurse");
        });

    });

});

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
const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const sinon = require("sinon");

// Unit
const Warhorse = require("../../src/js/Warhorse");

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

let defaults = require("../../src/js/conf/defaults_testing");

// - Dummy data
const DUMMY_OPTIONS = {
    debug: false, //i.e. turn off source-mapping.
    src: "./test/data/client_src/js/index.js",
    dst: "./test/data/client_dist/js/index.js",
    isSilent: true
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

        it("should know it's (home) directory location", function() {
            expect(warhorse.moduleDirectory).toBe(process.cwd());
        });
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // COMMANDS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    describe("Commands", function() {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // COMMAND: CREATE
        it("should call the built-in commands from valid user args: create", function() {

            // Setup
            let cmdStub = sinon.stub(warhorse, "_cmdCreate").returns(null);

            // Test
            warhorse.command(["create", "module"]);

            // Evaluation
            expect(cmdStub.callCount).toBe(1);
            expect(cmdStub.getCall(0).args[0]).toBe("module");

            // Cleanup
            warhorse._cmdCreate.restore();
        });
        it("should not call the built-in commands from invalid user args: create", function() {

            // Setup
            let cmdStub = sinon.stub(warhorse, "_cmdCreate").returns(null);

            // Test
            warhorse.command(["create", "something"]);

            // Evaluation
            expect(cmdStub.callCount).toBe(0);

            // Cleanup
            warhorse._cmdCreate.restore();
        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // COMMAND: DEPLOY
        it("should call the built-in commands from valid user args: deploy", function() {

            // Setup
            let cmdStub = sinon.stub(warhorse, "_cmdDeploy").returns(null);

            // Test
            warhorse.command(["deploy", "cordova"]);

            // Evaluation
            expect(cmdStub.callCount).toBe(1);
            expect(cmdStub.getCall(0).args[0]).toBe("cordova");

            // Cleanup
            warhorse._cmdDeploy.restore();
        });
        it("should not call the built-in commands from invalid user args: deploy", function() {

            // Setup
            let cmdStub = sinon.stub(warhorse, "_cmdDeploy").returns(null);

            // Test
            warhorse.command(["deploy", "rubbish"]);

            // Evaluation
            expect(cmdStub.callCount).toBe(0);

            // Cleanup
            warhorse._cmdDeploy.restore();
        });


        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // COMMAND: WATCH
        it("should call the built-in commands that have no arguments: watch", function() {

            // Setup
            let cmdStub = sinon.stub(warhorse, "_cmdWatch").returns(null);

            // Test
            warhorse.command(["watch"]);

            // Evaluation
            expect(cmdStub.callCount).toBe(1);

            // Cleanup
            warhorse._cmdWatch.restore();
        });

        // it("should not call an invalid built-in command.", function() {
        //
        //     // Setup
        //     let cmdStub = sinon.stub(warhorse, "_cmdDeploy").returns(null);
        //
        //     // Test
        //     warhorse.command(["deploy", "rubbish"]);
        //
        //     // Evaluation
        //     expect(cmdStub.callCount).toBe(0);
        //
        //     // Cleanup
        //     warhorse._cmdDeploy.restore();
        // });
    });
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // TASK RESOLUTION
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    describe("Command resolution (default)", function() {

        beforeEach(() => {
            sinon.spy(warhorse, "_execute");
        });

        afterEach(() => {
            warhorse._execute.restore(); // Hardly necessary... but just for the symmetrical hell-of-it.
        });
        //
        // //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // // TASK: BUNDLE
        // it("should be able to resolve configurations for bundling: JS", function() {
        //
        //     // Setup
        //     let options = defaults.tools.build["bundle:js"];
        //     let config = defaults.pipelines.build["js"][0];
        //     let src = path.resolve(config.src[0], config.src[1]);
        //     let dst = warhorse._resolveDst(config.src[0], src, config.dst[0], config.dst[1]);
        //     config.src = src;
        //     config.dst = dst;
        //
        //     // Execute
        //     warhorse.bundle("js", config, options);
        //
        //     // Evaluate
        //     expect(warhorse._execute.callCount).toBe(1);
        //     expect(warhorse._execute.getCall(0).args[0]).toBe(process.cwd());
        //     expect(warhorse._execute.getCall(0).args[1]).toBe("./node_modules/.bin/browserify");
        //     expect(warhorse._execute.getCall(0).args[2]).toBe(process.cwd());
        //     expect(warhorse._execute.getCall(0).args[3]).toEqual(["/Users/kasargeant/dev/projects/warhorse/test/data/client_src/**/index.js"]);
        //     expect(warhorse._execute.getCall(0).args[4]).toEqual({"config": undefined, "debug": undefined, "exclude": undefined, "external": undefined, "outfile": "/Users/kasargeant/dev/projects/warhorse/test/data/client_dist/**/index.js", "recurse": true});
        //     expect(warhorse._execute.getCall(0).args[5]).toEqual({"debug": false, "desc": "Bundling JS", "expandGlobs": true, "silent": false, "useEqualsSign": false, "useOutput": "stdout"});
        //
        //     // Cleanup
        //     shell.rm(config.dst); // Clean-up
        // });

        //
        // //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // // TASK: COMPRESS (TEXT) - doesn't use _execute!
        //
        // //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // // TASK: COMPRESS (BINARY)
        // // it("should be able to resolve configurations for bundling: GIF", function() {
        // //     // TODO - Implement unit test COMPRESS GIF
        // // });
        //
        // it("should be able to resolve configurations for bundling: GIF", function() {
        //
        //     // Setup
        //     let options = {
        //         src: "./test/data/client_src/img/East_pediment_O_Parthenon_BM.jpg",
        //         dst: "./test/data/client_dist/img",
        //         isSilent: true
        //     };
        //
        //     // Execute
        //     warhorse.compress("jpg", options);
        //
        //     // Evaluate
        //     expect(warhorse._execute.callCount).toBe(1);
        //     expect(warhorse._execute.getCall(0).args[0]).toBe(process.cwd());
        //     expect(warhorse._execute.getCall(0).args[1]).toBe("./node_modules/.bin/imagemin");
        //     expect(warhorse._execute.getCall(0).args[2]).toBe(process.cwd());
        //     expect(warhorse._execute.getCall(0).args[3]).toEqual(["./test/data/client_src/img/East_pediment_O_Parthenon_BM.jpg"]);
        //     expect(warhorse._execute.getCall(0).args[4]).toEqual({"map": undefined, "out-dir": "./test/data/client_dist/img", "plugin": "jpegtran"});
        //     expect(warhorse._execute.getCall(0).args[5]).toEqual({"dst": "./test/data/client_dist/img", isSilent: true, "src": "./test/data/client_src/img/East_pediment_O_Parthenon_BM.jpg"});
        //
        //     // Clean-up
        //     shell.rm("./test/data/client_dist/img/East_pediment_O_Parthenon_BM.jpg");
        // });
        //
        // it("should be able to resolve configurations for bundling: PNG", function() {
        //
        //     // Setup
        //     let options = {
        //         src: "./test/data/client_src/img/file-archive-o.png",
        //         dst: "./test/data/client_dist/img",
        //         isSilent: true
        //     };
        //
        //     // Execute
        //     warhorse.compress("png", options);
        //
        //     // Evaluate
        //     expect(warhorse._execute.callCount).toBe(1);
        //     expect(warhorse._execute.getCall(0).args[0]).toBe(process.cwd());
        //     expect(warhorse._execute.getCall(0).args[1]).toBe("./node_modules/.bin/imagemin");
        //     expect(warhorse._execute.getCall(0).args[2]).toBe(process.cwd());
        //     expect(warhorse._execute.getCall(0).args[3]).toEqual(["./test/data/client_src/img/file-archive-o.png"]);
        //     expect(warhorse._execute.getCall(0).args[4]).toEqual({"map": undefined, "out-dir": "./test/data/client_dist/img", "plugin": "pngquant"});
        //     expect(warhorse._execute.getCall(0).args[5]).toEqual({"dst": "./test/data/client_dist/img", isSilent: true, "src": "./test/data/client_src/img/file-archive-o.png"});
        //
        //     // Clean-up
        //     shell.rm("./test/data/client_dist/img/file-archive-o.png");
        // });
        //
        // it("should be able to resolve configurations for bundling: SVG", function() {
        //
        //     // Setup
        //     let options = {
        //         src: "./test/data/client_src/img/file-archive-o.svg",
        //         dst: "./test/data/client_dist/img",
        //         isSilent: true
        //     };
        //
        //     // Execute
        //     warhorse.compress("svg", options);
        //
        //     // Evaluate
        //     expect(warhorse._execute.callCount).toBe(1);
        //     expect(warhorse._execute.getCall(0).args[0]).toBe(process.cwd());
        //     expect(warhorse._execute.getCall(0).args[1]).toBe("./node_modules/.bin/imagemin");
        //     expect(warhorse._execute.getCall(0).args[2]).toBe(process.cwd());
        //     expect(warhorse._execute.getCall(0).args[3]).toEqual(["./test/data/client_src/img/file-archive-o.svg"]);
        //     expect(warhorse._execute.getCall(0).args[4]).toEqual({"map": undefined, "out-dir": "./test/data/client_dist/img", "plugin": "svgo"});
        //     expect(warhorse._execute.getCall(0).args[5]).toEqual({"dst": "./test/data/client_dist/img", isSilent: true, "src": "./test/data/client_src/img/file-archive-o.svg"});
        //
        //     // Clean-up
        //     shell.rm("./test/data/client_dist/img/file-archive-o.svg");
        // });
        //
        // //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // // TASK: DOCUMENT
        // it("should be able to resolve configurations for documenting: JS", function() {
        //
        //     // Execute
        //     warhorse.document("js", DUMMY_OPTIONS);
        //
        //     // Evaluate
        //     expect(warhorse._execute.callCount).toBe(1);
        //     expect(warhorse._execute.getCall(0).args[0]).toBe(process.cwd());
        //     expect(warhorse._execute.getCall(0).args[1]).toBe("./node_modules/.bin/jsdoc");
        //     expect(warhorse._execute.getCall(0).args[2]).toBe(process.cwd());
        //     expect(warhorse._execute.getCall(0).args[3]).toEqual([path.resolve(process.cwd(), "./test/data/client_src/js/index.js")]);
        //     expect(warhorse._execute.getCall(0).args[4]).toEqual({
        //         "configure": path.resolve(process.cwd(), "./conf/jsdoc.json"),
        //         "destination": path.resolve(process.cwd(), "./test/data/client_dist/js/index.js"),
        //         "recurse": true,
        //         "verbose": false
        //     });
        //     expect(warhorse._execute.getCall(0).args[5]).toEqual({"debug": false, "dst": "./test/data/client_dist/js/index.js", isSilent: true, "src": "./test/data/client_src/js/index.js", "useOutput": "stdout"});
        //
        //     // Clean-up
        //     shell.rm("-rf", DUMMY_OPTIONS.dst); // Clean-up
        // });
        //
        // //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // // TASK: LINT
        //
        // // JS QUALITY
        // it("should be able to resolve configurations for linting: JS quality", function() {
        //
        //     // Execute
        //     warhorse.lint("js", {
        //         type: "quality",
        //         conf: "conf/jshint.json",
        //         src: "test/data/client_src/js/",
        //         exclude: "conf/.jshintignore",
        //         isSilent: true
        //     });
        //
        //     // Evaluate
        //     expect(warhorse._execute.callCount).toBe(1);
        //     expect(warhorse._execute.getCall(0).args[0]).toBe(process.cwd());
        //     expect(warhorse._execute.getCall(0).args[1]).toBe("./node_modules/.bin/jshint");
        //     expect(warhorse._execute.getCall(0).args[2]).toBe(process.cwd());
        //     expect(warhorse._execute.getCall(0).args[3]).toEqual([path.resolve(process.cwd(), "./test/data/client_src/js")]);
        //     expect(warhorse._execute.getCall(0).args[4]).toEqual({
        //         "config": path.resolve(process.cwd(), "./conf/jshint.json"),
        //         "reporter": path.resolve(process.cwd(), "./node_modules/jshint-json/json.js")
        //     });
        //     expect(warhorse._execute.getCall(0).args[5].useEqualsSign).toBe(true);
        //     expect(warhorse._execute.getCall(0).args[5].useOutput).toBe("jshint");
        //
        //     // Clean-up
        // });
        //
        // // JS STYLE
        // it("should be able to resolve configurations for linting: JS style", function() {
        //
        //     // Execute
        //     warhorse.lint("js", {
        //         type: "style",
        //         conf: "conf/jscs.json",
        //         src: "test/data/client_src/js/",
        //         isSilent: true
        //     });
        //
        //     // Evaluate
        //     expect(warhorse._execute.callCount).toBe(1);
        //     expect(warhorse._execute.getCall(0).args[0]).toBe(process.cwd());
        //     expect(warhorse._execute.getCall(0).args[1]).toBe("./node_modules/.bin/jscs");
        //     expect(warhorse._execute.getCall(0).args[2]).toBe(process.cwd());
        //     expect(warhorse._execute.getCall(0).args[3]).toEqual([path.resolve(process.cwd(), "./test/data/client_src/js")]);
        //     expect(warhorse._execute.getCall(0).args[4]).toEqual({
        //         "config": path.resolve(process.cwd(), "./conf/jscs.json"),
        //         "reporter": "json"
        //     });
        //     expect(warhorse._execute.getCall(0).args[5].useEqualsSign).toBe(true);
        //     expect(warhorse._execute.getCall(0).args[5].useOutput).toBe("jscs");
        //
        //     // Clean-up
        // });
        //
        // //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // // TASK: MINIFY
        //
        // // JS
        // it("should be able to resolve configurations for minify: JS", function() {
        //
        //     // Setup
        //     let options = {
        //         src: "./test/data/client_src/js/index.js",
        //         dst: "./test/data/client_dist/js/index.min.js",
        //         isSilent: true
        //     };
        //
        //     // Execute
        //     warhorse.minify("js", options);
        //
        //     // Evaluate
        //     expect(warhorse._execute.callCount).toBe(1);
        //     expect(warhorse._execute.getCall(0).args[0]).toBe(process.cwd());
        //     expect(warhorse._execute.getCall(0).args[1]).toBe("./node_modules/.bin/uglifyjs");
        //     expect(warhorse._execute.getCall(0).args[2]).toBe(process.cwd());
        //     expect(warhorse._execute.getCall(0).args[3]).toEqual(["./test/data/client_src/js/index.js"]);
        //     expect(warhorse._execute.getCall(0).args[4]).toEqual({"compress": true, "config-file": undefined, "mangle": true, "output": "./test/data/client_dist/js/index.min.js", "verbose": false});
        //     expect(warhorse._execute.getCall(0).args[5]).toEqual({"debug": false, "dst": "./test/data/client_dist/js/index.min.js", "isSilent": true, "src": "./test/data/client_src/js/index.js", "useEqualsSign": false, "useOutput": "stdout"});
        //
        //     // Clean-up
        //     shell.rm(options.dst);
        // });
        //
        // // CSS
        // it("should be able to resolve configurations for minify: CSS", function() {
        //
        //     // Setup
        //     let options = {
        //         src: "./test/data/client_src/css/index.css",
        //         dst: "./test/data/client_dist/css/index.min.css",
        //         isSilent: true
        //     };
        //
        //     // Execute
        //     warhorse.minify("css", options);
        //
        //     // Evaluate
        //     expect(warhorse._execute.callCount).toBe(1);
        //     expect(warhorse._execute.getCall(0).args[0]).toBe(process.cwd());
        //     expect(warhorse._execute.getCall(0).args[1]).toBe("./node_modules/.bin/csso");
        //     expect(warhorse._execute.getCall(0).args[2]).toBe(process.cwd());
        //     expect(warhorse._execute.getCall(0).args[3]).toEqual([]);
        //     expect(warhorse._execute.getCall(0).args[4]).toEqual({"debug": false, "input": "./test/data/client_src/css/index.css", "map": false, "output": "./test/data/client_dist/css/index.min.css"});
        //     expect(warhorse._execute.getCall(0).args[5]).toEqual({"debug": false, "dst": "./test/data/client_dist/css/index.min.css", isSilent: true, "src": "./test/data/client_src/css/index.css", "useEqualsSign": false, "useOutput": "stdout"});
        //
        //     // Clean-up
        //     shell.rm(options.dst);
        // });
        //
        //
        // //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // // TASK: PREPROCESS
        //
        // // LESS
        // it("should be able to resolve configurations for preprocess: LESS", function() {
        //
        //     // Setup
        //     let options = {
        //         src: "./test/data/client_src/less/index.less",
        //         dst: "./test/data/client_dist/css/index.css",
        //         include: "./test/data/client_src/less",
        //         isSilent: true
        //     };
        //
        //     // Execute
        //     warhorse.preprocess("less", options);
        //
        //     // Evaluate
        //     expect(warhorse._execute.callCount).toBe(1);
        //     expect(warhorse._execute.getCall(0).args[0]).toBe(process.cwd());
        //     expect(warhorse._execute.getCall(0).args[1]).toBe("./node_modules/.bin/lessc");
        //     expect(warhorse._execute.getCall(0).args[2]).toBe(process.cwd());
        //     expect(warhorse._execute.getCall(0).args[3]).toEqual(["./test/data/client_src/less/index.less", "./test/data/client_dist/css/index.css"]);
        //     expect(warhorse._execute.getCall(0).args[4]).toEqual({"include-path": "./test/data/client_src/less", "relative-urls": true, "source-map": undefined});
        //     expect(warhorse._execute.getCall(0).args[5]).toEqual({"dst": "./test/data/client_dist/css/index.css", "include": "./test/data/client_src/less", isSilent: true, "src": "./test/data/client_src/less/index.less", "useEqualsSign": true});
        //
        //     // Clean-up
        //     shell.rm(options.dst);
        // });
        //
        //
        // // SASS
        // it("should be able to resolve configurations for preprocess: SASS", function() {
        //
        //     // Setup
        //     let options = {
        //         src: "./test/data/client_src/sass/index.scss",
        //         dst: "./test/data/client_dist/css/index.css",
        //         include: "./test/data/client_src/sass",
        //         isSilent: true
        //     };
        //
        //     // Execute
        //     warhorse.preprocess("sass", options);
        //
        //     // Evaluate
        //     expect(warhorse._execute.callCount).toBe(1);
        //     expect(warhorse._execute.getCall(0).args[0]).toBe(process.cwd());
        //     expect(warhorse._execute.getCall(0).args[1]).toBe("./node_modules/.bin/node-sass");
        //     expect(warhorse._execute.getCall(0).args[2]).toBe(process.cwd());
        //     expect(warhorse._execute.getCall(0).args[3]).toEqual(["./test/data/client_src/sass/index.scss", "./test/data/client_dist/css/index.css"]);
        //     expect(warhorse._execute.getCall(0).args[4]).toEqual({"include-path": "./test/data/client_src/sass", "relative-urls": true, "source-map": undefined});
        //     expect(warhorse._execute.getCall(0).args[5]).toEqual({"dst": "./test/data/client_dist/css/index.css", "include": "./test/data/client_src/sass", isSilent: true, "src": "./test/data/client_src/sass/index.scss"});
        //
        //     // Clean-up
        //     shell.rm(options.dst);
        // });
        //
        //
        // //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // // TASK: POSTPROCESS
        //
        // // SINGLE-FILE OUTPUT
        // it("should be able to resolve configurations for postprocess (single-single): CSS", function() {
        //
        //     // Setup
        //     let options = {
        //         src: "./test/data/client_src/css/index.css",
        //         dst: "./test/data/client_dist/css/index.css",
        //         use: "autoprefixer",
        //         isSilent: true
        //     };
        //
        //     // Execute
        //     warhorse.postprocess("css", options);
        //
        //     // Evaluate
        //     expect(warhorse._execute.callCount).toBe(1);
        //     expect(warhorse._execute.getCall(0).args[0]).toBe(process.cwd());
        //     expect(warhorse._execute.getCall(0).args[1]).toBe("./node_modules/.bin/postcss");
        //     expect(warhorse._execute.getCall(0).args[2]).toBe(process.cwd());
        //     expect(warhorse._execute.getCall(0).args[3]).toEqual(["./test/data/client_src/css/index.css"]);
        //     expect(warhorse._execute.getCall(0).args[4]).toEqual({"map": undefined, "output": "./test/data/client_dist/css/index.css", "replace": true});
        //     expect(warhorse._execute.getCall(0).args[5]).toEqual({"dst": "./test/data/client_dist/css/index.css", isSilent: true, "src": "./test/data/client_src/css/index.css", "use": "autoprefixer"});
        //
        //     // Clean-up
        //     shell.rm(options.dst);
        // });
        //
        //
        // // SINGLE-FILE OUTPUT
        // it("should be able to resolve configurations for postprocess (multiple-multiple): CSS", function() {
        //
        //     // Setup
        //     let options = {
        //         src: "./test/data/client_src/css",
        //         dst: "./test/data/client_dist/css",
        //         use: "autoprefixer",
        //         isSilent: true
        //     };
        //
        //     // Execute
        //     warhorse.postprocess("css", options);
        //
        //     // Evaluate
        //     expect(warhorse._execute.callCount).toBe(1);
        //     expect(warhorse._execute.getCall(0).args[0]).toBe(process.cwd());
        //     expect(warhorse._execute.getCall(0).args[1]).toBe("./node_modules/.bin/postcss");
        //     expect(warhorse._execute.getCall(0).args[2]).toBe(process.cwd());
        //     expect(warhorse._execute.getCall(0).args[3]).toEqual(["./test/data/client_src/css"]);
        //     expect(warhorse._execute.getCall(0).args[4]).toEqual({"dir": "./test/data/client_dist/css", "map": undefined, "replace": true});
        //     expect(warhorse._execute.getCall(0).args[5]).toEqual({"dst": "./test/data/client_dist/css", isSilent: true, "src": "./test/data/client_src/css", "use": "autoprefixer"});
        //
        //     // Clean-up
        //     shell.rm("./test/data/client_dist/css/*.css");
        // });
    });



    // //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // // TASKS
    // //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // describe("Tasks", function() {
    //
    //     //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //     // TASK: BUNDLE
    //     it("should be able to bundle JS code", function() {
    //
    //         // Preparation
    //         const options = {
    //             debug: false, //i.e. turn off source-mapping.
    //             src: "./test/data/client_src/js/index.js",
    //             dst: "./test/data/client_dist/js/index.js",
    //             isSilent: true
    //         };
    //
    //         // Test
    //         warhorse.bundle("js", options);
    //
    //         // Evaluation
    //         expect(fs.existsSync(options.dst)).toBe(true);
    //
    //         let fileContent = readSync(options.dst);
    //         shell.rm(options.dst); // Clean-up immediately after read and before expect - to avoid leaving debris.
    //
    //         expect(fileContent.toString()).toMatchSnapshot();
    //
    //     });
    //
    //
    //     //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //     // TASK: COMPRESS
    //
    //     it("should be able to compress JS code", function() {
    //
    //         // Preparation
    //         const options = {
    //             src: "./test/data/client_src/js/index.js",
    //             dst: "./test/data/client_dist/js/index.js.tar.gz",
    //             isSilent: true
    //         };
    //
    //         // Test
    //         warhorse.compress("js", options);
    //
    //         // Evaluation
    //         expect(fs.existsSync(options.dst)).toBe(true);
    //
    //         //let fileContent = readSync(options.dst);
    //         shell.rm(options.dst); // Clean-up immediately after read and before expect - to avoid leaving debris.
    //
    //         // // TODO - Output is too variable to use these - need better option
    //         // expect(fileContent.length).toBeGreaterThan(205);
    //         // expect(fileContent.length).toBeLessThan(225);
    //
    //     });
    //
    //     it("should be able to compress CSS code", function() {
    //
    //         // Preparation
    //         const options = {
    //             src: "./test/data/client_src/css/index.css",
    //             dst: "./test/data/client_dist/css/index.css.tar.gz",
    //             isSilent: true
    //         };
    //
    //         // Test
    //         warhorse.compress("css", options);
    //
    //         // Evaluation
    //         expect(fs.existsSync(options.dst)).toBe(true);
    //
    //         //let fileContent = readSync(options.dst);
    //         deleteSync(options.dst); // Clean-up immediately after read and before expect - to avoid leaving debris.
    //
    //         // // TODO - Output is too variable to use these - need better option
    //         // expect(fileContent.length).toBeGreaterThan(840);
    //         // expect(fileContent.length).toBeLessThan(870);
    //
    //     });
    //
    //     //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //     // TASK: COPY
    //
    //     it("should be able to copy a text file", function() {
    //
    //         // Preparation
    //         const options = {
    //             src: "./test/data/client_src/css/index.css",
    //             dst: "./test/data/client_dist/css/index.css",
    //             isSilent: true
    //         };
    //
    //         // Test
    //         warhorse.copy("text", options);
    //
    //         // Evaluation
    //         expect(fs.existsSync(options.dst)).toBe(true);
    //
    //         let fileContentSrc = readSync(path.resolve(options.src)).toString();
    //         let fileContentDst = readSync(path.resolve(options.dst)).toString();
    //         deleteSync(options.dst); // Clean-up immediately after read and before expect - to avoid leaving debris.
    //         expect(fileContentDst).toBe(fileContentSrc);
    //
    //     });
    //
    //     //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //     // TASK: DOCUMENT
    //     //TODO - unit test: lint
    //
    //     //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //     // TASK: LINT
    //     //TODO - unit test: lint
    //
    //     //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //     // TASK: MINIFY
    //     it("should be able to minify JS code", function() {
    //
    //         // Preparation
    //         const options = {
    //             debug: false, //i.e. turn off source-mapping.
    //             src: "./test/data/client_src/js/index.js",
    //             dst: "./test/data/client_dist/js/index.min.js",
    //             isSilent: true
    //         };
    //
    //         // Test
    //         warhorse.minify("js", options);
    //
    //         // Evaluation
    //         let fileContent = readSync(options.dst);
    //         deleteSync(options.dst); // Clean-up immediately after read and before expect - to avoid leaving debris.
    //         expect(fileContent.toString()).toMatchSnapshot();
    //     });
    //
    //     it("should be able to minify CSS code", function() {
    //
    //         // Preparation
    //         const options = {
    //             debug: false, //i.e. turn off source-mapping.
    //             src: "./test/data/client_src/css/index.css",
    //             dst: "./test/data/client_dist/css/index.min.css",
    //             isSilent: true
    //         };
    //
    //         // Test
    //         warhorse.minify("css", options);
    //
    //         // Evaluation
    //         let fileContent = readSync(options.dst);
    //         deleteSync(options.dst); // Clean-up immediately after read and before expect - to avoid leaving debris.
    //         expect(fileContent.toString()).toMatchSnapshot();
    //
    //     });
    //
    //     //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //     // TASK: PREPROCESS
    //     //TODO - unit test: preprocess
    //
    //     //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //     // TASK: POSTPROCESS
    //     //TODO - unit test: postprocess
    //
    //     //
    //     // //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //     // // TODO - Implement asset packing tests
    //     // // it("should be able to pack a GIF", function() {
    //     // //     warhorse.file = JSON.parse(JSON.stringify(FILE_DUMMY_GIF));
    //     // //     warhorse.packGIF({});
    //     // //     expect(warhorse.file.content).toMatchSnapshot();
    //     // // });
    //     // //
    //     // // it("should be able to pack a JPG", function() {
    //     // //     warhorse.file = JSON.parse(JSON.stringify(FILE_DUMMY_JPG));
    //     // //     warhorse.packJPG({});
    //     // //     expect(warhorse.file.content).toMatchSnapshot();
    //     // // });
    //     // //
    //     // // it("should be able to pack a PNG", function() {
    //     // //     warhorse.file = JSON.parse(JSON.stringify(FILE_DUMMY_GIF));
    //     // //     warhorse.packGIF({});
    //     // //     expect(warhorse.file.content).toMatchSnapshot();
    //     // // });
    //     // //
    //     // // it("should be able to pack a SVG", function() {
    //     // //     warhorse.file = JSON.parse(JSON.stringify(FILE_DUMMY_SVG));
    //     // //     warhorse.packSVG({});
    //     // //     expect(warhorse.file.content).toMatchSnapshot();
    //     // // });
    //
    //
    // });

});

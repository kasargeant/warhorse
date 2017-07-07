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

    describe("User-configured commands", function() {


        beforeEach(function() {
            sinon.stub(warhorse, "bundle");
            sinon.stub(warhorse, "clean");
            sinon.stub(warhorse, "compress");
            sinon.stub(warhorse, "copy");
            sinon.stub(warhorse, "document");
            // sinon.stub(warhorse, "fix");
            sinon.stub(warhorse, "lint");
            sinon.stub(warhorse, "minify");
            sinon.stub(warhorse, "test");
            sinon.stub(warhorse, "version");
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

        it("should have a full set of tasks to support the command: build", function() {
            warhorse.command(["distribute", "js"]);
            expect(warhorse.lint.callCount).toBe(2);
            expect(warhorse.test.callCount).toBe(1);
            expect(warhorse.bundle.callCount).toBe(1);
            // expect(warhorse.minify.callCount).toBe(1);
            // expect(warhorse.compress.callCount).toBe(1);
            // expect(warhorse.document.callCount).toBe(1);
        });

        // it("should have a full set of tasks to support the command: build", function() {
        //     warhorse.command(["distribute", "css"]);
        //     expect(warhorse.postprocess.callCount).toBe(1);
        //     expect(warhorse.minify.callCount).toBe(1);
        //     expect(warhorse.compress.callCount).toBe(1);
        // });
        //
        // "js": [
        //     {idn: "lint:js:quality", src: ["./test/data/client_src/js", ""], dst: null},
        //     {idn: "lint:js:style", src: ["./test/data/client_src/js", ""], dst: null},
        //     {idn: "test:js", src: ["./test/js", ""], dst: null},
        //     {idn: "bundle:js", src: ["./test/data/client_src", "**/index.js"], dst: ["./test/data/client_dist", ".js"]},
        //     {idn: "minify:js", src: ["./test/data/client_dist/**/*.js"], dst: ["./test/data/client_dist", ".min.js"]},
        //     {idn: "compress:js", src: ["./test/data/client_dist/**/*.min.js"], dst: ["./test/data/client_dist", ".min.js.tar.gz"]},
        //     // {idn: "document:js", src: ["./test/data/client_src/js"], dst: ["./docs/api"]},
        // ],
        //     "css": [
        //     {idn: "copy:css", src: ["./test/data/client_src/css", "**/*.css"], dst: ["./test/data/client_dist/css", ".css"]},
        //     {idn: "postprocess:css", src: ["./test/data/client_dist/css", "**/*.css"], dst: ["./test/data/client_dist/css", ".css"]},
        //     {idn: "minify:css", src: ["./test/data/client_dist/css", "**/*.css"], dst: ["./test/data/client_dist/css", ".min.css"]},
        //     {idn: "compress:css", src: ["./test/data/client_dist/css", "**/*.min.css"], dst: ["./test/data/client_dist/css", ".min.css.tar.gz"]},
        // ],
        //     "html": [
        //     {idn: "minify:html", src: ["./test/data/client_src"], dst: ["./test/data/client_dist", ".html"]},
        //     {idn: "compress:html", src: ["./test/data/client_dist"], dst: ["./test/data/client_dist", ".html.tar.gz"]}
        // ],
        //     "less": [
        //     {idn: "preprocess:less", src: ["./test/data/client_src/less"], dst: ["./test/data/client_dist/css", ".css"]},
        //     {idn: "postprocess:css", src: ["./test/data/client_dist/css", "**/*.css"], dst: ["./test/data/client_dist/css", ".css"]},
        //     {idn: "minify:css", src: ["./test/data/client_dist/css"], dst: ["./test/data/client_dist/css", ".min.css"]},
        //     {idn: "compress:css", src: ["./test/data/client_dist/css", "**/*.min.css"], dst: ["./test/data/client_dist/css", ".min.css.tar.gz"]},
        // ],
        //     "sass": [
        //     {idn: "preprocess:sass", src: ["./test/data/client_src/sass"], dst: ["./test/data/client_dist/css", ".css"]},
        //     {idn: "postprocess:css", src: ["./test/data/client_dist/css", "**/*.css"], dst: ["./test/data/client_dist/css", ".css"]},
        //     {idn: "minify:css", src: ["./test/data/client_dist/css"], dst: ["./test/data/client_dist/css", ".min.css"]},
        //     {idn: "compress:css", src: ["./test/data/client_dist/css", "**/*.min.css"], dst: ["./test/data/client_dist/css", ".min.css.tar.gz"]},
        // ],
        //     "hbs": [
        //     {idn: "preprocess:hbs", src: ["./test/data/client_src/js/templates"], dst: ["./test/data/client_dist/js/templates", ".hbs.js"]},
        // ],
        //     "gif": [
        //     {idn: "compress:gif", src: ["./test/data/client_src/img", "**/*.gif"], dst: ["./test/data/client_dist/img", ".gif"]},
        // ],
        //     "jpg": [
        //     {idn: "compress:jpg", src: ["./test/data/client_src/img", "**/*.jpg"], dst: ["./test/data/client_dist/img", ".jpg"]},
        // ],
        //     "png": [
        //     {idn: "compress:png", src: ["./test/data/client_src/img", "**/*.png"], dst: ["./test/data/client_dist/img", ".png"]},
        // ],
        //     "svg": [
        //     {idn: "compress:svg", src: ["./test/data/client_src/img", "**/*.svg"], dst: ["./test/data/client_dist/img", ".svg"]},
        // ],
        //     "ico": [
        //     {idn: "copy:ico", src: ["./test/data/client_src/img", "**/*.ico"], dst: ["./test/data/client_dist/img", ".svg"]},









        // it("should have a full set of tasks to support the command: clean", function() {
        //     cmds.clean();
        //     expect(warhorse.clean.callCount).toBe(1);
        // });
        //
        // it("should have a full set of tasks to support the command: distribute", function() {
        //     cmds.distribute();
        //     expect(warhorse.execute.callCount).toBe(6);
        // });
        //
        // it("should have a full set of tasks to support the command: document", function() {
        //     cmds.document();
        //     expect(warhorse.document.callCount).toBe(1);
        // });
        //
        // // it("should have a full set of tasks to support the command: fix", function() {
        // //     cmds.fix();
        // //     expect(warhorse.fix.callCount).toBe(1);
        // // });
        //
        // it("should have a full set of tasks to support the command: lint", function() {
        //     cmds.lint();
        //     expect(warhorse.lint.callCount).toBe(2);
        // });
        //
        // it("should have a full set of tasks to support the command: pack", function() {
        //     cmds.pack();
        //     expect(warhorse.compress.callCount).toBe(4);
        //     expect(warhorse.copy.callCount).toBe(1);
        // });
        //
        // it("should have a full set of tasks to support the command: fix", function() {
        //     cmds.process();
        //     expect(warhorse.preprocess.callCount).toBe(1);
        //     expect(warhorse.postprocess.callCount).toBe(1);
        //     expect(warhorse.minify.callCount).toBe(1);
        // });
        //
        // // it("should have a full set of tasks to support the command: fix", function() {
        // //     cmds.publish();
        // //     expect(warhorse.publish.callCount).toBe(0); //TODO - Implement Publish unit test.
        // // });
        //
        // it("should have a full set of tasks to support the command: distribute", function() {
        //     cmds.test();
        //     expect(warhorse.test.callCount).toBe(1);
        // });

    });


});

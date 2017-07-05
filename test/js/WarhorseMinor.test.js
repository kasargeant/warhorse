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

    describe("Task errors", function() {
        it("should throw an error when a task is given an invalid data type: bundle", function() {

        });
    });


    describe("Task errors", function() {
        it("should throw an error when a task is given an invalid data type: bundle", function() {
            expect(function() {warhorse.bundle("SOME_INVALID_TYPE", {isSilent: true});}).toThrow();
            expect(function() {warhorse.compress("SOME_INVALID_TYPE", {isSilent: true});}).toThrow();
            // expect(function() {warhorse.copy("SOME_INVALID_TYPE", {isSilent: true});}).toThrow(); // type is ignored by copy()
            expect(function() {warhorse.document("SOME_INVALID_TYPE", {isSilent: true});}).toThrow();
            expect(function() {warhorse.lint("SOME_INVALID_TYPE", {isSilent: true});}).toThrow();
            expect(function() {warhorse.minify("SOME_INVALID_TYPE", {isSilent: true});}).toThrow();
            expect(function() {warhorse.preprocess("SOME_INVALID_TYPE", {isSilent: true});}).toThrow();
            expect(function() {warhorse.postprocess("SOME_INVALID_TYPE", {isSilent: true});}).toThrow();
            expect(function() {warhorse.publish("SOME_INVALID_TYPE", {isSilent: true});}).toThrow();
            expect(function() {warhorse.test("SOME_INVALID_TYPE", {isSilent: true});}).toThrow();
            expect(function() {warhorse.version("SOME_INVALID_TYPE", {isSilent: true});}).toThrow();
        });

    });

});

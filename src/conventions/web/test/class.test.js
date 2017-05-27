/**
 * @file class.test.js
 * @description Warhorse unit test example.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const classExample = require.requireActual("../src/js/Square"); // The module entry point.

// Tests
describe("Class: Square", function() {

    it("should exist", function() {
        expect(classExample).toBeDefined();
    });

    it("should be able to return it's name", function() {
        expect(classExample.name).toBe("square");
    });

    it("should be able calculate area", function() {
        expect(classExample.area).toBe(1);
    });
});

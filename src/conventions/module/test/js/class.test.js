/**
 * @file class.test.js
 * @description Warhorse unit test example.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Square = require.requireActual("../../src/js/Square"); // The module entry point.

const square = new Square();

// Tests
describe("Class: Square", function() {

    it("should exist", function() {
        expect(square).toBeDefined();
    });

    it("should be able to return it's name", function() {
        expect(square.name).toBe("Square");
    });

    it("should be able calculate area", function() {
        expect(square.area).toBe(100);
    });
});

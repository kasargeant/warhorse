/**
 * @file module.test.js
 * @description Warhorse unit test example.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const moduleExample = require.requireActual("../../src/index"); // The module entry point.

// Tests
describe("Module: Example", function() {

    it("should exist", function() {
        expect(moduleExample).toBeDefined();
    });

});

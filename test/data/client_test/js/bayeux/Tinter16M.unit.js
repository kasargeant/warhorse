/**
 * @file Tinter16M.test.js
 * @description Unit tests for the Tinter Class (Node/16M+ truecolor [using CSS4 Named colors]).
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE.txt file included in this distribution.
 */

"use strict";

// Import Bayeux and extract selected vocabulary.
const Bayeux = require("bayeux");
const {given, test, unit} = Bayeux.TDD();

// Unit(s)
process.env.TINTER_TEST = "16M";
const Tinter = require("tinter");

// Constants
const DUMMY_STRING = "Dummy String";

// Unit test
unit("Tinter (Node/16M+ truecolor)", function() {

    test("single style", function(done) {

        given("reset").expect(Tinter.reset(DUMMY_STRING)).toEqual(`\x1b[0m${DUMMY_STRING}\x1b[0m`);
        given("plain").expect(Tinter.plain(DUMMY_STRING)).toEqual(`\x1b[0m${DUMMY_STRING}\x1b[0m`);
        given("bright").expect(Tinter.bright(DUMMY_STRING)).toEqual(`\x1b[1m${DUMMY_STRING}\x1b[0m`);
        given("dim").expect(Tinter.dim(DUMMY_STRING)).toEqual(`\x1b[2m${DUMMY_STRING}\x1b[0m`);
        given("italic").expect(Tinter.italic(DUMMY_STRING)).toEqual(`\x1b[3m${DUMMY_STRING}\x1b[0m`);
        given("underline").expect(Tinter.underline(DUMMY_STRING)).toEqual(`\x1b[4m${DUMMY_STRING}\x1b[0m`);
        given("blink").expect(Tinter.blink(DUMMY_STRING)).toEqual(`\x1b[5m${DUMMY_STRING}\x1b[0m`);
        given("blink2").expect(Tinter.blink2(DUMMY_STRING)).toEqual(`\x1b[6m${DUMMY_STRING}\x1b[0m`);
        given("inverse").expect(Tinter.inverse(DUMMY_STRING)).toEqual(`\x1b[7m${DUMMY_STRING}\x1b[0m`);
        given("hidden").expect(Tinter.hidden(DUMMY_STRING)).toEqual(`\x1b[8m${DUMMY_STRING}\x1b[0m`);

        done(); // Indicate the test is done.
    });

    test("single foreground color", function(done) {

        given("black.").expect(Tinter.black(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[38;2;0;0;0m${DUMMY_STRING}\x1b[0m`);
        given("red.").expect(Tinter.red(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[38;2;255;0;0m${DUMMY_STRING}\x1b[0m`);
        given("green.").expect(Tinter.green(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[38;2;0;128;0m${DUMMY_STRING}\x1b[0m`);
        given("yellow.").expect(Tinter.yellow(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[38;2;255;255;0m${DUMMY_STRING}\x1b[0m`);
        given("blue.").expect(Tinter.blue(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[38;2;0;0;255m${DUMMY_STRING}\x1b[0m`);
        given("magenta.").expect(Tinter.magenta(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[38;2;255;0;255m${DUMMY_STRING}\x1b[0m`);
        given("cyan.").expect(Tinter.cyan(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[38;2;0;255;255m${DUMMY_STRING}\x1b[0m`);
        given("white.").expect(Tinter.white(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[38;2;255;255;255m${DUMMY_STRING}\x1b[0m`);
        given("default.").expect(Tinter.default(DUMMY_STRING)).toEqual(`\x1b[39m${DUMMY_STRING}`);

        done(); // Indicate the test is done.
    });

    test("single background color", function(done) {

        given("blackBg.").expect(Tinter.blackBg(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[48;2;0;0;0m${DUMMY_STRING}\x1b[0m`);
        given("redBg.").expect(Tinter.redBg(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[48;2;255;0;0m${DUMMY_STRING}\x1b[0m`);
        given("greenBg.").expect(Tinter.greenBg(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[48;2;0;128;0m${DUMMY_STRING}\x1b[0m`);
        given("yellowBg.").expect(Tinter.yellowBg(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[48;2;255;255;0m${DUMMY_STRING}\x1b[0m`);
        given("blueBg.").expect(Tinter.blueBg(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[48;2;0;0;255m${DUMMY_STRING}\x1b[0m`);
        given("magentaBg.").expect(Tinter.magentaBg(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[48;2;255;0;255m${DUMMY_STRING}\x1b[0m`);
        given("cyanBg.").expect(Tinter.cyanBg(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[48;2;0;255;255m${DUMMY_STRING}\x1b[0m`);
        given("whiteBg.").expect(Tinter.whiteBg(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[48;2;255;255;255m${DUMMY_STRING}\x1b[0m`);
        given("defaultBg.").expect(Tinter.defaultBg(DUMMY_STRING)).toEqual(`\x1b[49m${DUMMY_STRING}`);

        done(); // Indicate the test is done.
    });

    test("ANSI color naming", function(done) {
        given("Black").expect(Tinter.Black(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[38;2;0;0;0m${DUMMY_STRING}\x1b[0m`);
        done(); // Indicate the test is done.
    });

    test("CSS4 color naming", function(done) {
        given("rebeccapurple").expect(Tinter.rebeccapurple(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[38;2;102;51;153m${DUMMY_STRING}\x1b[0m`);
        done(); // Indicate the test is done.
    });

    test("composite colors and style", function(done) {

        given("foreground color, background color and style").expect(Tinter.style(DUMMY_STRING, "yellow", "blue", "italic")).toEqual(`\x1b[3m\x1b[1m\x1b[48;2;0;0;255m\x1b[1m\x1b[38;2;255;255;0m${DUMMY_STRING}\x1b[0m`);
        // equal(Tinter.rgb(DUMMY_STRING, [255,255,127], [192, 0, 55], "underline"), `\x1b[4m\x1b[1m\x1b[48;2;192;0;55m\x1b[1m\x1b[38;2;255;255;127m${DUMMY_STRING}\x1b[0m`, "it should degrade a truecolor to 16-color appropriately.");
        done(); // Indicate the test has finished
    });

    test("Truecolor functions", function(done) {

        // private method
        given("a string, RGB foreground and background colors, and a style (All params)").expect(Tinter._styleTruecolor(DUMMY_STRING, [255,255,127], [192, 0, 55], "underline")).toEqual(`\x1b[4m\x1b[1m\x1b[48;2;192;0;55m\x1b[1m\x1b[38;2;255;255;127m${DUMMY_STRING}\x1b[0m`);
        given("a string, RGB foreground and background colors (3 params)").expect(Tinter._styleTruecolor(DUMMY_STRING, [255,255,127], [192, 0, 55])).toEqual(`\x1b[1m\x1b[48;2;192;0;55m\x1b[1m\x1b[38;2;255;255;127m${DUMMY_STRING}\x1b[0m`);
        given("a string, RGB foreground color (2 params)").expect(Tinter._styleTruecolor(DUMMY_STRING, [255,255,127])).toEqual(`\x1b[1m\x1b[38;2;255;255;127m${DUMMY_STRING}\x1b[0m`);
        given("a string (1 param)").expect(Tinter._styleTruecolor(DUMMY_STRING)).toEqual(`${DUMMY_STRING}\x1b[0m`);

        // public method
        given("a string, RGB foreground and background colors, and a style (All params)").expect(Tinter.rgb(DUMMY_STRING, [255,255,127], [192, 0, 55], "underline"), `\x1b[4m\x1b[1m\x1b[48;2;192;0;55m\x1b[1m\x1b[38;2;255;255;127m${DUMMY_STRING}\x1b[0m`);
        given("a string, RGB foreground and background colors (3 params)").expect(Tinter.rgb(DUMMY_STRING, [255,255,127], [192, 0, 55]), `\x1b[0m\x1b[1m\x1b[48;2;192;0;55m\x1b[1m\x1b[38;2;255;255;127m${DUMMY_STRING}\x1b[0m`);
        given("a string, RGB foreground color (2 params)").expect(Tinter.rgb(DUMMY_STRING, [255,255,127]), `\x1b[0m\x1b[1m\x1b[48;2;0;0;0m\x1b[1m\x1b[38;2;255;255;127m${DUMMY_STRING}\x1b[0m`);
        given("a string (1 param)").expect(Tinter.rgb(DUMMY_STRING), `\x1b[0m\x1b[1m\x1b[48;2;0;0;0m\x1b[1m\x1b[38;2;255;255;255m${DUMMY_STRING}\x1b[0m`);

        done(); // Indicate the test is done.
    });

    test("private degrading from RGB values to named colors", function(done) {

        given("an RGB value close to black.").expect(Tinter._nearest16([10, 127, 0])).toEqual("black");
        given("an RGB value close to red.").expect(Tinter._nearest16([200, 10, 21])).toEqual("red");
        given("an RGB value close to green.").expect(Tinter._nearest16([0, 128, 0])).toEqual("green");
        given("an RGB value close to blue.").expect(Tinter._nearest16([2, 0, 200])).toEqual("blue");
        given("an RGB value close to yellow.").expect(Tinter._nearest16([200, 128, 0])).toEqual("yellow");
        given("an RGB value close to magenta.").expect(Tinter._nearest16([200, 10, 128])).toEqual("magenta");
        given("an RGB value close to cyan.").expect(Tinter._nearest16([0, 200, 128])).toEqual("cyan");
        given("an RGB value close to white.").expect(Tinter._nearest16([175, 200, 128])).toEqual("white");

        done(); // Indicate the test is done.
    });

});

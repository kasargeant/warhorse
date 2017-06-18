/**
 * @file Tinter16.test.js
 * @description Unit tests for the Tinter Class (Node/16-color ANSI).
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE.txt file included in this distribution.
 */

"use strict";


// Imports
const test = require("tape").test;
let stream = test.createStream({objectMode: true}).on("data", function(row) {
    console.log(JSON.stringify(row));
});

process.env.TINTER_TEST = "16";
const Tinter = require("tinter");


// Constants
const DUMMY_STRING = "Dummy String";

// Tests
test("Standard sanity check.", function(is) {

    // Assert - it should have assigned the right height.
    is.equal(true, true, "it should be equal.");

    // Assert - it should have assigned the right width.
    is.notEqual(true, false, "it should be not equal.");

    is.end(); // Indicate the test has finished
});

test("Class: Tinter (Node/16-color ANSI mode)", function(is) {

    test("Style functions", function(is) {

        // Assert - it should be able mark a string as reset.
        is.equal(Tinter.reset(DUMMY_STRING), `\x1b[0m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as reset.");

        // Assert - it should be able mark a string as plain.
        is.equal(Tinter.plain(DUMMY_STRING), `\x1b[0m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as plain.");

        // Assert - it should be able mark a string as bright.
        is.equal(Tinter.bright(DUMMY_STRING), `\x1b[1m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as bright.");

        // Assert - it should be able mark a string as dim.
        is.equal(Tinter.dim(DUMMY_STRING), `\x1b[2m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as dim.");

        // Assert - it should be able mark a string as italic.
        is.equal(Tinter.italic(DUMMY_STRING), `\x1b[3m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as italic.");

        // Assert - it should be able mark a string as underline.
        is.equal(Tinter.underline(DUMMY_STRING), `\x1b[4m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as underline.");

        // Assert - it should be able mark a string as slow blink.
        is.equal(Tinter.blink(DUMMY_STRING), `\x1b[5m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as slow blink.");

        // Assert - it should be able mark a string as rapid blink.
        is.equal(Tinter.blink2(DUMMY_STRING), `\x1b[6m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as rapid blink.");

        // Assert - it should be able mark a string as rapid inverse.
        is.equal(Tinter.inverse(DUMMY_STRING), `\x1b[7m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as inverse.");

        // Assert - it should be able mark a string as rapid hidden.
        is.equal(Tinter.hidden(DUMMY_STRING), `\x1b[8m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as hidden.");

        is.end(); // Indicate the test has finished
    });

    test("Colorization functions (foreground)", function(is) {

        // Assert - it should be able mark a string as black.
        is.equal(Tinter.black(DUMMY_STRING), `\x1b[1m\x1b[30m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as black.");

        // Assert - it should be able mark a string as red.
        is.equal(Tinter.red(DUMMY_STRING), `\x1b[1m\x1b[91m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as red.");

        // Assert - it should be able mark a string as green.
        is.equal(Tinter.green(DUMMY_STRING), `\x1b[1m\x1b[32m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as green.");

        // Assert - it should be able mark a string as yellow.
        is.equal(Tinter.yellow(DUMMY_STRING), `\x1b[1m\x1b[93m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as yellow.");

        // Assert - it should be able mark a string as blue.
        is.equal(Tinter.blue(DUMMY_STRING), `\x1b[1m\x1b[94m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as blue.");

        // Assert - it should be able mark a string as magenta.
        is.equal(Tinter.magenta(DUMMY_STRING), `\x1b[1m\x1b[95m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as magenta.");

        // Assert - it should be able mark a string as cyan.
        is.equal(Tinter.cyan(DUMMY_STRING), `\x1b[1m\x1b[96m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as cyan.");

        // Assert - it should be able mark a string as white.
        is.equal(Tinter.white(DUMMY_STRING), `\x1b[1m\x1b[97m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as white.");

        // Assert - it should be able mark a string as default.
        is.equal(Tinter.default(DUMMY_STRING), `\x1b[39m${DUMMY_STRING}`, "it should be able mark a string as default.");

        is.end(); // Indicate the test has finished
    });


    test("Colorization functions (background)", function(is) {

        // Assert - it should be able mark a string with a black background.
        is.equal(Tinter.blackBg(DUMMY_STRING), `\x1b[1m\x1b[40m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a black background.");

        // Assert - it should be able mark a string with a red background.
        is.equal(Tinter.redBg(DUMMY_STRING), `\x1b[1m\x1b[101m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a red background.");

        // Assert - it should be able mark a string with a green background.
        is.equal(Tinter.greenBg(DUMMY_STRING), `\x1b[1m\x1b[42m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a green background.");

        // Assert - it should be able mark a string with a yellow background.
        is.equal(Tinter.yellowBg(DUMMY_STRING), `\x1b[1m\x1b[103m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a yellow background.");

        // Assert - it should be able mark a string with a blue background.
        is.equal(Tinter.blueBg(DUMMY_STRING), `\x1b[1m\x1b[104m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a blue background.");

        // Assert - it should be able mark a string with a magenta background.
        is.equal(Tinter.magentaBg(DUMMY_STRING), `\x1b[1m\x1b[105m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a magenta background.");

        // Assert - it should be able mark a string with a cyan background.
        is.equal(Tinter.cyanBg(DUMMY_STRING), `\x1b[1m\x1b[106m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a cyan background.");

        // Assert - it should be able mark a string with a white background.
        is.equal(Tinter.whiteBg(DUMMY_STRING), `\x1b[1m\x1b[107m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a white background.");

        // Assert - it should be able mark a string with a default background.
        is.equal(Tinter.defaultBg(DUMMY_STRING), `\x1b[49m${DUMMY_STRING}`, "it should be able mark a string with a default background..");

        is.end(); // Indicate the test has finished
    });

    test("Colorization functions (composite)", function(is) {

        // Assert - it should be able mark a string with overlapping characteristics.
        is.equal(Tinter.style(DUMMY_STRING, "yellow", "blue", "italic"), `\x1b[3m\x1b[1m\x1b[104m\x1b[1m\x1b[93m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with overlapping characteristics.");

        // Assert - it should degrade a truecolor to 16-color appropriately.
        // is.equal(Tinter.rgb(DUMMY_STRING, [255,255,127], [192, 0, 55], "underline"), `\x1b[4m\x1b[1m\x1b[101m\x1b[1m\x1b[93m${DUMMY_STRING}\x1b[0m`, "it should degrade a truecolor to 16-color appropriately.");

        // Assert - it should correctly support ANSI named colors.
        is.equal(Tinter.Black(DUMMY_STRING), `\x1b[1m\x1b[30m${DUMMY_STRING}\x1b[0m`, "it should correctly support ANSI named colors.");

        // Assert - it should correctly support CSS4 named colors.
        is.equal(Tinter.rebeccapurple(DUMMY_STRING), `\x1b[1m\x1b[34m${DUMMY_STRING}\x1b[0m`, "it should correctly support CSS4 named colors.");

        is.end(); // Indicate the test has finished
    });


    test("Truecolor functions", function(is) {

        // Assert - it should degrade a truecolor RGB value to the correct named color - red.
        is.equal(Tinter._styleTruecolor(DUMMY_STRING, [255,255,127], [192, 0, 55], "underline"), `\x1b[4m\x1b[1m\x1b[48;2;192;0;55m\x1b[1m\x1b[38;2;255;255;127m${DUMMY_STRING}\x1b[0m`, "it should degrade a truecolor RGB value to the correct named color - red.");
        is.equal(Tinter._styleTruecolor(DUMMY_STRING, [255,255,127], [192, 0, 55]), `\x1b[1m\x1b[48;2;192;0;55m\x1b[1m\x1b[38;2;255;255;127m${DUMMY_STRING}\x1b[0m`, "it should degrade a truecolor RGB value to the correct named color - red.");
        is.equal(Tinter._styleTruecolor(DUMMY_STRING, [255,255,127]), `\x1b[1m\x1b[38;2;255;255;127m${DUMMY_STRING}\x1b[0m`, "it should degrade a truecolor RGB value to the correct named color - red.");
        is.equal(Tinter._styleTruecolor(DUMMY_STRING), `${DUMMY_STRING}\x1b[0m`, "it should degrade a truecolor RGB value to the correct named color - red.");


        // Assert - it should degrade a set of truecolor RGB values correctly.
        is.equal(Tinter._degrade(DUMMY_STRING, [200, 10, 21], [2, 0, 200], "italic"), `\x1b[3m\x1b[1m\x1b[104m\x1b[1m\x1b[91m${DUMMY_STRING}\x1b[0m`, "it should degrade a set of truecolor RGB values correctly.");


        is.end(); // Indicate the test has finished
    });

    test("Color degradation functions", function(is) {


        // Assert - it should degrade a truecolor RGB value to the correct named color - black.
        is.equal(Tinter._nearest16([10, 127, 0]), "black", "it should degrade a truecolor RGB value to the correct named color - black.");

        // Assert - it should degrade a truecolor RGB value to the correct named color - red.
        is.equal(Tinter._nearest16([200, 10, 21]), "red", "it should degrade a truecolor RGB value to the correct named color - red.");

        // Assert - it should degrade a truecolor RGB value to the correct named color - green.
        is.equal(Tinter._nearest16([0, 128, 0]), "green", "it should degrade a truecolor RGB value to the correct named color - green.");

        // Assert - it should degrade a truecolor RGB value to the correct named color - blue.
        is.equal(Tinter._nearest16([2, 0, 200]), "blue", "it should degrade a truecolor RGB value to the correct named color - blue.");


        // Assert - it should degrade a truecolor RGB value to the correct named color - yellow.
        is.equal(Tinter._nearest16([200, 128, 0]), "yellow", "it should degrade a truecolor RGB value to the correct named color - yellow.");

        // Assert - it should degrade a truecolor RGB value to the correct named color - magenta.
        is.equal(Tinter._nearest16([200, 10, 128]), "magenta", "it should degrade a truecolor RGB value to the correct named color - magenta.");

        // Assert - it should degrade a truecolor RGB value to the correct named color - cyan.
        is.equal(Tinter._nearest16([0, 200, 128]), "cyan", "it should degrade a truecolor RGB value to the correct named color - cyan.");

        // Assert - it should degrade a truecolor RGB value to the correct named color - white.
        is.equal(Tinter._nearest16([175, 200, 128]), "white", "it should degrade a truecolor RGB value to the correct named color - white.");


        //


        is.end(); // Indicate the test has finished
    });

    is.end(); // Indicate the test has finished
});

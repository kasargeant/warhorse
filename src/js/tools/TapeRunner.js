/**
 * @file TapeRunner.js
 * @description An TAPe test runner for Warhorse.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// {"type":"test","name":"timing test","id":0}
//
// {"id":0,"ok":true,"name":"should be equal","operator":"equal","objectPrintDepth":5,"actual":"function","expected":"function","test":0,"type":"assert"}
//
// {"id":1,"ok":false,"name":"should be equal","operator":"equal","objectPrintDepth":5,"actual":107,"expected":100,"error":{},"functionName":"Timeout._onTimeout",
//     "file":"/Users/kasargeant/dev/projects/warhorse/src/example_tape.js:10:11",
//     "line":10,
//     "column":"11",
//     "at":"Timeout._onTimeout (/Users/kasargeant/dev/projects/warhorse/src/example_tape.js:10:11)",
//     "test":0,
//     "type":"assert"}
//
// {"type":"end","test":0}

const tape = require("tape");
const path = require("path");

let stream = tape.createStream({objectMode: true});

let results = [];

let data = {
    name: "Untitled test",
    tests: []
};

stream.on("data", function(row) {
    switch(row.type) {
        case "test":
            data.id = row.id;
            data.name = row.name;
            break;
        case "assert":
            data.tests.push(row);
            break;
        case "end":
            results.push(data);
            data = {
                name: "Untitled test",
                tests: []
            };
            break;
        default:
            console.error(`Error: Unrecognised TAP message of type '${row.type}'.`);
    }
});

stream.on("end", function() {
    console.log(JSON.stringify(results, null, 2));
});

process.argv.slice(2).forEach(function(file) {
    require(path.resolve(file));
});

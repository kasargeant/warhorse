/**
 * @file index.js
 * @description Index and entry point for the Warhorse module.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Warhorse = require("./js/Warhorse");

// Runner
function run(moduleDirectory, workingDirectory, args, useDebug) {

    let userConfig = {};
    try {
        let userConfigPath = workingDirectory + "/.warhorse";
        userConfig = require(userConfigPath);
        console.log(`Using configuration from: ${userConfigPath}`);
        // console.log("LANG: " + userConfig.language);
    } catch(ex) {
    }

    const warhorse = new Warhorse(moduleDirectory, workingDirectory, userConfig, useDebug);
// let banner = ` _    _            _
// | |  | |          | |
// | |  | | __ _ _ __| |__   ___  _ __ ___  ___
// | |/\\| |/ _\` | '__| '_ \\ / _ \\| '__/ __|/ _ \\
// \\  /\\  / (_| | |  | | | | (_) | |  \\__ \\  __/
//  \\/  \\/ \\__,_|_|  |_| |_|\\___/|_|  |___/\\___|
//
// `;
// let banner = `
// I8,        8        ,8I                        88
// \`8b       d8b       d8'                        88
//  "8,     ,8"8,     ,8"                         88
//   Y8     8P Y8     8P  ,adPPYYba,  8b,dPPYba,  88,dPPYba,    ,adPPYba,   8b,dPPYba,  ,adPPYba,   ,adPPYba,
//   \`8b   d8' \`8b   d8'  ""     \`Y8  88P'   "Y8  88P'    "8a  a8"     "8a  88P'   "Y8  I8[    ""  a8P_____88
//    \`8a a8'   \`8a a8'   ,adPPPPP88  88          88       88  8b       d8  88           \`"Y8ba,   8PP"""""""
//     \`8a8'     \`8a8'    88,    ,88  88          88       88  "8a,   ,a8"  88          aa    ]8I  "8b,   ,aa
//      \`8'       \`8'     \`"8bbdP"Y8  88          88       88   \`"YbbdP"'   88          \`"YbbdP"'   \`"Ybbd8"'
//
// `;
// let banner = `
//  _  _  _             _
// (_)(_)(_)           | |
//  _  _  _ _____  ____| |__   ___   ____ ___ _____
// | || || (____ |/ ___)  _ \\ / _ \\ / ___)___) ___ |
// | || || / ___ | |   | | | | |_| | |  |___ | ____|
//  \\_____/\\_____|_|   |_| |_|\\___/|_|  (___/|_____)
//
// `;
let banner =
`\x1b[7m         ___ .______  .______  .___.__  ._______  .______  .________._______
.___    |   |:      \\ : __   \\ :   |  \\ : .___  \\ : __   \\ |    ___/: .____/
:   | /\\|   ||   .   ||  \\____||   :   || :   |  ||  \\____||___    \\| : _/\\ 
|   |/  :   ||   :   ||   :  \\ |   .   ||     :  ||   :  \\ |       /|   /  \\
|   /       ||___|   ||   |___\\|___|   | \\_. ___/ |   |___\\|__:___/ |_.: __/
|______/|___|    |___||___|        |___|   :/     |___|       :        :/   
        :                                  :                                
        :                                                                   \x1b[0m`;
    console.log();
    console.log();
    // console.log("%".repeat(77));
    // console.log("---- --- - -- --- - - ------ - ------ - - -- -- - - - - -- --- ---- -- - - - --");
    // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log(banner);
    console.log();
    console.log("Copyright 2017 Kyle Alexis Sargeant. Licensed & distributed under the AGPLv3");

    // console.log("Warhorse CLI location: " + warhorse.moduleDirectory);
    console.log();
    warhorse.command(args, userConfig);
    console.log();
    console.log();
}

// Exports
module.exports = run;

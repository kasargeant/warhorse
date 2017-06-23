/**
 * @file GitHelper.js
 * @description An NPM helper for Warhorse.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const child = require("child_process");
const path = require("path");

// Component
class CliHelper {

    static _compileCmdLineArgs(args) {
        // Compile the sequential (and flagless) args
        let cmdLineArgs = "";
        if(args !== undefined && args.constructor === Array) {
            for(let argc = 0; argc < args.length; argc++) {
                cmdLineArgs += " " + args[argc];
            }
        } else {
            cmdLineArgs = " " + args;
        }
        return cmdLineArgs.slice(1);
    }

    static _compileCmdLineArgsAsOptions(argOptions={}, options={}) {

        // Firstly flush undefined options the cheap way...
        argOptions = JSON.parse(JSON.stringify(argOptions)); // i.e. remove undefined keys.

        // Convert argOptions object to string
        let cmdLineOpts = "";
        let keyValDel = (options.useEqualsSign === true) ? "=" : " ";
        for(let key in argOptions) {
            let value = argOptions[key];
            if(value === false) {
                // We have a config without value - to be ignored
                // cmdLineOpts += "";
            } else if(value === true) {
                // We have a config without value - to be set
                cmdLineOpts += ` --${key}${keyValDel}`;
            } else {
                // We have config value
                cmdLineOpts += ` --${key}${keyValDel}${value}`;
            }
        }
        return cmdLineOpts.slice(1);
    }

    // e.g. compileCmdLine("node", [arg0..argN], {opt0: .., opt1: ...}, {other options}
    static _compileCmdLine(executable, args, argOptions, options) {
        // console.log("====================");
        // console.log(JSON.stringify(args));
        // console.log(JSON.stringify(argOptions));
        // console.log(JSON.stringify(options));

        let cmdLineArgs = this._compileCmdLineArgs(args);
        let cmdLineArgOptions = this._compileCmdLineArgsAsOptions(argOptions);
        return `${executable} ${cmdLineArgs} ${cmdLineArgOptions}`;
    }
    //
    // /**
    //  * Task 'wrapper' function (used exclusively in '_warhorse.js' file).  Wraps an action, or list of actions, to be followed by the named task.
    //  * @param {string} desc - Title or description of the task.
    //  * @param {string} name - Name of the task tool.
    //  * @param {Object} options - Options to further configure this task.
    //  * @param {string|Array} args - Argument(s) for this task.
    //  * @param {string} useOutput - Flag indicating that task should display any output returned by the task.
    //  * @param {boolean} useEqualsSign - Use '=' sign between configuration key-values.
    //  * @returns {Object} - Returns self for chaining.
    //  */
    // static execute(warhorseDirectory, relativeExecutablePath, workingDirectory, args=[], argOptions={}, options={debug: false, useOutput: "stdout", useEqualsSign: false}) {
    //
    //     if(workingDirectory !== process.cwd()) {
    //         try {
    //             process.chdir(path.resolve(workingDirectory));
    //             console.log("Changed working directory to: " + process.cwd());
    //         }
    //         catch(err) {
    //             throw err;
    //         }
    //     }
    //
    //     // Construct final cmdLine.
    //     let executablePath = path.resolve(warhorseDirectory, relativeExecutablePath);
    //     let cmdLine = this._compileCmdLine(executablePath, args, argOptions, options);
    //     if(options.debug) {console.log("Executing: " + cmdLine);}
    //     if(true) {console.log("Executing: " + cmdLine);}
    //
    //     let stdout = null; let stderr = null;
    //     try {
    //         stdout = child.execSync(cmdLine);
    //     } catch(ex) {
    //         //console.error(ex.message);
    //         stdout = ex.stdout;
    //         stderr = ex.stderr;
    //     }
    //
    //     if(stdout !== null) {
    //         let output = "";
    //         switch(options.useOutput) {
    //             case "silent":
    //                 // console.log(">> SILENT");
    //                 break;
    //             case "stdout":
    //                 console.log(stdout.toString());
    //                 break;
    //             case "jscs":
    //                 // console.log(">> JSCS");
    //                 output = JSON.parse(stdout.toString());
    //                 this._reportJSCS(output);
    //                 break;
    //             case "jshint":
    //                 // console.log(">> JSHINT");
    //                 output = JSON.parse(stdout.toString());
    //                 this._reportJSHint(output);
    //                 break;
    //             case "tape":
    //                 // console.log(">> TAPE");
    //                 this._reportTape(stdout.toString());
    //                 break;
    //             default:
    //                 // console.log(">> STDOUT");
    //                 console.warn(`Warning: Unrecognised useOutput format '${options.useOutput}'.  Falling back on stdout.`);
    //                 console.log(stdout.toString());
    //         }
    //     }
    //
    //     // Return self for chaining.
    //     return this;
    // }
}

// Exports
module.exports = CliHelper;

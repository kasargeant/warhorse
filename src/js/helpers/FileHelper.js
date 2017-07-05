/**
 * @file FileHelper.js
 * @description A file system helper for Warhorse.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const child = require("child_process");
const path = require("path");
const nsfw = require("nsfw");

const ACTIONS_LOOKUP = ["CREATED", "DELETED", "MODIFIED", "RENAMED"];

const FileHelper = {
    watch: function(workingDirectory) {

        let watcher;

        return nsfw(
            workingDirectory,
            function(events) {
                // handles other events
                for(let i = 0; i < events.length; i++) {
                    let event = events[i];
                    let fileExt = path.extname(event.file);
                    //console.log("EXT: ", fileExt);

                    if([".css", ".js", ".jsx", ".sass", ".scss", ".txt"].includes(fileExt)) {
                        console.log(`${ACTIONS_LOOKUP[event.action]}: ${path.resolve(event.directory, event.file)}`);
                    }

                    switch(fileExt) {
                        case ".css":
                            console.log("RUNNING: warhorse process");
                            child.execSync("warhorse process");
                            break;
                        case ".js":
                            console.log("RUNNING: warhorse build");
                            child.execSync("warhorse build");
                            break;
                        case ".sass":
                            console.log("RUNNING: warhorse process");
                            child.execSync("warhorse process");
                            break;
                        case ".scss":
                            console.log("RUNNING: warhorse process");
                            child.execSync("warhorse process");
                            break;
                        case ".txt":
                            console.log("Text file changed.");
                            break;
                        default:
                    }
                }
            },
            {
                debounceMS: 250,
                errorCallback(errors) {
                    //handle errors
                    console.log("ERRORS: " + JSON.stringify(errors));
                }
            })
            .then(function(watcher) {
                watcher = watcher;
                return watcher.start();
            })
            .then(function() {
                // we are now watching dir2 for events!
            })
            .then(function() {
                // setTimeout(function(){
                //
                //     // To stop watching
                //     watcher.stop();
                //
                // }, 20000);
            });
    }
};

// Exports
module.exports = FileHelper;

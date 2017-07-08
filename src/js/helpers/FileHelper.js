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

// const options = {
//     "./src/less": [".less", "process"],
//     "./src/sass": [".scss", "process"],
//     "./src/css": [".css", "process"],
//     "./src/js": [".js", "build"],
//     "./test/js": [".test.js", "test"]
// };
// const options2 = {
//     "less": ["./src/less", "process", "less"],
//     "sass": ["./src/sass", "process", "sass"],
//     "css": ["./src/css", "process", "css"],
//     "js": ["./src/js", "build", "js"],
//     "test.js": ["./test/js", "test", "js"]
// };

const spawn = child.spawn;

const FileHelper = {

    watchedTypes: [],
    pipelineType: "build",

    _spawn: function(cmd, args) {
        // NOTE: stdio: "pipe"... cannot use inherit here without terminating.
        const ls = spawn(cmd, args, {cwd: process.cwd(), stdio: "pipe", env: process.env});

        ls.stdout.on("data", (data) => {
            console.log(data.toString());
        });

        ls.stderr.on("data", (data) => {
            console.error(data.toString());
        });

        ls.on("close", (code) => {
            console.log(`Process exited with code ${code}.`);
        });
    },

    eventCallback: function(events) {
        // handles other events
        for(let i = 0; i < events.length; i++) {
            let event = events[i];

            let fileExt = path.extname(event.file);
            let fileType = "";
            if(fileExt.length > 1) {fileType = fileExt.slice(1);}
            console.log("EXT: ", fileExt);
            console.log("TYPE: ", fileType);

            // Is it a file type that we watch?
            if(this.watchedTypes.includes(fileType)) {

                let filePathAbsolute = path.resolve(event.directory, event.file);
                console.log(`${ACTIONS_LOOKUP[event.action]}: ${filePathAbsolute}`);

                let pathAbsolute = path.dirname(filePathAbsolute);

                let pathsWatched = this.config[fileType];
                if(pathsWatched !== undefined) {
                    for(let i = 0; i < pathsWatched.length; i++) {
                        let watchPathAbsolute = pathsWatched[i];
                        console.log("ACTUAL PATH: ", pathAbsolute);
                        console.log("WATCH PATH: ", watchPathAbsolute);

                        if(pathAbsolute.indexOf(watchPathAbsolute) !== -1) {
                            console.log("FIRING: " + fileType);
                            this._spawn("warhorse", [this.pipelineType, fileType]);
                        }
                    }
                }
            }
        }
    },
    // eventCallback: function(events) {
    //     // handles other events
    //     for(let i = 0; i < events.length; i++) {
    //         let event = events[i];
    //
    //         let filePathAbsolute = path.resolve(event.directory, event.file);
    //         console.log(`${ACTIONS_LOOKUP[event.action]}: ${filePathAbsolute}`);
    //     }
    // },
    errorCallback(errors) {
        //handle errors
        console.log("ERRORS: " + JSON.stringify(errors));
    },
    watch: function(workingDirectory, pipelineType, defaults) {
        // console.log("pipelineType: " + pipelineType);
        this.pipelineType = pipelineType;

        let config = defaults.watch;
        for(let type in config) {
            config[type][0] = path.resolve(config[type][0]);
            this.watchedTypes.push(type);
        }
        console.log(JSON.stringify(config, null, 2));
        this.config = config;
        //
        // let debounceMS = 250;
        // let watchPath = workingDirectory;
        // let eventCallback = this.eventCallback;
        // let errorCallback = this.errorCallback;
        // let watcher = nsfw(watchPath, eventCallback, errorCallback);


        let watcher;

        return nsfw(
            workingDirectory,
            this.eventCallback.bind(this),
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


// FileHelper.watch("/Users/kasargeant/dev/projects/warhorse", options);

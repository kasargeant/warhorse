"use strict";

// Imports
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const glob = require("glob");

const browserify = require("browserify");
const uglify = require("uglify-js");
const csso = require("csso");

// Constants
const gzip = zlib.createGzip();



/**
 * The Warhorse constructor takes an options object.  In these options are contained the user requested
 * configuration defaults for the project.  If there are no options - then Warhorse's own default
 * configuration settings will be used instead.
 * @class
 */
class Warhorse {
    /**
     * Constructor
     * @param options
     */
    constructor(options = {}) {
        this.defaults = {
            directory: "./",
            bundle: {
                minify: true
            },
            save: {
                compress: false
            }
        };
        this.settings = Object.assign(this.defaults, options);

        this.tasks = {}; // Lookup for user-defined tasks.

    }

    /**
     * Bundle function.
     * @param file
     * @param next
     * @param options
     */
    bundle(file, next, options = {}) {

        console.log(` - Bundling file from: ${file.path}`);

        let config = Object.assign(this.settings.bundle, options);

        let buffer = "";
        let b = browserify(file.path).bundle();
        b.on("error", console.error);
        b.on("data", function(data) {buffer += data;});
        b.on("end", function() {
            file.content = buffer;
            console.log(`     Browserifyied length: ${file.content.length}`);
            if(config.minify) {
                console.log(` - Minimising file from: ${file.path}`);
                let result = uglify.minify({"file": buffer}, {
                    fromString: true
                });
                if(result) {
                    // We only care about the code itself - not the uglify object.
                    file.content = result.code;
                    console.log(`     Uglifyied length: ${file.content.length}`); // minified output
                }
            }
            next(file);//this.save(dstPath, result.code);
        }.bind(this));
    }

    /**
     * Minify CSS function.
     * @param file
     * @param next
     * @param options
     */
    minifyCSS(file, next, options = {}) {

        console.log(` - Minifying CSS from: ${file.path}`);

        let settings = Object.assign(this.settings.bundle, options);

        var minifiedCss = csso.minify(file.content).css;

        console.log(minifiedCss);

        file.content = minifiedCss;

        next(file);//this.save(dstPath, result.code);
    }

    /**
     * Document function.
     * @param file
     * @param next
     * @param options
     */
    document(file, next, options = {}) {

        console.log(` - Documenting file(s) from: ${file.path}`);

        let settings = Object.assign(this.settings.bundle, options);

        let buffer = "";
        let b = browserify(file.path).bundle();
        b.on("error", console.error);
        b.on("data", function(data) {buffer += data;});
        b.on("end", function() {
            file.content = buffer;
            console.log(`     Browserifyied length: ${file.content.length}`);
            if(settings.minify) {
                console.log(` - Minimising file from: ${file.path}`);
                let result = uglify.minify({"file": buffer}, {
                    fromString: true
                });
                if(result) {
                    // We only care about the code itself - not the uglify object.
                    file.content = result.code;
                    console.log(`     Uglifyied length: ${file.content.length}`); // minified output
                }
            }
            next(file);//this.save(dstPath, result.code);
        }.bind(this));
    }


    _loadFilePath(globPath, next) {
        console.log(` - Have glob: ${globPath}`);
        // Async filesystem check
        // glob(globPath, function(err, filePaths) {
        //     // files is an array of filenames.
        //     // If the `nonull` option is set, and nothing
        //     // was found, then files is ["**/*.js"]
        //     // er is an error object or null.
        //     if(err) {
        //         console.log(err);
        //     } else if(filePaths.constructor === Array && filePaths.length > 0) {
        //         for(let filePath of filePaths) {
        //             let file = this.splitPath(filePath);
        //             console.log(` - Loading file from: ${file.name}`);
        //             file.content = fs.readFileSync(filePath, "utf8");
        //             next(file);
        //         }
        //     } else {
        //         console.log("No files matched.");
        //         next(null);
        //     }
        // }.bind(this));

        // Async filesystem check
        let filePaths = glob.sync(globPath);
        if(filePaths.constructor === Array && filePaths.length > 0) {
            for(let filePath of filePaths) {
                let file = this.splitPath(filePath);
                console.log(` - Loading file from: ${file.name}`);
                file.content = fs.readFileSync(filePath, "utf8");
                next(file);
            }
        } else {
            console.log("No files matched.");
            next(null);
        }
    }

    /**
     * Load function
     * @param filePath
     * @param action
     * @param options
     */
    load(filePath, action, options = {}) {

        // If it is a batch of filePaths...
        if(filePath.constructor === Array) {
            filePath.map(function(filePathItem) {
                this._loadFilePath(filePathItem, action);}.bind(this)
            );
        }
        // Else if it is single filePath.
        else if(typeof filePath === "string") {
            this._loadFilePath(filePath, action);
        }
        // Otherwise...
        else {
            console.error(`Error: Unrecognisable or null filepath: ${filepath}`);
        }
    }

    splitPath(filePath) {

        // Sanity check
        if(!filePath) {return null;}

        console.log(` - Splitting file path: ${filePath}`);

        let name = path.posix.basename(filePath);
        let directory = path.dirname(filePath);
        let extension = path.extname(filePath);
        let stem = filePath.slice(0, filePath.lastIndexOf("."));
        // Is it a config file e.g. .jshintrc
        let config = false;
        if(extension === "" && name.length > 0 && name[0] === "." && name.slice(-2) === "rc") {
            config = true;
        }
        return {
            path: filePath,
            directory: directory,
            name: name,
            stem: stem,
            extension: extension,
            config: config
        };
    }

    /**
     * Save function.
     * @param file
     * @param dstPath
     * @param options
     */
    save(file, dstPath, options = {}) {

        let config = Object.assign(this.settings.save, options);

        console.log(` - Saving file to: ${dstPath}`);

        if(config.compress === true) {
            let data = zlib.gzipSync(file.content);
            fs.writeFileSync(dstPath + ".gz", data, "utf8");
        } else {
            fs.writeFileSync(dstPath, file.content, "utf8");
        }
    }

    // task(...actions) {
    //     return actions.map(function(action) {
    //         return multiplier * element;
    //     });
    // }

    task(name, taskFunction) {
        this.tasks[name] = taskFunction;
    }

    execute(name) {
        console.log(`TASK ${name}`);
        let action = this.tasks[name];
        if(action !== null) {
            console.log("TYPE: " + typeof action);
            action();
        }
    }
}

// Exports
module.exports = Warhorse;

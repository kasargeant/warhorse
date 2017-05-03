"use strict";

// Imports
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const glob = require("glob");

const browserify = require("browserify");
const uglify = require("uglify-js");
const sass = require("node-sass");
const csso = require("csso");


/**
 * The Warhorse constructor takes an options object.  In these options are contained the user requested
 * configuration defaults for the project.  If there are no options - then Warhorse's own default
 * configuration settings will be used instead.
 * @class
 */
class Warhorse {
    /**
     * Constructor
     * @param {Object} options - Configuration options to override Warhorse's own defaults.
     */
    constructor(options = {}) {
        this.defaults = {
            directory: process.cwd(),
            init: {
                name: "Untitled",
                version: "0.0.0",
                description: "A new project generated by the Warhorse task runner.",
                keywords: ["javascript"],
                author: "Unknown",
                email: "unknown@nowhere.com",
                license: "GPL-3.0"
            },
            bundle: {
                minify: true,
                transpile: false
            },
            compile: {},
            minify: {},
            save: {
                compress: false
            }
        };
        this.settings = Object.assign(this.defaults, options);

        this.tasks = {}; // Lookup for user-defined tasks.

    }

    /**
     * Bundle function.
     * @param {Object} file - File to be processed by this action.
     * @param {Function} next - The next callback action to be executed after this one.
     * @param {Object} options - Options to further configure this action.
     * @returns {void}
     */
    bundle(file, next, options = {}) {

        // Handle task configuration.
        let config = Object.assign(this.settings.bundle, options);

        console.log(` - Bundling file from: ${file.path}`);

        // Locals
        let buffer = "";
        let b = null;

        // Determine if we're transpiling as well as bundling... or just bundling?
        if(config.transpile === true) {
            // Transpile then bundle
            b = browserify(file.path).transform("babelify", {presets: ["es2015"]}).bundle();
        } else {
            // Just bundle
            b = browserify(file.path).bundle();
        }
        b.on("error", console.error);
        b.on("data", function(data) {buffer += data;});
        b.on("end", function() {
            file.content = buffer;
            console.log(`     Browserifyied length: ${file.content.length}`);

            if(config.minify) {
                console.log(` - Minimising file from: ${file.path}`);

                this.minifyJS(file, next, function() {
                    // Pass on to the next function.
                    next(file);
                });
            } else {
                next(file);
            }
        }.bind(this));
    }


    /**
     * Compile SCSS(SASS) function.
     * @param {Object} file - File to be processed by this action.
     * @param {Function} next - The next callback action to be executed after this one.
     * @param {Object} options - Options to further configure this action.
     * @returns {Object} - If the next parameter is given a null or no value - function behaves synchronously and returns result directly.
     */
    compileSCSS(file, next, options = {}) {

        console.log(` - Compiling SCSS from: ${file.path}`);

        let config = Object.assign(this.settings.compile, options);

        file.content = sass.renderSync({
            //data: file.content
            file: file.path
        }).css;

        // Update file name in accordance with sass->css norms.
        file.name = file.stem + ".css";
        file.ext = ".css";
        console.log(` - Filename: ${file.name}`);

        // Is there a chained callback function?
        if(typeof next === "function") {
            // Yes - Pass file result onto the next function.
            next(file);
            return null; // XXX: Pointless, required by jsdoc.
        } else {
            // No - Then return file result directly.
            return file;
        }
    }

    /**
     * Create project convention function.
     * @param {Object} file - File to be processed by this action.
     * @param {Function} next - The next callback action to be executed after this one.
     * @param {Object} options - Options to further configure this action.
     * @returns {void}
     */
    init(file, next, options = {}) {

        // Resolve configuration
        let config = Object.assign(this.settings.init, options);

        // Create NPM package configuration
        const packageDefault = require("../default/package.json");
        let packageProject = Object.assign(packageDefault, config);

        let convention = "default";
        console.log(` * Creating project from convention: ${convention}`);
        console.log(`   - Working directory: ${process.cwd()}`);

        // Fault-tolerant version of fs.mkdirSync(dirPath) - won't overwrite existing dirs!!!
        const mkdirSync = function(dirPath) {
            try {
                fs.mkdirSync(dirPath);
            } catch(err) {
                if(err.code !== "EEXIST") {throw err;};
            }
        };

        // Fault-tolerant version of fs.unlinkSync(filePath) - won't crash if no file already exists!!!
        const unlinkSync = function(filePath) {
            try {
                fs.unlinkSync(filePath);
            } catch(err) {
                console.error(err.code);
                // if(err.code !== "EEXIST") {throw err};
            }
        };


        // Create project directory structure
        //FIXME - Guard can be removed once function is fully implemented.
        let workingDirectory = this.settings.directory;
        if(workingDirectory === "/Users/kasargeant/dev/projects/warhorse") {
            mkdirSync("./temp");

            mkdirSync("./temp/conf");

            mkdirSync("./temp/dist");

            mkdirSync("./temp/docs");
            mkdirSync("./temp/docs/api");
            mkdirSync("./temp/docs/coverage");
            mkdirSync("./temp/docs/tests");
            mkdirSync("./temp/docs/linters");

            mkdirSync("./temp/src");
            mkdirSync("./temp/src/css");
            mkdirSync("./temp/src/img");
            mkdirSync("./temp/src/js");

            mkdirSync("./temp/test");

            // Write NPM package definition
            let packageJson = JSON.stringify(packageProject, null, 4);
            unlinkSync("./temp/package.json");
            fs.writeFileSync("./temp/package.json", packageJson, "utf8");
            console.log(packageJson);
            
            // Create configuration files
            const configJSCS = require("../default/conf/jscsrc.json");
            fs.writeFileSync("./temp/conf/.jscsrc", JSON.stringify(configJSCS, null, 4));

            const configJSHINT = require("../default/conf/jshintrc.json");
            fs.writeFileSync("./temp/conf/.jshintrc", JSON.stringify(configJSHINT, null, 4));
        }

        // Pass file result onto the next function.
        next(file);
    }

    /**
     * Document function.
     * @param {Object} file - File to be processed by this action.
     * @param {Function} next - The next callback action to be executed after this one.
     * @param {Object} options - Options to further configure this action.
     * @returns {void}
     */
    document(file, next, options = {}) {

        console.log(` * Documenting file(s) from: ${file.path}`);
        console.log(`   - TO BE IMPLEMENTED.`);
        next(file);
        return;
        let config = Object.assign(this.settings.document, options);
    }

    /**
     * Private helper for load().
     * @param {string} globPath
     * @param {Function} next
     * @private
     */
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
        //             let file = this._splitPath(filePath);
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
                let file = this._splitPath(filePath);
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
     * @param {string} filePath - File path (globs/wildcards allowed) to be processed by this action.
     * @param {Function} next - The next callback action to be executed after this one.
     * @param {Object} options - Options to further configure this action.
     * @returns {void}
     */
    load(filePath, next, options = {}) {

        // If it is a batch of filePaths...
        if(filePath.constructor === Array) {
            filePath.map(function(filePathItem) {
                this._loadFilePath(filePathItem, next);}.bind(this)
            );
        }
        // Else if it is single filePath.
        else if(typeof filePath === "string") {
            this._loadFilePath(filePath, next);
        }
        // Otherwise...
        else {
            console.error(`Error: Unrecognisable or null filepath: ${filepath}`);
        }
    }

    /**
     * Minify CSS function.
     * @param {Object} file - File to be processed by this action.
     * @param {Function} next - The next callback action to be executed after this one.
     * @param {Object} options - Options to further configure this action.
     * @returns {Object} - If the next parameter is given a null or no value - function behaves synchronously and returns result directly.
     */
    minifyCSS(file, next, options = {}) {

        console.log(` - Minifying CSS from: ${file.path}`);

        let config = Object.assign(this.settings.minify, options);

        file.content = csso.minify(file.content).css;

        // Is there a chained callback function?
        if(typeof next === "function") {
            // Yes - Pass file result onto the next function.
            next(file);
            return null; // XXX: Pointless, required by jsdoc.
        } else {
            // No - Then return file result directly.
            return file;
        }
    }


    /**
     * Minify JS function.
     * @param {Object} file - File to be processed by this action.
     * @param {Function} next - The next callback action to be executed after this one.
     * @param {Object} options - Options to further configure this action.
     * @returns {Object} - If the next parameter is given a null or no value - function behaves synchronously and returns result directly.
     */
    minifyJS(file, next, options = {}) {

        console.log(` - Minifying JS from: ${file.path}`);

        let settings = Object.assign(this.settings.bundle, options);

        let result = uglify.minify({"file": file.content}, {
            fromString: true
        });

        if(result) {
            // We only care about the code itself - not the uglify object.
            file.content = result.code;
            console.log(`     Uglifyied length: ${file.content.length}`); // minified output
        }

        // Is there a chained callback function?
        if(typeof next === "function") {
            // Yes - Pass file result onto the next function.
            next(file);
            return null; // XXX: Pointless, required by jsdoc.
        } else {
            // No - Then return file result directly.
            return file;
        }
    }

    /**
     * Splits a file path into its component parts.
     * @param {string} filePath - A standard system filepath.
     * @returns {Object} - An object containing a destructured hash of the path's parts.
     * @private
     */
    _splitPath(filePath) {

        // Sanity check
        if(!filePath) {return null;}

        console.log(` - Splitting file path: ${filePath}`); // e.g. /docs/index.html

        let name = path.posix.basename(filePath);           // e.g. index.html
        let directory = path.dirname(filePath);             // e.g. /docs/
        let extension = path.extname(filePath);             // e.g. .html
        let stem = name.slice(0, name.lastIndexOf("."));    // e.g. index

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
     * @param {Object} file - File to be processed by this action.
     * @param {string} dstPath - The file path that this file will be saved to.
     * @param {Object} options - Options to further configure this action.
     * @returns {void}
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

    /**
     * Task 'wrapper' function.
     * @param {string} name - Name of the task.
     * @param {string} taskFunction - An anonymous function containing the actions involved in the task.
     * @returns {void}
     */
    task(name, taskFunction) {
        this.tasks[name] = taskFunction;
    }

    /**
     * Execute task function.
     * @param {string} name - Name of the task.
     * @returns {void}
     */
    execute(name) {
        console.log(`TASK ${name}`);
        let action = this.tasks[name];
        if(action !== null) {
            //console.log("Executing command: " + typeof action);
            action();
        }
    }
}

// Exports
module.exports = Warhorse;

/**
 * @file Warhorse.js
 * @description The main Warhorse daemon.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const os = require("os");
const path = (os.platform() === "win32") ? require("path").win32 : require("path");
const fs = require("fs");
const child = require("child_process");

const glob = require("glob");
const merge = require("merge");
const shell = require("shelljs");
const tar = require("tar");
const zipper = require("zip-local");

// Helpers (external)
const Git = require("./helpers/GitHelper");
const Cli = require("./helpers/CliHelper");
const File = require("./helpers/FileHelper");

// Default templates
const packageBase = require("../conventions/package_base.json");
const packageSnippets = require("../conventions/package_snippets.json");

// Setup console
const Pageant = require("pageant");
const console = new Pageant();
const color = require("tinter");

// Helpers (internal)
function ensureTargetDirectory(workingDirectory, relativePathDst) {
    let dst = path.resolve(workingDirectory, relativePathDst);
    let dstPath = path.dirname(dst);
    shell.mkdir("-p", dstPath);
}


/**
 * @class
 * @classdesc The main Warhorse class, containing all actions available to automate tasks and builds.
 */
class Warhorse {
    /**
     * The Warhorse constructor takes an options object.  In these options are contained the user requested
     * configuration defaults for the project.  If there are no options - then Warhorse's own default
     * configuration settings will be used instead.
     * @constructor
     * @param {string} moduleDirectory - Directory where this file's module is.
     * @param {string} workingDirectory - Directory where this code was originally invoked from.
     * @param {Object} [options] - Configuration options to override Warhorse's own defaults.
     * @param {string} [options.language=es51] - JavaScript language version.  Can be "es51", "es2015".
     * @param {boolean} [options.debug=false] - Flag to initiate verbose tool operation (including source map generation).
     */
    constructor(moduleDirectory, workingDirectory, options = {}) {
        this.defaults = {

            debug: false,
            language: "es51", //"es51", "es2015", "es2015+JSX"

            bundle: {
                debug: false,
                useOutput: "stdout",
                useEqualsSign: false,
                src: "src/index.js",
                dst: "dist/index.js"
            },
            clean: {},
            compress: {
                css: {
                    src: "dist/css/index.min.css",
                    dst: "dist/css/index.min.css.tar.gz"
                },
                js: {
                    src: "dist/js/index.min.js",
                    dst: "dist/js/index.min.js.tar.gz"
                },
                gif: {
                    src: "./test/data/client_src/img/gif/*.gif",
                    dst: "./dist/img/gif"
                },
                jpg: {
                    src: "./test/data/client_src/img/jpg/*.jpg",
                    dst: "./dist/img/jpg"
                },
                png: {
                    src: "./test/data/client_src/img/png/*.png",
                    dst: "./dist/img/png"
                },
                svg: {
                    src: "./test/data/client_src/img/svg/*.svg",
                    dst: "./dist/img/svg"
                },
                txt: {
                    src: "dist/js/index.min.js",
                    dst: "dist/js/index.js.tar.gz"
                }
            },
            create: {},
            document: {
                js: {
                    src: "./src/index.js",
                    dst: "./docs/api",
                    useOutput: "stdout"
                }
            },
            lint: {
                js: {
                    style: {},
                    quality: {}
                }
            },
            load: {
                encoding: "utf8"
            },
            minify: {
                css: {
                    debug: false,
                    useOutput: "stdout",
                    useEqualsSign: false,
                    src: "src/css/index.css",
                    dst: "dist/css/index.min.css"
                },
                js: {
                    debug: false,
                    useOutput: "stdout",
                    useEqualsSign: false,
                    src: "src/js/index.js",
                    dst: "dist/js/index.js"
                }
            },
            pack: {
                gif: {},
                jpg: {},
                png: {},
                svg: {}
            },
            preprocess: {
                less: {
                    src: "src/less/index.less",
                    dst: "dist/css/index.css"
                },
                sass: {
                    src: "src/sass/index.sass",
                    dst: "dist/css/index.css"
                }
            },
            postprocess: {
                css: {
                    src: "src/css/index.css"
                }
            },
            process: {
                includePaths: ["./src/sass"]
            },
            rename: {},
            save: {
                compress: false,
                encoding: "utf8"
            },
            test: {
                js: {
                    bayeux: {
                        src: "test/js/*.test.js"
                    },
                    jest: {}
                }
            }
        };
        this.settings = Object.assign(this.defaults, options);

        this.commands = ["build", "clean", "create", "distribute", "document", "lint", "pack", "process", "publish", "test"]; //FIXME - replace with Object.keys(warhorse.tasks);
        this.conventions = ["client", "library", "module", "server"]; //TODO "fullstack" convention,

        this.cmds = {}; // Lookup for built-in commands.

        this.moduleDirectory = moduleDirectory;     // i.e. Warhorse's own directory
        this.conventionsDirectory = moduleDirectory + "src/conventions/";
        this.workingDirectory = workingDirectory;   // Current working directory... i.e. a project directory and location of _warhorse.js

        this.file = null; // Main arg passed from function to function - requires sync operation of course!

        // Finally add user-defined tasks...
        try {
            // ...from a user-defined file
            this.cmds = require(this.workingDirectory + "/_warhorse.js")(this);
        } catch(ex) {
            // ...or otherwise, fall-back on default
            this.cmds = require(this.moduleDirectory + "/_warhorse.js")(this);
            // console.debug("Warning: This directory is missing a '_warhorse.js' file and is uninitialised.");
        }
        // Finally, finally, slip built-in 'create' into cmds
        this.cmds.create = this._cmdCreate;
        this.cmds.watch = this._cmdWatch;
    }

    /**
     * Clean/ delete file(s) task.
     * @param {Array} paths - Array of paths or files to empty and delete.
     * @param {Object} options - Options to further configure this action.
     * @returns {Object} - Returns self for chaining.
     */
    clean(paths, options = {}) {
        // Log task execution
        if(options.isSilent !== true) {console.h2(`TASK: Cleaning project...`);}

        shell.rm("-rf", ...paths);
        console.h4(`Done.`);
    }

    /**
     * Copy file(s) task.
     * @param {string} type - Type of source file.
     * @param {Object} [options] - Options to override or extend this task's default configuration.
     * @param {string} options.src - The source path for this task.
     * @param {string} options.dst - The destination/target path for this task.
     * @returns {Object} - Returns self for chaining.
     */
    copy(type, options = {}) {

        // Log task execution
        if(options.isSilent !== true) {console.h2(`TASK: Bundling ${type.toUpperCase()}...`);}

        if(options.recurse === true) {
            shell.cp("-R", options.src, options.dst);
        } else {
            shell.cp(options.src, options.dst);
        }
        console.h4(`Done.`);
    }

    /**
     * Task for bundling and module resolution.
     * @param {string} type - Type of source file.
     * @param {Object} [options] - Options to override or extend this task's default configuration.
     * @param {string} options.debug - Enable debug reporting and/or (if available) source-maps.
     * @param {string} options.src - The source path for this task.
     * @param {string} options.dst - The destination/target path for this task.
     * @param {string} options.exclude - Exclude file(s) from the task.
     * @param {string} options.include - Include file(s) for the task.
     * @returns {Object} - Returns self for chaining.
     */
    bundle(type, options={}) {

        // Log task execution
        if(options.isSilent !== true) {console.h2(`TASK: Bundling ${type.toUpperCase()}...`);}

        // Select sub-task based on data type
        if(type === "js") {

            // Create a user-level config from defaults/options
            let config = Object.assign(this.defaults.bundle, options);

            // Resolve tool-level cmd-line toolArguments and toolOptions - with that user-level config
            let toolArgs = [config.src];
            let toolOptions = {
                debug: this.settings.debug || config.debug,   // i.e. debug/source map options
                config: config.conf,
                outfile: config.dst,
                exclude: config.exclude,
                external: config.include,
                recurse: true
            };
            if(this.settings.language !== "es51") {
                toolOptions.transform = `[babelify --presets [${this.settings.language}]]`;
            }

            // Ensure that the destination directory actually exists... or if not, create it.
            ensureTargetDirectory(this.workingDirectory, config.dst);
            // let dst = path.resolve(this.workingDirectory, config.dst);
            // let dstPath = path.dirname(dst);
            // shell.mkdir("-p", dstPath);

            // Finally map configuration to tool args and options
            this._execute(this.moduleDirectory, "./node_modules/.bin/browserify", this.workingDirectory, toolArgs, toolOptions, config);

        } else {
            throw new Error(`Unrecognised type '${type}'.`);
        }

        // Return self for chaining.
        return this;
    }

    /**
     * Task for compressing files of any type. e.g. JS, CSS, TXT. [NOTE: CURRENTLY OUTPUTS .tar.gz ONLY.]
     * @param {string} type - Type of source file.
     * @param {Object} [options] - Options to override or extend this task's default configuration.
     * @param {string} options.debug - Enable debug reporting and/or (if available) source-maps.
     * @param {string} options.src - The source path for this task.
     * @param {string} options.dst - The destination/target path for this task.
     * @returns {Object} - Returns self for chaining.
     */
    compress(type, options={}) {

        // Log task execution
        if(options.isSilent !== true) {console.h2(`TASK: Compressing ${type.toUpperCase()}...`);}

        // Select sub-task based on data type
        if(["css", "js", "txt"].includes(type)) {

            // Create a user-level config from defaults/options
            let config = Object.assign(this.defaults.compress[type], options);

            // Resolve tool-level cmd-line toolArguments and toolOptions - with that user-level config
            let toolArgs = [config.src];
            let toolOptions = {
                sync: true,
                gzip: true,
                cwd: this.workingDirectory,
                file: config.dst
            };

            // Ensure that the destination directory actually exists... or if not, create it.
            ensureTargetDirectory(this.workingDirectory, config.dst);

            // NOTE: There is no user->tool mapping necessary here.
            // Directly execute the task.
            tar.c(toolOptions, toolArgs);

        } else if(["gif", "jpg", "png", "svg"].includes(type)) {
            // NOTE: This is different to every other task.  here we use the same task code for all the different
            //       image types.
            const plugins = {
                "gif": "gifsicle",
                "jpg": "jpegtran",
                "png": "pngquant",
                "svg": "svgo"
            };
            let plugin = plugins[type];
            if(plugin !== undefined) {

                // Create a user-level config from defaults/options
                let config = Object.assign(this.defaults.compress[type], options);

                // Resolve tool-level cmd-line toolArguments and toolOptions - with that user-level config
                let toolArgs = [config.src];
                let toolOptions = {
                    map: this.settings.debug || config.debug,   // i.e. debug/source map options
                    "out-dir": config.dst,
                    plugin: plugin
                };

                // Ensure that the destination directory actually exists... or if not, create it.
                ensureTargetDirectory(this.workingDirectory, config.dst);

                // Finally map configuration to tool args and options
                this._execute(this.moduleDirectory, "./node_modules/.bin/imagemin", this.workingDirectory, toolArgs, toolOptions, config);
            }
        } else {
            throw new Error(`Unrecognised type '${type}'.`);
        }

        // Return self for chaining.
        return this;
    }

    /**
     * Task for automatically documenting project source code.
     * @param {string} type - Type of source file.
     * @param {Object} [options] - Options to override or extend this task's default configuration.
     * @param {string} options.debug - Enable debug reporting and/or (if available) source-maps.
     * @param {string} options.src - The source path for this task.
     * @param {string} options.dst - The destination/target path for this task.
     * @returns {Object} - Returns self for chaining.
     */
    document(type, options={}) {
        // Log task execution
        if(options.isSilent !== true) {console.h2(`TASK: Documenting ${type.toUpperCase()}...`);}

        // Select sub-task based on data type
        if(type === "js") {

            // Create a user-level config from defaults/options
            let config = Object.assign(this.defaults.document.js, options);

            // Resolve tool-level cmd-line toolArguments and toolOptions - with that user-level config
            // NOTE: We always use Warhorse conf file.
            let src = path.resolve(this.workingDirectory, config.src);
            let dst = path.resolve(this.workingDirectory, config.dst);
            let configPath = path.resolve(this.moduleDirectory, "./conf/jsdoc.json");
            let toolArgs = [src];
            let toolOptions = {
                verbose: this.settings.debug || config.debug,   // i.e. debug/source map options
                configure: configPath,
                destination: dst,
                recurse: true
            };

            // Ensure that the destination directory actually exists... or if not, create it.
            ensureTargetDirectory(this.workingDirectory, config.dst);

            // Finally map configuration to tool args and options
            this._execute(this.moduleDirectory, "./node_modules/.bin/jsdoc", this.moduleDirectory, toolArgs, toolOptions, config);

        } else {
            throw new Error(`Unrecognised type '${type}'.`);
        }

        // Return self for chaining.
        return this;
    }

    /**
     * Task for linting source and template code. e.g. JS, LESS, SASS.
     * @param {string} type - Type of source file.
     * @param {Object} [options] - Options to override or extend this task's default configuration.
     * @param {string} options.debug - Enable debug reporting and/or (if available) source-maps.
     * @param {string} options.src - The source path for this task.
     * @param {string} options.dst - The destination/target path for this task.
     * @param {string} options.exclude - Exclude file(s) from the task.
     * @param {string} options.include - Include file(s) for the task.
     * @returns {Object} - Returns self for chaining.
     */
    lint(type, options={}) {

        // Log task execution
        if(options.isSilent !== true) {console.h2(`TASK: Linting ${type.toUpperCase()}...`);}

        // Select sub-task based on data type
        if(type === "js" && options.type === "style") {

            // Create a user-level config from defaults/options
            let config = Object.assign(this.defaults.lint.js.style, options);
            config.useOutput = "jscs";
            config.useEqualsSign = true;
            config.stdio = "pipe"; // Needed to return raw data

            // Resolve tool-level cmd-line toolArguments and toolOptions - with that user-level config
            // NOTE: We always use Warhorse conf file.
            let src = path.resolve(this.workingDirectory, config.src);
            let configPath = path.resolve(this.moduleDirectory, "./conf/jscs.json");
            let toolArgs = [src];
            let toolOptions = {
                config: configPath,
                reporter: "json"
            };

            // Finally map configuration to tool args and options
            this._execute(this.moduleDirectory, "./node_modules/.bin/jscs", this.moduleDirectory, toolArgs, toolOptions, config);

        } else if(type === "js" && options.type === "quality") {

            // Create a user-level config from defaults/options
            let config = Object.assign(this.defaults.lint.js.quality, options);
            config.useOutput = "jshint";
            config.useEqualsSign = true;
            config.stdio = "pipe"; // Needed to return raw data

            // Resolve tool-level cmd-line toolArguments and toolOptions - with that user-level config
            // NOTE: We always use Warhorse conf file.
            let src = path.resolve(this.workingDirectory, config.src);
            let configPath = path.resolve(this.moduleDirectory, "./conf/jshint.json");
            let toolArgs = [src];
            let toolOptions = {
                config: configPath,
                reporter: path.resolve(this.moduleDirectory, "./node_modules/jshint-json/json.js")
            };

            // Finally map configuration to tool args and options
            this._execute(this.moduleDirectory, "./node_modules/.bin/jshint", this.moduleDirectory, toolArgs, toolOptions, config);

        } else {
            throw new Error(`Unrecognised type '${type}'.`);
        }

        // Return self for chaining.
        return this;
    }

    /**
     * Task for minifying distributed code. e.g. JS, CSS.
     * @param {string} type - Type of source file.
     * @param {Object} [options] - Options to override or extend this task's default configuration.
     * @param {string} options.debug - Enable debug reporting and/or (if available) source-maps.
     * @param {string} options.src - The source path for this task.
     * @param {string} options.dst - The destination/target path for this task.
     * @param {string} options.exclude - Exclude a file from the output bundle. Can be globs.
     * @param {string} options.include - Include a file from another bundle. Can be globs.
     * @returns {Object} - Returns self for chaining.
     */
    minify(type, options={}) {

        // Log task execution
        if(options.isSilent !== true) {console.h2(`TASK: Minifying ${type.toUpperCase()}...`);}

        // Select sub-task based on data type
        if(type === "js") {

            // Create a user-level config from defaults/options
            let config = Object.assign(this.defaults.minify.js, options);

            // Resolve tool-level cmd-line toolArguments and toolOptions - with that user-level config
            let toolArgs = [config.src];
            let toolOptions = {
                verbose: this.settings.debug || config.debug,   // i.e. debug/source map options
                "config-file": config.conf,
                output: config.dst,
                compress: true,
                mangle: true
            };

            // Ensure that the destination directory actually exists... or if not, create it.
            ensureTargetDirectory(this.workingDirectory, config.dst);

            // Finally map configuration to tool args and options
            this._execute(this.moduleDirectory, "./node_modules/.bin/uglifyjs", this.workingDirectory, toolArgs, toolOptions, config);

        } else if(type === "css") {

            // Create a user-level config from defaults/options
            let config = Object.assign(this.defaults.minify.css, options);

            // Resolve tool-level cmd-line toolArguments and toolOptions - with that user-level config
            let toolArgs = [];
            let toolOptions = {
                debug: this.settings.debug || config.debug,   // i.e. debug/source map options
                map: this.settings.debug || config.debug,   // i.e. debug/source map options
                input: config.src,
                output: config.dst
            };

            // Finally map configuration to tool args and options
            this._execute(this.moduleDirectory, "./node_modules/.bin/csso", this.workingDirectory, toolArgs, toolOptions, config);

        } else {
            throw new Error(`Unrecognised type '${type}'.`);
        }

        // Return self for chaining.
        return this;

    }

    /**
     * Task for preprocessing template code. e.g. Handlebars, LESS, SASS.
     * @param {string} type - Type of source file.
     * @param {Object} [options] - Options to override or extend this task's default configuration.
     * @param {string} options.debug - Enable debug reporting and/or (if available) source-maps.
     * @param {string} options.src - The source path for this task.
     * @param {string} options.dst - The destination/target path for this task.
     * @param {string} options.exclude - Exclude file(s) from the task.
     * @param {string} options.include - Include file(s) for the task.
     * @returns {Object} - Returns self for chaining.
     */
    preprocess(type, options={}) {

        // Log task execution
        if(options.isSilent !== true) {console.h2(`TASK: Preprocessing ${type.toUpperCase()}...`);}

        // Select sub-task based on data type
        if(type === "less") {

            // Create a user-level config from defaults/options
            let config = Object.assign(this.defaults.preprocess.less, options);
            config.useEqualsSign = true;
            // config.stdio = "pipe"; // Needed to return raw data

            // Resolve tool-level cmd-line toolArguments and toolOptions - with that user-level config
            let toolArgs = [config.src, config.dst];
            let toolOptions = {
                "source-map": this.settings.debug || config.debug,   // i.e. debug/source map options
                "include-path": config.include,
                "relative-urls": true
            };

            // Ensure that the destination directory actually exists... or if not, create it.
            ensureTargetDirectory(this.workingDirectory, config.dst);

            // Finally map configuration to tool args and options
            this._execute(this.moduleDirectory, "./node_modules/.bin/lessc", this.workingDirectory, toolArgs, toolOptions, config);

        } else if(type === "sass") {

            // Create a user-level config from defaults/options
            let config = Object.assign(this.defaults.preprocess.sass, options);

            // Resolve tool-level cmd-line toolArguments and toolOptions - with that user-level config
            let toolArgs = [config.src, config.dst];
            let toolOptions = {
                "source-map": this.settings.debug || config.debug,   // i.e. debug/source map options
                "include-path": config.include,
                "relative-urls": true
            };

            // Ensure that the destination directory actually exists... or if not, create it.
            ensureTargetDirectory(this.workingDirectory, config.dst);

            // Finally map configuration to tool args and options
            this._execute(this.moduleDirectory, "./node_modules/.bin/node-sass", this.workingDirectory, toolArgs, toolOptions, config);

        } else {
            throw new Error(`Unrecognised type '${type}'.`);
        }

        // Return self for chaining.
        return this;
    }

    /**
     * Task for post-processing source code. e.g. CSS.
     * @param {string} type - Type of source file.
     * @param {Object} [options] - Options to override or extend this task's default configuration.
     * @param {string} options.debug - Enable debug reporting and/or (if available) source-maps.
     * @param {string} options.src - The source path for this task.
     * @param {string} options.dst - The destination/target path for this task.
     * @returns {Object} - Returns self for chaining.
     */
    postprocess(type, options={}) {
        if(type === "css") {

            // Create a user-level config from defaults/options
            let config = Object.assign(this.defaults.preprocess.less, options);

            // Resolve tool-level cmd-line toolArguments and toolOptions - with that user-level config
            let toolArgs = [config.src];
            let toolOptions = {
                map: this.settings.debug || config.debug,   // i.e. debug/source map options
                replace: true
            };
            console.log(">>" + path.extname(config.dst) + "<<")
            if(path.extname(config.dst) === "") {
                toolOptions.dir = config.dst;
            } else {
                toolOptions.output = config.dst;
            }

            // Ensure that the destination directory actually exists... or if not, create it.
            ensureTargetDirectory(this.workingDirectory, config.dst);

            // Finally map configuration to tool args and options
            this._execute(this.moduleDirectory, "./node_modules/.bin/postcss", this.workingDirectory, toolArgs, toolOptions, config);

        } else {
            throw new Error(`Unrecognised type '${type}'.`);
        }

        // Return self for chaining.
        return this;
    }

    /**
     * TODO: IMPLEMENT Task for publishing the distribution to cloud services. e.g. NPM.
     * @param {string} type - Type of source file.
     * @param {Object} [options] - Options to override or extend this task's default configuration.
     * @param {string} options.debug - Enable debug reporting and/or (if available) source-maps.
     * @param {string} options.src - The source path for this task.
     * @param {string} options.dst - The destination/target path for this task.
     * @returns {Object} - Returns self for chaining.
     */
    publish(type, options={}) {
        if(type === "npm") {
            // TODO - Implement Publish:NPM
        } else {
            throw new Error(`Unrecognised type '${type}'.`);
        }
    }

    /**
     *
     * @param {Object} reports - Lint style reports to be displayed.
     * @returns {void}
     * @private
     */
    _reportJSCS(reports) {
        // { 'test/data/client_src/js/Circle.js':
        //     [ { line: 9,
        //         column: 21,
        //         message: 'validateQuoteMarks: Invalid quote mark found' } ],
        //         'test/data/client_src/js/Polygon.js': [],
        //     'test/data/client_src/js/Square.js': [],
        //     'test/data/client_src/js/index.js': [] }
        // console.error(reports);

        let issuesTotal = 0;
        console.log(`  Code Style Report:`);
        console.log(`  =================`);
        console.log("");

        for(let reportIdx in reports) {

            // Extract each report.
            let report = reports[reportIdx];
            let filename = reportIdx;

            if(report.length === 0) {
                console.log(`    ${color.green("✓")} '${filename}' ok.`);
            } else {
                console.log(`    ${color.red("✕")} '${filename}' - ${report.length} issue(s):`);
                for(let i = 0; i < report.length; i++) {
                    let result = report[i];

                    let line = result.line;
                    let column = result.column;
                    let msg = result.message;

                    issuesTotal++;
                    console.log(`        at line: ${line} col: ${column} - ${msg}.`);
                }
                console.log("");
            }
        }
        // console.log(`Test Report Summary:`);
        // console.log(`   \x1b[32mTests passed: (${testsPassed}/${testsTotal})\x1b[0m`);
        // if(testsFailed) {
        //     console.log(`   \x1b[31mTests failed: (${testsFailed}/${testsTotal})\x1b[0m`);
        // }

        console.log("");
    }

    /**
     *
     * @param {Object} reports - Lint quality reports to be displayed.
     * @returns {void}
     * @private
     */
    _reportJSHint(reports) {
        // {
        //     "result": [{
        //     "file": "test.js",
        //     "error": {
        //         "id": "(error)",
        //         "raw": "'{a}' is not defined.",
        //         "code": "W117",
        //         "evidence": "describe('jshint-json', function () {",
        //         "line": 6,
        //         "character": 1,
        //         "scope": "(main)",
        //         "a": "describe",
        //         "reason": "'describe' is not defined."
        //     }
        // }, {
        //     "file": "test.js",
        //     "error": {
        //         "id": "(error)",
        //         "raw": "'{a}' is not defined.",
        //         "code": "W117",
        //         "evidence": "\tit('should be used by JSHint', function () {",
        //         "line": 7,
        //         "character": 5,
        //         "scope": "(main)",
        //         "a": "it",
        //         "reason": "'it' is not defined."
        //     }
        // }],
        //     "data": [{
        //     "functions": [{
        //         "name": "\"jshint-json\"",
        //         "line": 6,
        //         "character": 35,
        //         "last": 26,
        //         "lastcharacter": 2,
        //         "metrics": {
        //             "complexity": 1,
        //             "parameters": 0,
        //             "statements": 1
        //         }
        //     }, {
        //         "name": "\"should be used by JSHint\"",
        //         "line": 7,
        //         "character": 46,
        //         "last": 25,
        //         "lastcharacter": 6,
        //         "metrics": {
        //             "complexity": 1,
        //             "parameters": 0,
        //             "statements": 5
        //         }
        //     }],
        //     "options": {
        //         "node": true,
        //         "esnext": true,
        //         "bitwise": true,
        //         "camelcase": true,
        //         "curly": true,
        //         "eqeqeq": true,
        //         "immed": true,
        //         "indent": 4,
        //         "(explicitIndent)": true,
        //         "latedef": true,
        //         "newcap": true,
        //         "noarg": true,
        //         "quotmark": "single",
        //         "regexp": true,
        //         "undef": true,
        //         "unused": true,
        //         "strict": true,
        //         "trailing": true,
        //         "smarttabs": true,
        //         "maxerr": 50
        //     },
        //     "errors": [{
        //         "id": "(error)",
        //         "raw": "'{a}' is not defined.",
        //         "code": "W117",
        //         "evidence": "describe('jshint-json', function () {",
        //         "line": 6,
        //         "character": 1,
        //         "scope": "(main)",
        //         "a": "describe",
        //         "reason": "'describe' is not defined."
        //     }, {
        //         "id": "(error)",
        //         "raw": "'{a}' is not defined.",
        //         "code": "W117",
        //         "evidence": "\tit('should be used by JSHint', function () {",
        //         "line": 7,
        //         "character": 5,
        //         "scope": "(main)",
        //         "a": "it",
        //         "reason": "'it' is not defined."
        //     }],
        //     "implieds": [{
        //         "name": "describe",
        //         "line": [
        //             6
        //         ]
        //     }, {
        //         "name": "it",
        //         "line": [
        //             7
        //         ]
        //     }],
        //     "globals": [
        //         "assert",
        //         "require",
        //         "jshint",
        //         "jsonReporter",
        //         "console"
        //     ],
        //     "member": {
        //         "run": 1,
        //         "reporter": 2,
        //         "log": 2,
        //         "args": 1
        //     },
        //     "file": "test.js"
        // }]
        // }

        // First we need to reduce and collate JSHint's verbose output.
        let reportsByFilename = {};
        reports = reports.result;
        for(let report of reports) {
            //console.log(">>" + report);
            if(reportsByFilename[report.file] === undefined) {
                reportsByFilename[report.file] = [report.error];
            } else {
                reportsByFilename[report.file].push(report.error);
            }
        }
        reports = reportsByFilename;
        // console.error(reports);

        console.log(`  Code Quality Report:`);
        console.log(`  ===================`);
        console.log("");

        let reportFilenames = Object.keys(reports);
        for(let i = 0; i < reportFilenames.length; i++) {

            let filename = reportFilenames[i];
            console.log(`    ${color.red("✕")} '${filename}' has issue(s):`);

            // Extract each issue report.
            // {
            //         "id": "(error)",
            //         "raw": "'{a}' is not defined.",
            //         "code": "W117",
            //         "evidence": "describe('jshint-json', function () {",
            //         "line": 6,
            //         "character": 1,
            //         "scope": "(main)",
            //         "a": "describe",
            //         "reason": "'describe' is not defined."
            // }
            let report = reports[filename];
            for(let j = 0; j < report.length; j++) {
                let issue = report[j];
                console.log(`        at line: ${issue.line} col: ${issue.character} - ${issue.reason}.`);
            }
        }
        // console.log(`Test Report Summary:`);
        // console.log(`   \x1b[32mTests passed: (${testsPassed}/${testsTotal})\x1b[0m`);
        // if(testsFailed) {
        //     console.log(`   \x1b[31mTests failed: (${testsFailed}/${testsTotal})\x1b[0m`);
        // }

        console.log("");
    }

    /**
     * Task for testing code. e.g. JS.
     * @param {string} type - Type of source file.
     * @param {Object} [options] - Options to override or extend this task's default configuration.
     * @param {string} options.debug - Enable debug reporting and/or (if available) source-maps.
     * @param {string} options.src - The source path for this task.
     * @param {string} options.coverage - Report on unit coverage.
     * @param {string} options.update - Update any test snapshots.
     * @returns {Object} - Returns self for chaining.
     */
    test(type, options={}) {

        // Log task execution
        if(options.isSilent !== true) {console.h2(`TASK: Testing ${type.toUpperCase()} with '${options.tooling}'...`);}

        // Select sub-task based on data type
        if(type === "js") {

            // Select test framework to use
            if(options.tooling === "bayeux") {

                // Create a user-level config from defaults/options
                let config = Object.assign(this.defaults.test.js.bayeux, options);

                // Resolve tool-level cmd-line toolArguments and toolOptions - with that user-level config
                let toolArgs = [config.src];
                let toolOptions = {
                    verbose: this.settings.debug || config.debug,   // i.e. debug/source map options
                    config: config.conf
                };

                // Finally map configuration to tool args and options
                this._execute(this.moduleDirectory, "./node_modules/.bin/bayeux", this.workingDirectory, toolArgs, toolOptions, config);

            } else if(options.tooling === "jest") {

                // Create a user-level config from defaults/options
                let config = Object.assign(this.defaults.test.js.jest, options);
                config.useInherit = true;

                // Resolve tool-level cmd-line toolArguments and toolOptions - with that user-level config
                // NOTE: We always use Warhorse conf file.
                //let src = path.resolve(this.workingDirectory, config.src);
                //let configPath = path.resolve(this.moduleDirectory, "./conf/jest.json");
                let toolArgs = [config.src];
                let toolOptions = {
                    verbose: this.settings.debug || config.debug   // i.e. debug/source map options
                    //config: configPath
                    //coverage: true
                };

                // Finally map configuration to tool args and options
                this._execute(this.moduleDirectory, "./node_modules/.bin/jest", this.workingDirectory, toolArgs, toolOptions, config);
            }
        } else {
            throw new Error(`Unrecognised type '${type}'.`);
        }

        // Return self for chaining.
        return this;
    }

    /**
     * Task for controlling VCSs. e.g. GIT
     * @param {string} type - Type of source file.
     * @param {Object} [options] - Options to override or extend this task's default configuration.
     * @param {string} options.debug - Enable debug reporting and/or (if available) source-maps.
     * @param {string} options.action - The versioning action to execute.
     * @returns {Object} - Returns self for chaining.
     */
    version(type, options={}) {
        if(type === "git") {
            switch(options.action) {
                case "get-branch-name":
                    console.h3("On branch: " + Git.getCurrentBranchName());
                    break;
                case "update-master":
                    Git.updateMaster(options.release, options.comment);
                    break;
                default:
                    throw new Error(`Unrecognised versioning action '${type}'.`);
            }
        } else {
            throw new Error(`Unrecognised type '${type}'.`);
        }
    }

    /**
     * Task for file watching.
     * @param {string} workingDirectory - Path of the project root directory.
     * @param {Object} options - Name of the project layout convention to follow.
     * @returns {Object} - Returns self for chaining.
     * @private
     */
    _cmdWatch(workingDirectory, options={}) {
        File.watch(workingDirectory);
    }
    
    _cmdCreateInner(convention, answers) {

        if(answers.warhorse === undefined) {
            throw new Error(`Create command failed.`);
        }

        // console.log("\nProject construction summary:");
        console.log(JSON.stringify(answers, null, "  "));

        let config = Object.assign(packageBase, answers);

        if(this.conventions.includes(convention)) {

            // Create convention infrastructure
            console.h2(`Creating infrastructure for convention '${convention}'.`);

            // // Using TAR.GZ
            // let archiveName = `warhorse_${convention}.tar.gz`;
            // shell.cp(`${this.conventionsDirectory}/${archiveName}`, this.workingDirectory);
            // tar.x({
            //     file: archiveName,
            //     sync: true,
            //     cwd: this.workingDirectory
            // });
            // shell.mv(`warhorse_${convention}`, config.name);
            // shell.rm(archiveName);

            // Using ZIP
            let archiveName = `warhorse_${convention}.zip`;
            shell.cp(`${this.conventionsDirectory}/${archiveName}`, this.workingDirectory);
            zipper.sync.unzip(archiveName).save("./");
            shell.mv(`warhorse_${convention}`, config.name);
            shell.rm(archiveName);

            let projectPath = path.resolve(this.workingDirectory, config.name);

            // Create a package.json for the new project
            let packageFile = fs.readFileSync(projectPath + "/package.json");
            let packageObj = JSON.parse(packageFile);

            // Create a package.json for the new project
            packageObj = Object.assign(packageObj, config);

            this.commands.map(function(cmdName) {
                packageObj.scripts[cmdName] = `warhorse ${cmdName}`;
            });

            delete packageObj.warhorse;

            let packageStr = JSON.stringify(packageObj, null, 2); // spacing level = 2
            fs.writeFileSync(projectPath + "/package.json", packageStr);

            // Create a license for the project
            let license = config.license;
            let licensePath = `${this.conventionsDirectory}_licenses/${license}.txt`;
            fs.writeFileSync(projectPath + "/LICENSE", fs.readFileSync(licensePath));

            // Move into the new project directory
            this.workingDirectory = projectPath;
            process.chdir(this.workingDirectory);

            // Install dependencies with a standard NPM install
            let stdout = child.execSync(`npm install`);
            if(stdout) {
                console.log(stdout.toString());
            }

        } else {
            console.warn("Warning: No Convention selected.  Exiting.");
        }
    }

    /**
     * Built-in 'create' command.  Starts an interactive session and then initialises a project similar to npm's 'init'.
     * @param {string} convention - Name of the project layout convention to follow.
     * @returns {Object} - Returns self for chaining.
     * @private
     */
    _cmdCreate(convention) {

        const questions = require(`./interactions/questions_${convention}`);

        let answers = questions();
        this._cmdCreateInner(convention, answers);

        // Return self for chaining.
        return this;
    }

    // /**
    //  * Load action.  Loads files being used for processing by the action that follows.
    //  * @param {Object} options - Options to further configure this action.
    //  * @returns {Object} - Returns self for chaining.
    //  */
    // load(options = {}) {
    //
    //     let config = Object.assign(this.settings.load, options);
    //
    //     // Accepts a single filepath only.
    //     let srcPath = this.file.path + this.file.name;
    //     console.h3(`Loading file: ${this.file.path + this.file.name}`);
    //
    //     this.file.content = fs.readFileSync(srcPath, config.encoding);
    //
    //     // Return self for chaining.
    //     return this;
    // }
    
    // /**
    //  * Rename task.  Allows modification/replacement/injection of file details into the sequence of actions.
    //  * @param {Object} options - Options to further configure this action.
    //  * @returns {Object} - Returns self for chaining.
    //  */
    // rename(options = {}) {
    //
    //     console.h3(`Renaming file: ${this.file.path}`);
    //
    //     let config = Object.assign(this.settings.save, options);
    //
    //     // Rename (i.e. overwrite) any values in the file object with the user-defined options object
    //     this.file = Object.assign(this.file, config);
    //
    //     // Return self for chaining.
    //     return this;
    // }

    /**
     * Splits a file path into its component parts.
     * @param {string} filePath - A standard system file or path name.
     * @returns {Object} - An object containing a destructured hash of the path's parts.
     * @private
     */
    _splitPath(filePath) {

        // Sanity check
        if(!filePath) {return null;}

        //console.h4(`Splitting file path: ${filePath}`); // e.g. /docs/index.html  // DEBUG ONLY

        let name = path.posix.basename(filePath);           // e.g. index.html
        let directory = path.dirname(filePath) + "/";       // e.g. /docs/
        let stem = name.slice(0, name.lastIndexOf("."));    // e.g. index
        let extension = path.extname(filePath);             // e.g. .html

        // console.log(`name: ${name}`);
        // console.log(`directory: ${directory}`);
        // console.log(`stem: ${stem}`);
        // console.log(`extension: ${extension}`);

        // Is it a config file e.g. .jshintrc
        let config = false;
        if(extension === "" && name.length > 0 && name[0] === "." && name.slice(-2) === "rc") {
            config = true;
        }
        return {
            original: filePath,
            path: directory, // Note: We use 'directory' to avoid nameclash with the module of the same name.
            name: name,
            stem: stem,
            extension: extension,
            config: config
        };
    }

    // /**
    //  * Save action.
    //  * @param {string} dstPath - The file path that this file will be saved to.
    //  * @param {Object} options - Options to further configure this action.
    //  * @returns {Object} - Returns self for chaining.
    //  */
    // save(dstPath, options = {}) {
    //
    //     let config = Object.assign(this.settings.save, options);
    //
    //     console.h3(`Saving file to: ${dstPath}`);
    //
    //     if(config.compress === true) {
    //         fs.writeFileSync(dstPath, this.file.content, config.encoding);
    //         child.execSync(`tar -zcvf ${dstPath + ".tar.gz"} ${dstPath}`);
    //     } else {
    //         fs.writeFileSync(dstPath, this.file.content, config.encoding);
    //     }
    //
    //     // Return self for chaining.
    //     return this;
    // }

    /**
     *
     * @param {string} warhorseDirectory
     * @param {string} relativeExecutablePath
     * @param {string} workingDirectory
     * @param {Array} args
     * @param {Object} argOptions
     * @param {Object} options
     * @returns {Warhorse}
     * @private
     */
    _execute(warhorseDirectory, relativeExecutablePath, workingDirectory, args=[], argOptions={}, options={}) {

        // First make sure that certain default options are set for sucessful command line operation.
        let defaults = {debug: false, useOutput: "stdout", stdio: "inherit", useEqualsSign: false};
        options = Object.assign(defaults, options);

        // Next, define working directory
        workingDirectory = path.resolve(workingDirectory);

        // Construct final cmdLine.
        let executablePath = path.resolve(this.moduleDirectory, relativeExecutablePath);
        let cmdLine = Cli._compileCmdLine(executablePath, args, argOptions, options);
        //if(options.debug) {console.log("Executing: " + cmdLine);}
        // console.log("Executing: " + cmdLine);

        let stdout = null; let stderr = null;
        try {
            stdout = child.execSync(cmdLine, {cwd: workingDirectory, stdio: options.stdio});
        } catch(ex) {
            //console.error(ex.message);
            stdout = ex.stdout;
            stderr = ex.stderr;
        }

        if(stdout !== null) {
            let output = "";
            switch(options.useOutput) {
                case "silent":
                    // console.log(">> SILENT");
                    break;
                case "stdout":
                    console.log(stdout.toString());
                    break;
                case "jscs":
                    output = stdout.toString();
                    if(output !== "") {
                        try {
                            output = JSON.parse(output);
                            this._reportJSCS(output);
                        } catch(err) {
                            console.warn("Could not report on JS 'style' lint data.");
                        }
                    } else {
                        console.log("Nothing to report.");
                    }
                    break;
                case "jshint":
                    output = stdout.toString();
                    if(output !== "") {
                        try {
                            output = JSON.parse(output);
                            if(output !== "" && output.result.length) {
                                this._reportJSHint(output);
                            } else {
                                console.log("Nothing to report.");
                            }
                        } catch(err) {
                            console.warn("Could not report on JS 'quality' lint data.");
                        }
                    } else {
                        console.log("Nothing to report.");
                    }
                    break;
                case "tape":
                    // console.log(">> TAPE");
                    this._reportTape(stdout.toString());
                    break;
                default:
                    // console.log(">> STDOUT");
                    console.log(stdout.toString());
            }
        }

        // Return self for chaining.
        return this;
    }

    //
    // /**
    //  * Private helper for load().
    //  * @param {string} globPath - A filename, filepath or globpath.
    //  * @param {Function} task - The task to be executed.
    //  * @param {Object} options - Options to further configure the task actions.
    //  * @returns {void}
    //  * @private
    //  */
    // _use(globPath, task, options) {
    //     //console.h3(`Parsing: ${globPath}`);
    //
    //     // Sync filesystem check
    //     let filePaths = glob.sync(globPath);
    //     if(filePaths.constructor === Array && filePaths.length > 0) {
    //         for(let filePath of filePaths) {
    //             this.file = this._splitPath(filePath);
    //             task(options);
    //         }
    //     } else {
    //         console.warn("No files matched.");
    //     }
    // }

    /**
     * Executes the named command or task.
     * @param {string} name - Name of the command or task to execute.
     * @returns {Object} - Returns self for chaining.
     */
    execute(name) {
        if(this.commands.includes(name)) {
            let cmd = this.cmds[name];
            if(cmd !== null) {cmd();}
            return this;    // Return self for chaining.
        } else {
            throw new Error(`Unrecognised command '${name}'.`);
        }

        // Return self for chaining.
        return this;
    }

    /**
     * Execute command from the CLI.
     * @param {string} args - Arguments passed from the command line interface.
     * @returns {Object} - Returns self for chaining.
     * @private
     */
    cli(args) {
        console.h0(`WARHORSE active...`);
        let [cmdName, convention="module"] = args;

        console.h1(`COMMAND ${cmdName}`);

        // Handle the 'create' built-in separately
        if(cmdName === "create") {
            if(this.conventions.includes(convention)) {
                this._cmdCreate(convention);
            } else {
                throw new Error(`Unrecognised project convention: '${convention}'.`);
            }
            return null; // Success or fail - nothing to return.
        } else if(cmdName === "watch") {
            this._cmdWatch(this.workingDirectory);
            return null; // Success or fail - nothing to return.
        } else {
            // Handle standard built-ins
            let cmd = this.cmds[cmdName];
            if(cmd !== null) {
                //console.log("Executing command type: " + typeof cmd);
                cmd();
            }
        }

        console.h0(`WARHORSE done.`);

        // Return self for chaining.
        return this;
    }
}

// Exports
module.exports = Warhorse;

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

// Default values and templates
let defaults = require("./conf/defaults");
// const defaults = require("./conf/defaults_testing");
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

        this.debug = options.debug;

        this.language = "es51" || options.language; // Options: "es51", "es2015"

        this.commands = ["build", "create", "deploy", "distribute", "publish", "test", "watch"]; //FIXME - replace with Object.keys(warhorse.tasks);
        this.conventions = ["client", "fullstack", "library", "module", "server"];
        this.deployments = ["browser", "cordova", "node"]; //TODO "electron" deployment,
        this.types = ["css", "gif", "html", "ico", "jpg", "js", "less", "png", "sass", "svg"];
        this.pipelineTypes = ["build", "distribute", "test"];

        this.moduleDirectory = moduleDirectory;     // i.e. Warhorse's own directory
        this.conventionsDirectory = moduleDirectory + "src/conventions/";
        this.workingDirectory = workingDirectory;   // Current working directory... i.e. project directory
    }

    ///////////////////////////////////////////////////////////////////////////
    // COMMANDS
    ///////////////////////////////////////////////////////////////////////////

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
            let originalDirectory = this.workingDirectory;
            this.workingDirectory = projectPath;
            process.chdir(this.workingDirectory);

            // Install dependencies with a standard NPM install
            let stdout = child.execSync(`npm install`);
            if(stdout) {
                console.log(stdout.toString());
            }

            // Restore working directory.
            this.workingDirectory = originalDirectory;
            process.chdir(this.workingDirectory);

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

        // let exampleAnswers = {
        //     "warhorse":{},
        //     "name":"myproject",
        //     "description":"Somthing or other",
        //     "author":"Kyle S",
        //     "email":"kas@kas.com",
        //     "version":"0.0.0",
        //     "license":"AGPL-3.0"
        // };

        if(convention === "fullstack") {

            // Create new directory and make it the working directory.
            shell.mkdir(answers.name);
            let originalDirectory = this.workingDirectory;
            let projectDirectory = path.resolve(this.workingDirectory, answers.name);
            this.workingDirectory = projectDirectory;
            shell.cd(this.workingDirectory);

            let serverAnswers = JSON.parse(JSON.stringify(answers));
            serverAnswers.name = "server";
            serverAnswers.description = "Server: " + serverAnswers.description;
            //console.log("SERVER: " + JSON.stringify(serverAnswers));
            this._cmdCreateInner("server", serverAnswers);

            let clientAnswers = JSON.parse(JSON.stringify(answers));
            clientAnswers.name = "client";
            clientAnswers.description = "Client: " + clientAnswers.description;
            this._cmdCreateInner("client", clientAnswers);

            // Restore working directory.
            this.workingDirectory = originalDirectory;
            shell.cd(this.workingDirectory);
        } else {
            this._cmdCreateInner(convention, answers);
        }

        // Return self for chaining.
        return this;
    }

    /**
     * Built-in 'deploy' command.  Configure a projects build process to target a particular platform/framework.
     * @param {string} target - Name of the target platorm/framework.
     * @returns {Object} - Returns self for chaining.
     * @private
     */
    _cmdDeploy(target) {

        switch(target) {
            case "cordova":

                // Remove current dist/
                shell.rm("-rf", "./dist");

                // Using ZIP
                let archiveName = `deploy_${target}.zip`;
                shell.cp(`${this.conventionsDirectory}/${archiveName}`, this.workingDirectory);
                zipper.sync.unzip(archiveName).save("./");
                shell.rm(archiveName);

                // // Install dependencies with a standard NPM install
                // let stdout = child.execSync(`npm install --save-dev cordova`);
                // if(stdout) {
                //     console.log(stdout.toString());
                // }

                break;
            case "electron":
                break;
            case "react.native":
                break;
            default:
                throw new Error(`Unrecognised deployment target configuration: '${target}'.`);
        }

        // Return self for chaining.
        return this;
    }

    /**
     * Task for file watching.
     * @param {string} workingDirectory - Path of the project root directory.
     * @param {Object} options - Name of the project layout convention to follow.
     * @returns {Object} - Returns self for chaining.
     * @private
     */
    _cmdWatch(workingDirectory, pipelineType, options) {
        if(this.pipelineTypes.includes(pipelineType)) {
            File.watch(path.resolve(workingDirectory), pipelineType, options);
        } else {
            console.error(`Error: Unrecognised pipeline type '${pipelineType}'.`);
        }
    }


    ///////////////////////////////////////////////////////////////////////////
    // TASKS
    ///////////////////////////////////////////////////////////////////////////

    /**
     * Clean/ delete file(s) task.
     * @param {string} type - Type of source file.
     * @param {string} config - The tool configuration.
     * @param {Object} [options] - Options to override or extend this task's default configuration.
     * @returns {Object} - Returns self for chaining.
     * @private
     */
    // clean(paths, options = {}) {
    //     // Log task execution
    //     if(options.silent !== true) {console.h2(`TASK: Cleaning project...`);}
    //
    //     shell.rm("-rf", ...paths);
    //     console.h4(`Done.`);
    // }
    clean(type, config, options = {}) {
        shell.rm("-rf", path.resolve(this.workingDirectory, "./dist/*"));
    }

    /**
     * Copy file(s) task.
     * @param {string} type - Type of source file.
     * @param {string} config - The tool configuration.
     * @param {Object} [options] - Options to override or extend this task's default configuration.
     * @param {string} options.src - The source path for this task.
     * @param {string} options.dst - The destination/target path for this task.
     * @returns {Object} - Returns self for chaining.
     * @private
     */
    copy(type, config, options = {}) {

        if(options.recurse === true) {
            shell.cp("-R", config.src, config.dst);
        } else {
            shell.cp(config.src, config.dst);
        }
    }

    /**
     * Task for bundling and module resolution.
     * @param {string} type - Type of source file.
     * @param {string} config - The tool configuration.
     * @param {Object} [options] - Options to override or extend this task's default configuration.
     * @param {string} options.debug - Enable debug reporting and/or (if available) source-maps.
     * @param {string} options.src - The source path for this task.
     * @param {string} options.dst - The destination/target path for this task.
     * @param {string} options.exclude - Exclude file(s) from the task.
     * @param {string} options.include - Include file(s) for the task.
     * @returns {Object} - Returns self for chaining.
     * @private
     */
    bundle(type, config, options={}) {

        // Select sub-task based on data type
        if(type === "js") {

            // Resolve tool-level cmd-line toolArguments and toolOptions - with that user-level config
            let toolArgs = [config.src];
            let toolOptions = {
                debug: this.debug || config.debug,   // i.e. debug/source map options
                config: config.conf,
                outfile: config.dst,
                exclude: config.exclude,
                external: config.include,
                recurse: true
            };
            if(this.language !== "es51") {
                toolOptions.transform = `[babelify --presets [${this.language}]]`;
            }

            // Ensure that the destination directory actually exists... or if not, create it.
            ensureTargetDirectory(this.workingDirectory, path.dirname(config.dst));
            // let dst = path.resolve(this.workingDirectory, config.dst);
            // let dstPath = path.dirname(dst);
            // shell.mkdir("-p", dstPath);

            // Finally map configuration to tool args and options
            this._execute(this.moduleDirectory, "./node_modules/.bin/browserify", this.workingDirectory, toolArgs, toolOptions, options);

        } else {
            throw new Error(`Unrecognised type '${type}'.`);
        }

        // Return self for chaining.
        return this;
    }

    /**
     * Task for compressing files of any type. e.g. JS, CSS, TXT. [NOTE: CURRENTLY OUTPUTS .tar.gz ONLY.]
     * @param {string} type - Type of source file.
     * @param {string} config - The tool configuration.
     * @param {Object} [options] - Options to override or extend this task's default configuration.
     * @param {string} options.debug - Enable debug reporting and/or (if available) source-maps.
     * @param {string} options.src - The source path for this task.
     * @param {string} options.dst - The destination/target path for this task.
     * @returns {Object} - Returns self for chaining.
     * @private
     */
    compress(type, config, options={}) {

        // Select sub-task based on data type
        if(["css", "html", "js", "md", "txt"].includes(type)) {

            // Resolve tool-level cmd-line toolArguments and toolOptions - with that user-level config
            let toolArgs = [config.src];
            let toolOptions = {
                sync: true,
                gzip: true,
                cwd: this.workingDirectory,
                file: config.dst
            };

            // Ensure that the destination directory actually exists... or if not, create it.
            ensureTargetDirectory(this.workingDirectory, path.dirname(config.dst));

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

                // Resolve tool-level cmd-line toolArguments and toolOptions - with that user-level config
                let toolArgs = [config.src];
                let toolOptions = {
                    map: this.debug || config.debug,   // i.e. debug/source map options
                    "out-dir": config.dst,
                    plugin: plugin
                };

                // Ensure that the destination directory actually exists... or if not, create it.
                ensureTargetDirectory(this.workingDirectory, path.dirname(config.dst));

                // Finally map configuration to tool args and options
                this._execute(this.moduleDirectory, "./node_modules/.bin/imagemin", this.workingDirectory, toolArgs, toolOptions, options);
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
     * @param {string} config - The tool configuration.
     * @param {Object} [options] - Options to override or extend this task's default configuration.
     * @param {string} options.debug - Enable debug reporting and/or (if available) source-maps.
     * @param {string} options.src - The source path for this task.
     * @param {string} options.dst - The destination/target path for this task.
     * @returns {Object} - Returns self for chaining.
     * @private
     */
    document(type, config, options={}) {

        // Select sub-task based on data type
        if(type === "js") {

            // Resolve tool-level cmd-line toolArguments and toolOptions - with that user-level config
            // NOTE: We always use Warhorse conf file.
            let src = path.resolve(this.workingDirectory, config.src);
            let dst = path.resolve(this.workingDirectory, config.dst);
            let configPath = path.resolve(this.moduleDirectory, "./conf/jsdoc.json");
            let toolArgs = [config.src];
            let toolOptions = {
                verbose: this.debug || config.debug,   // i.e. debug/source map options
                configure: configPath,
                destination: config.dst,
                recurse: true
            };

            // Ensure that the destination directory actually exists... or if not, create it.
            ensureTargetDirectory(this.workingDirectory, dst);

            // Finally map configuration to tool args and options
            this._execute(this.moduleDirectory, "./node_modules/.bin/jsdoc", this.moduleDirectory, toolArgs, toolOptions, options);

        } else {
            throw new Error(`Unrecognised type '${type}'.`);
        }

        // Return self for chaining.
        return this;
    }

    /**
     * Task for linting source and template code. e.g. JS, LESS, SASS.
     * @param {string} type - Type of source file.
     * @param {string} config - The tool configuration.
     * @param {Object} [options] - Options to override or extend this task's default configuration.
     * @param {string} options.debug - Enable debug reporting and/or (if available) source-maps.
     * @param {string} options.src - The source path for this task.
     * @param {string} options.dst - The destination/target path for this task.
     * @param {string} options.exclude - Exclude file(s) from the task.
     * @param {string} options.include - Include file(s) for the task.
     * @returns {Object} - Returns self for chaining.
     * @private
     */
    lint(type, config, options={}) {

        // Select sub-task based on data type
        if(type === "js:style") {

            // Create a user-level config from defaults/options
            // NOTE: We always use Warhorse conf file.
            let src = path.resolve(this.workingDirectory, config.src[0], config.src[1]);
            let configPath = path.resolve(this.moduleDirectory, "./conf/jscs.json");

            // Resolve tool-level cmd-line toolArguments and toolOptions - with that user-level config
            let toolArgs = [src];
            let toolOptions = {
                config: configPath,
                reporter: "json"
            };

            // Finally map configuration to tool args and options
            this._execute(this.moduleDirectory, "./node_modules/.bin/jscs", this.moduleDirectory, toolArgs, toolOptions, options);

        } else if(type === "js:quality") {

            // Create a user-level config from defaults/options
            // NOTE: We always use Warhorse conf file.
            let src = path.resolve(this.workingDirectory, config.src[0], config.src[1]);
            let configPath = path.resolve(this.moduleDirectory, "./conf/jshint.json");

            // Resolve tool-level cmd-line toolArguments and toolOptions - with that user-level config
            let toolArgs = [src];
            let toolOptions = {
                config: configPath,
                reporter: path.resolve(this.moduleDirectory, "./node_modules/jshint-json/json.js")
            };

            // Finally map configuration to tool args and options
            this._execute(this.moduleDirectory, "./node_modules/.bin/jshint", this.moduleDirectory, toolArgs, toolOptions, options);

        } else {
            throw new Error(`Unrecognised type '${type}'.`);
        }

        // Return self for chaining.
        return this;
    }

    /**
     * Task for minifying distributed code. e.g. JS, CSS.
     * @param {string} type - Type of source file.
     * @param {string} config - The tool configuration.
     * @param {Object} [options] - Options to override or extend this task's default configuration.
     * @param {string} options.debug - Enable debug reporting and/or (if available) source-maps.
     * @param {string} options.src - The source path for this task.
     * @param {string} options.dst - The destination/target path for this task.
     * @param {string} options.exclude - Exclude a file from the output bundle. Can be globs.
     * @param {string} options.include - Include a file from another bundle. Can be globs.
     * @returns {Object} - Returns self for chaining.
     * @private
     */
    minify(type, config, options={}) {

        // Select sub-task based on data type
        if(type === "js") {

            // Resolve tool-level cmd-line toolArguments and toolOptions - with that user-level config
            let toolArgs = [config.src];
            let toolOptions = {
                verbose: this.debug || config.debug,   // i.e. debug/source map options
                "config-file": config.conf,
                output: config.dst,
                compress: true,
                mangle: true
            };

            // Ensure that the destination directory actually exists... or if not, create it.
            ensureTargetDirectory(this.workingDirectory, path.dirname(config.dst));

            // Finally map configuration to tool args and options
            this._execute(this.moduleDirectory, "./node_modules/.bin/uglifyjs", this.workingDirectory, toolArgs, toolOptions, options);

        } else if(type === "css") {

            // Resolve tool-level cmd-line toolArguments and toolOptions - with that user-level config
            let toolArgs = [];
            let toolOptions = {
                debug: this.debug || config.debug,   // i.e. debug/source map options
                map: this.debug || config.debug,   // i.e. debug/source map options
                input: config.src,
                output: config.dst
            };

            // Ensure that the destination directory actually exists... or if not, create it.
            ensureTargetDirectory(this.workingDirectory, path.dirname(config.dst));

            // Finally map configuration to tool args and options
            this._execute(this.moduleDirectory, "./node_modules/.bin/csso", this.workingDirectory, toolArgs, toolOptions, options);

        } else if(type === "html") {

            // Resolve tool-level cmd-line toolArguments and toolOptions - with that user-level config
            let toolArgs = [config.src];
            let toolOptions = {
                debug: this.debug || config.debug,   // i.e. debug/source map options
                "config-file": path.resolve(this.moduleDirectory, "./conf/html_minifier.json"),
                output: config.dst
            };

            // Ensure that the destination directory actually exists... or if not, create it.
            ensureTargetDirectory(this.workingDirectory, path.dirname(config.dst));

            // Finally map configuration to tool args and options
            this._execute(this.moduleDirectory, "./node_modules/.bin/html-minifier", this.workingDirectory, toolArgs, toolOptions, options);

        } else {
            throw new Error(`Unrecognised type '${type}'.`);
        }

        // Return self for chaining.
        return this;
    }

    /**
     * Task for preprocessing template code. e.g. Handlebars, LESS, SASS.
     * @param {string} type - Type of source file.
     * @param {string} config - The tool configuration.
     * @param {Object} [options] - Options to override or extend this task's default configuration.
     * @param {string} options.debug - Enable debug reporting and/or (if available) source-maps.
     * @param {string} options.src - The source path for this task.
     * @param {string} options.dst - The destination/target path for this task.
     * @param {string} options.exclude - Exclude file(s) from the task.
     * @param {string} options.include - Include file(s) for the task.
     * @returns {Object} - Returns self for chaining.
     * @private
     */
    preprocess(type, config, options={}) {

        // Select sub-task based on data type
        if(type === "less") {

            // Resolve tool-level cmd-line toolArguments and toolOptions - with that user-level config
            let toolArgs = [config.src, config.dst];
            let toolOptions = {
                "source-map": this.debug || config.debug,   // i.e. debug/source map options
                "include-path": config.include,
                "relative-urls": true
            };

            // Ensure that the destination directory actually exists... or if not, create it.
            ensureTargetDirectory(this.workingDirectory, path.dirname(config.dst));

            // Finally map configuration to tool args and options
            this._execute(this.moduleDirectory, "./node_modules/.bin/lessc", this.workingDirectory, toolArgs, toolOptions, options);

        } else if(type === "sass") {

            // Resolve tool-level cmd-line toolArguments and toolOptions - with that user-level config
            let toolArgs = [config.src, config.dst];
            let toolOptions = {
                "source-map": this.debug || config.debug,   // i.e. debug/source map options
                "include-path": config.include,
                "relative-urls": true
            };

            // Ensure that the destination directory actually exists... or if not, create it.
            ensureTargetDirectory(this.workingDirectory, path.dirname(config.dst));

            // Finally map configuration to tool args and options
            this._execute(this.moduleDirectory, "./node_modules/.bin/node-sass", this.workingDirectory, toolArgs, toolOptions, options);

        } else {
            throw new Error(`Unrecognised type '${type}'.`);
        }

        // Return self for chaining.
        return this;
    }

    /**
     * Task for post-processing source code. e.g. CSS.
     * @param {string} type - Type of source file.
     * @param {string} config - The tool configuration.
     * @param {Object} [options] - Options to override or extend this task's default configuration.
     * @param {string} options.debug - Enable debug reporting and/or (if available) source-maps.
     * @param {string} options.src - The source path for this task.
     * @param {string} options.dst - The destination/target path for this task.
     * @returns {Object} - Returns self for chaining.
     * @private
     */
    postprocess(type, config, options={}) {

        if(type === "css") {

            // Resolve tool-level cmd-line toolArguments and toolOptions - with that user-level config
            let toolArgs = [config.src];
            let toolOptions = {
                map: this.debug || config.debug,   // i.e. debug/source map options
                output: config.dst,
                replace: true
            };
            // if(path.extname(config.dst) === "") {
            //     toolOptions.dir = config.dst;
            // } else {
            //     toolOptions.output = config.dst;
            // }

            // Ensure that the destination directory actually exists... or if not, create it.
            ensureTargetDirectory(this.workingDirectory, path.dirname(config.dst));

            // Finally map configuration to tool args and options
            this._execute(this.moduleDirectory, "./node_modules/.bin/postcss", this.workingDirectory, toolArgs, toolOptions, options);

        } else {
            throw new Error(`Unrecognised type '${type}'.`);
        }

        // Return self for chaining.
        return this;
    }

    /**
     * TODO: IMPLEMENT Task for publishing the distribution to cloud services. e.g. NPM.
     * @param {string} type - Type of source file.
     * @param {string} config - The tool configuration.
     * @param {Object} [options] - Options to override or extend this task's default configuration.
     * @param {string} options.debug - Enable debug reporting and/or (if available) source-maps.
     * @param {string} options.src - The source path for this task.
     * @param {string} options.dst - The destination/target path for this task.
     * @returns {Object} - Returns self for chaining.
     * @private
     */
    publish(type, config, options={}) {
        if(type === "npm") {
            // TODO - Implement Publish:NPM
        } else {
            throw new Error(`Unrecognised type '${type}'.`);
        }
    }


    /**
     * Task for testing code. e.g. JS.
     * @param {string} type - Type of source file.
     * @param {string} config - The tool configuration.
     * @param {Object} [options] - Options to override or extend this task's default configuration.
     * @param {string} options.debug - Enable debug reporting and/or (if available) source-maps.
     * @param {string} options.src - The source path for this task.
     * @param {string} options.coverage - Report on unit coverage.
     * @param {string} options.update - Update any test snapshots.
     * @returns {Object} - Returns self for chaining.
     * @private
     */
    test(type, config, options={}) {

        // Select sub-task based on data type
        if(type === "js") {

            // Create a user-level config from defaults/options
            // Create a user-level config from defaults/options
            config.useInherit = true;

            // Resolve tool-level cmd-line toolArguments and toolOptions - with that user-level config
            // NOTE: We always use Warhorse conf file.
            let src = path.resolve(this.workingDirectory, config.src[0], config.src[1]);
            //let configPath = path.resolve(this.moduleDirectory, "./conf/jest.json");
            let toolArgs = [src];
            let toolOptions = {
                verbose: this.debug || config.debug   // i.e. debug/source map options
                //config: configPath
                //coverage: true
            };

            // Finally map configuration to tool args and options
            this._execute(this.moduleDirectory, "./node_modules/.bin/jest", this.workingDirectory, toolArgs, toolOptions, options);

        } else {
            throw new Error(`Unrecognised type '${type}'.`);
        }

        // Return self for chaining.
        return this;
    }

    /**
     * Task for controlling VCSs. e.g. GIT
     * @param {string} type - Type of source file.
     * @param {string} config - The tool configuration.
     * @param {Object} [options] - Options to override or extend this task's default configuration.
     * @param {string} options.debug - Enable debug reporting and/or (if available) source-maps.
     * @param {string} options.action - The versioning action to execute.
     * @returns {Object} - Returns self for chaining.
     * @private
     */
    version(type, config, options={}) {
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

        // Return self for chaining.
        return this;
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

    /**
     *
     * @param srcRoot
     * @param srcPath
     * @param dstRoot
     * @param dstExt
     * @private
     */
    _resolveDst(srcRoot, srcPath, dstRoot, dstExt) {
        let srcRootAbsolute = path.resolve(srcRoot);                        // e.g. /home/kas/project/engine/src
        //console.log("srcRootAbsolute: " + srcRootAbsolute);
        let srcPathAbsolute = path.resolve(srcPath);                        // e.g. /home/kas/project/engine/src/js/Engine.js
        //console.log("srcPathAbsolute: " + srcPathAbsolute);

        // srcPath MUST be a subset of srcRoot thus...
        let relativeFilePath = "." + srcPathAbsolute.slice(srcRootAbsolute.length);   // e.g. /js/Engine.js
        //console.log("relativeFilePath: " + relativeFilePath);
        let relativePath = path.dirname(relativeFilePath);                  // e.g. /js
        //console.log("relativePath: " + relativePath);
        let srcFileStem = path.basename(srcPath, path.extname(srcPath));
        //console.log("srcFileStem: " + srcFileStem);
        let dstFileName = srcFileStem + dstExt;
        //console.log("dstFileName: " + dstFileName);
        let dstRootAbsolute = path.resolve(dstRoot);                        // e.g. /home/kas/project/engine/dist
        //console.log("dstRootAbsolute: " + dstRootAbsolute);
        let dstPathAbsolute = path.resolve(dstRootAbsolute, relativePath, dstFileName);                       // e.g. /home/kas/project/engine/dist/js/Engine.js
        //console.log("dstPathAbsolute: " + dstPathAbsolute);
        return dstPathAbsolute;
    }

    /**
     *
     * @param toolConfig
     * @param task
     * @private
     */
    _executeTask(toolConfig, task) {

        // Log task execution
        if(toolConfig.silent !== true) {console.h2(`TASK: ${toolConfig.desc}...`);}

        // console.log(`Executing task: ${task.idn}`); // DEBUG ONLY
        // console.log("with details: " + JSON.stringify(task)); // DEBUG ONLY
        // console.log("and config: " + JSON.stringify(toolConfig)); // DEBUG ONLY

        let [taskMethod, taskType, taskSubtype] = task.idn.split(":");
        if(taskSubtype !== undefined) {
            taskType = taskType + ":" + taskSubtype; // Reform the type e.g. js:style
        }
        if(toolConfig.expandGlobs === true) {
            let srcPaths = glob.sync(path.resolve(task.src[0], task.src[1]));
            // console.log(`and a src glob that has resolved into ${srcPaths.length} paths.`); // DEBUG ONLY
            if(srcPaths.constructor === Array && srcPaths.length > 0) {
                for(let src of srcPaths) {
                    let expandedTask = JSON.parse(JSON.stringify(task)); // Cheap, tacky - but effective - clone!
                    expandedTask.src = src;
                    expandedTask.dst = this._resolveDst(task.src[0], src, task.dst[0], task.dst[1]);//src.replace("src", "dist");
                    // e.g. this.bundle("js", {src: ..., dst: ...});
                    this[taskMethod](taskType, expandedTask, toolConfig);
                }
            } else {
                console.warn("No files matched.");
            }
        } else {
            // e.g. this.bundle("js", {src: ..., dst: ...});
            this[taskMethod](taskType, task, toolConfig);
        }

        // Log task ending
        if(toolConfig.silent !== true) {console.h4(`Done.`);}
    }

    /**
     *
     * @param buildType
     * @param pipeline
     * @private
     */
    _executePipeline(buildType, pipeline) {
        //console.log(`Executing pipeline for: ${buildType}`);
        let toolConfigs = defaults.tools[buildType];
        // console.log("Pipeline: " + JSON.stringify(pipeline));

        for(let task of pipeline) {
            let toolConfig = toolConfigs[task.idn];
            this._executeTask(toolConfig, task);
        }
    }

    /**
     *
     * @param args
     * @param userConfig
     * @returns {Warhorse}
     * @private
     */
    command(args, userConfig={}) {

        defaults = Object.assign(defaults, userConfig);

        // Determine command and any arguments
        // warhorse <cmdName> <type>
        // warhorse distribute
        // warhorse build less
        // warhorse create module
        // warhorse deploy cordova
        // warhorse test js
        // warhorse test
        // warhorse watch
        let cmdName = args[0];
        let arg1 = args[1];
        // console.log("ARGS: " + JSON.stringify(args));

        // If an invalid command is given - don't error - just exit gracefully.
        if(this.commands.includes(cmdName)) {

            console.h0(`WARHORSE active...`);

            console.h1(`COMMAND ${cmdName}`);

            // Handle built-in commands separately
            switch(cmdName) {
                case "create":
                    if(this.conventions.includes(arg1)) {
                        this._cmdCreate(arg1);
                    } else {
                        // If an invalid convention is given - don't error - just exit gracefully.
                        console.h0(`WARHORSE done.`);
                        console.error(`Error: Unrecognised project convention: '${arg1}'.`);
                        return this;
                    }
                    break;
                case "deploy":
                    if(this.deployments.includes(arg1)) {
                        this._cmdDeploy(arg1);
                    } else {
                        // If an invalid deployment is given - don't error - just exit gracefully.
                        console.h0(`WARHORSE done.`);
                        console.error(`Error: Unrecognised project deployment: '${arg1}'.`);
                        return this;
                    }
                    break;
                case "watch":
                    this._cmdWatch(this.workingDirectory, arg1, defaults);
                    break;
                case "build":
                case "test":
                case "distribute":
                    // Handle standard built-ins
                    let pipelines = defaults.pipelines[cmdName];
                    let pipeline = null;

                    // If it's not specifying a type then...
                    if(arg1 === undefined) {
                        // ...execute the entire pipeline for all types
                        for(let type in pipelines) {
                            //console.log("TYPE: " + type);
                            pipeline = pipelines[type];
                            if(pipeline.length > 0) {
                                this._executePipeline(cmdName, pipeline);
                            }
                        }
                    } else if(this.types.includes(arg1)) {
                        // Otherwise check the type exists - then process just that type
                        pipeline = pipelines[arg1];
                        if(pipeline.length > 0) {
                            this._executePipeline(cmdName, pipeline);
                        }
                    } else {
                        console.error(`Error: Unrecognised source type: '${arg1}'.`);
                        return this;
                    }
                    break;
                default:
                    console.error(`Error: Command recognized but unable to complete: '${cmdName}'.`);
            }
            console.h0(`WARHORSE done.`);
        } else {
            console.error(`Error: Unrecognised command: '${cmdName}'.`);
            return this;
        }

        // Return self for chaining.
        return this;
    }
}

// Exports
module.exports = Warhorse;

/**
 * @file Warhorse.js
 * @description The main Warhorse daemon.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const child = require("child_process");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const glob = require("glob");
const inquirer = require("inquirer");
const shell = require("shelljs");

// const browserify = require("browserify");
const csso = require("csso");
const jscs = require("jscs");
const jshint = require("jshint").JSHINT;

//const less = require("less");
const sass = require("node-sass");
const uglify = require("uglify-es");
const jest = require("jest-cli");

// Default templates
const packageBase = require("../conventions/package_base.json");

// Setup console
const log = require("./Pageant");

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
     * @param {Object} options - Configuration options to override Warhorse's own defaults.
     */
    constructor(moduleDirectory, workingDirectory, options = {}) {
        this.defaults = {
            
            language: ["es51", "es2015", "es2015+JSX"],

            bundle: {
                transpile: true
            },
            clean: {},
            document: {
                src: "./src",
                dst: "./docs/api"
            },
            init: {
                name: "Untitled",
                version: "0.0.0",
                description: "A new project generated by the Warhorse task runner.",
                keywords: ["javascript"],
                author: "undefined",
                email: "undefined@undefined.com",
                license: "GPL-3.0"
            },
            lint: {
                js: {
                    style: require("../../conf/jscs.json"),
                    syntax: require("../../conf/jshint.json")
                }
            },
            load: {
                encoding: "utf8"
            },
            minify: {},
            pack: {
                gif: {},
                jpg: {},
                png: {},
                svg: {}
            },
            precompile: {
                includePaths: ["./src/sass"]
            },
            rename: {},
            save: {
                compress: false,
                encoding: "utf8"
            },
            test: require("../../conf/jest.json")
        };
        this.settings = Object.assign(this.defaults, options);

        this.linterJSStyle = new jscs();
        this.linterJSStyle.registerDefaultRules();
        // this.linterJSStyle.configure(confJSCS);
        this.linterJSSyntax = jshint; // Note: JSHint is IFFY.
        this.linterJSStats = {errors: 0, warnings: 0};

        this.commands = ["build", "clean", "create", "distribute", "document", "init", "lint", "pack", "precompile", "test"]; //FIXME - replace with Object.keys(warhorse.tasks);
        this.conventions = ["module"];

        this.cmds = {}; // Lookup for built-in commands.
        this.tasks = {}; // Lookup for user-defined tasks.

        this.workingDirectory = workingDirectory;
        this.moduleDirectory = moduleDirectory;
        
        this.file = null; // Main arg passed from function to function - requires sync operation of course!

        // Finally add user-defined tasks.
        try {
            const configureTasks = require(workingDirectory + "/_warhorse.js");
            configureTasks(this);
        } catch(ex) {
            // fs.writeFileSync(workingDirectory + "/_warhorse.js", )
            log.warning("Warning: This directory is missing a _warhorse.js file and is uninitialised.");
        }
    }

    /**
     * Bundle action.
     * @param {Object} options - Options to further configure this action.
     * @returns {Object} - Returns self for chaining.
     */
    bundle(options = {}) {

        // Handle task configuration.
        let config = Object.assign(this.settings.bundle, options);

        log.action(`Bundling file from: ${this.file.path}`);

        // Process the data.
        // NOTE: Shell process used in order to force sync behaviour.
        // Determine if we're transpiling as well as bundling... or just bundling?
        if(config.transpile === true) {
            // Transpile then bundle
            //let processed = child.execSync(`browserify --debug -t [babelify]`, {input: this.file.path});
            let processed = child.execSync(`browserify --debug ${this.file.path} -t [babelify]`);
            this.file.content = processed.toString();
            //console.log(`stdout: ${this.file.content}`);
        } else {
            // Just bundle
            let processed = child.execSync(`browserify --debug ${this.file.path}`);
            this.file.content = processed.toString();
            //console.log(`stdout: ${this.file.content}`);
        }

        // Return self for chaining.
        return this;
    }

    /**
     * Bundle action.
     * @param {Array} paths - Array of paths or files to empty and delete.
     * @param {Object} options - Options to further configure this action.
     * @returns {Object} - Returns self for chaining.
     */
    clean(paths, options = {}) {
        log.action(`Cleaning project of generated files.`);
        shell.rm("-rf", ...paths);
        log.stage(`Done.`);
    }


    /**
     * Built-in 'create' command.  Starts an interactive session and then initialises a project similar to 'init'.
     * @returns {void}
     */
    cmdCreate() {

        const questions = require("./interactions/create");

        inquirer.prompt(questions).then(function(answers) {
            // console.log("\nProject construction summary:");
            console.log(JSON.stringify(answers, null, "  "));

            let config = Object.assign(packageBase, answers);

            if(config.name !== "untitled") {
                this.workingDirectory = this.workingDirectory + "/" + config.name;
                shell.mkdir("-p", this.workingDirectory);
                shell.cd(this.workingDirectory);
            }
            if(config.warhorse.convention !== "none") {
                this.cmdInit(config.warhorse.convention, config);
            }

        }.bind(this));



    }

    /**
     * Create project (using the defined convention) action.
     * @param {Object} options - Options to further configure this action.
     * @returns {void}
     * @private
     */
    _initModule(options = {}) {

        let srcPath = this.moduleDirectory + "/conventions/" + "module/*";
        shell.cp("-R", srcPath, "./");
        let stdout = child.execSync(`npm install`);
        if(stdout) {
            log(stdout.toString());
        }
    }

    /**
     * Create project (using the defined convention) action.
     * @param {string} convention - Name of the project layout convention to follow.
     * @param {Object} options - Options to further configure this command.
     * @returns {void}
     * @private
     */
    cmdInit(convention, options = {scripts: {}}) {


        // Create a package.json for the new project
        this.commands.map(function(cmdName) {
            options.scripts[cmdName] = `warhorse ${cmdName}"`;
        });

        let packageNew = Object.assign(packageBase, options);


        switch(convention) {
            case "module":
                this._initModule(options);
                break;
            default:
                console.error("Error: Unrecognised or missing project convention.");
        }


        // Write package.json file for new project
        let str = JSON.stringify(packageNew, null, 2); // spacing level = 2
        fs.writeFileSync("packageNEW.json", str);

        //
        // // Resolve configuration
        // let config = Object.assign(this.settings.init, options);
        //
        // // Create NPM package configuration
        // const packageDefault = require("../default/package.json");
        // let packageProject = Object.assign(packageDefault, config);
        //
        // let convention = "default";
        // console.log(` * Creating project from convention: ${convention}`);
        // console.log(`   - Working directory: ${process.cwd()}`);
        //
        // // Fault-tolerant version of fs.mkdirSync(dirPath) - won't overwrite existing dirs!!!
        // const mkdirSync = function(dirPath) {
        //     try {
        //         fs.mkdirSync(dirPath);
        //     } catch(err) {
        //         if(err.code !== "EEXIST") {throw err;};
        //     }
        // };
        //
        // // Fault-tolerant version of fs.unlinkSync(filePath) - won't crash if no file already exists!!!
        // const unlinkSync = function(filePath) {
        //     try {
        //         fs.unlinkSync(filePath);
        //     } catch(err) {
        //         console.error(err.code);
        //         // if(err.code !== "EEXIST") {throw err};
        //     }
        // };
        //
        // // Create project directory structure
        // //FIXME - Guard can be removed once function is fully implemented.
        // let workingDirectory = this.settings.workingDirectory;
        // if(workingDirectory === "/Users/kasargeant/dev/projects/warhorse") {
        //     mkdirSync("./temp");
        //
        //     mkdirSync("./temp/conf");
        //
        //     mkdirSync("./temp/dist");
        //
        //     mkdirSync("./temp/docs");
        //     mkdirSync("./temp/docs/api");
        //     mkdirSync("./temp/docs/coverage");
        //     mkdirSync("./temp/docs/tests");
        //     mkdirSync("./temp/docs/linters");
        //
        //     mkdirSync("./temp/src");
        //     mkdirSync("./temp/src/css");
        //     mkdirSync("./temp/src/img");
        //     mkdirSync("./temp/src/js");
        //
        //     mkdirSync("./temp/test");
        //
        //     // Write NPM package definition
        //     let packageJson = JSON.stringify(packageProject, null, 4);
        //     unlinkSync("./temp/package.json");
        //     fs.writeFileSync("./temp/package.json", packageJson, "utf8");
        //     console.log(packageJson);
        //
        //     // Create configuration files
        //     const configJSCS = require("../default/conf/jscsrc.json");
        //     fs.writeFileSync("./temp/conf/.jscsrc", JSON.stringify(configJSCS, null, 4));
        //
        //     const configJSHINT = require("../default/conf/jshintrc.json");
        //     fs.writeFileSync("./temp/conf/.jshintrc", JSON.stringify(configJSHINT, null, 4));
        // }


        // Return self for chaining.
        return this;
    }

    /**
     * Built-in 'lint' command.
     * @returns {void}
     */
    cmdLint() {
        this.linterJSStats = {reports: [], errors: 0, warnings: 0};

        this.cmds["lint"]();

        this.linterJSStats.reports.map(function(description) {
            log.error(description);
        }.bind(this));
        console.warn("Total number of JavaScript warnings: " + this.linterJSStats.warnings);
        console.error("Total number of JavaScript errors: " + this.linterJSStats.errors);
    }
    
    /**
     * Compile LESS action.
     * @param {Object} options - Options to further configure this action.
     * @returns {Object} - Returns self for chaining.
     */
    compileLESS(options = {}) {

        log.action(`Compiling LESS from: ${this.file.path}`);

        let config = Object.assign(this.settings.precompile, options);

        config.data = this.file.content;         // e.g. index.scss
        config.includePaths = [this.file.path];  // e.g. ./src/sass
        // ALTERNATIVE config.file = file.path + "/" + file.name;

        // Process the data
        // NOTE: Shell process used in order to force sync behaviour.
        let processed = child.execSync(`lessc --relative-urls --include-path=${this.file.path} ${this.file.path + this.file.name}`);
        this.file.content = processed.toString();

        // Transform the extension
        this.file.extension = ".css";
        this.file.name = this.file.stem + this.file.extension;

        // Return self for chaining.
        return this;

        //config example
        // let lessrc = {
        //     env: "development",
        //     logLevel: 2,
        //     async: false,
        //     fileAsync: false,
        //     poll: 1000,
        //     functions: {},
        //     dumpLineNumbers: "comments",
        //     relativeUrls: true,
        //     includePaths: ["./test/data/client_src/less/"],
        //     globalVars: {
        //         var1: '"string value"',
        //         var2: 'regular value'
        //     },
        //     rootpath: ":/a.com/"
        // };
    }

    /**
     * Compile SCSS(SASS) action.
     * @param {Object} options - Options to further configure this action.
     * @returns {Object} - Returns self for chaining.
     */
    compileSASS(options = {}) {

        log.action(`Compiling SCSS from: ${this.file.path}`);

        let config = Object.assign(this.settings.precompile, options);

        config.data = this.file.content;         // e.g. index.scss
        config.includePaths = [this.file.path];  // e.g. ./src/sass
        // ALTERNATIVE config.file = file.path + "/" + file.name;

        // Process the data
        let processed = sass.renderSync(config).css;
        this.file.content = processed.toString();

        // Transform the extension
        this.file.extension = ".css";
        this.file.name = this.file.stem + this.file.extension;

        // Return self for chaining.
        return this;
    }

    /**
     * Create project convention action.
     * @param {Object} file - File to be processed by this action.
     * @param {Function} next - The next callback action to be executed after this one.
     * @param {Object} options - Options to further configure this action.
     * @returns {void}
     * @private - until implemented!
     */
    configure(projectConfig) {
        // TODO - Maybe implement... still not convinced this isn't config overkill! - KAS
    }

    /**
     * Document JS API action.  Documents JavaScript from src/ folder(s).
     * @param {Object} options - Options to further configure this action.
     * @returns {Object} - Returns self for chaining.
     */
    documentJS(options = {}) {

        let config = Object.assign(this.settings.document, options);

        log.action(`Documenting file(s) from: ${config.src}`);
        log.stage(`to path: ${config.dst}`);

        let pathConfig = this.workingDirectory + "/conf";
        child.execSync(`jsdoc -r -c ${pathConfig}/jsdoc.json`);
        // child.execSync(`jsdoc ${config.src} -r -c ${pathConfig}/.jsdocrc -d ${config.dst}`);

        // Return self for chaining.
        return this;
    }

    /**
     * Load action.  Loads files being used for processing by the action that follows.
     * @param {Object} options - Options to further configure this action.
     * @returns {Object} - Returns self for chaining.
     */
    load(options = {}) {

        let config = Object.assign(this.settings.load, options);

        // Accepts a single filepath only.
        let srcPath = this.file.path + this.file.name;
        log.action(`Loading file: ${this.file.path + this.file.name}`);

        this.file.content = fs.readFileSync(srcPath, config.encoding);

        // Return self for chaining.
        return this;
    }

    /**
     * Lint JS action.  Lint JS code.
     * @param {Object} options - Options to further configure this action.
     * @returns {Object} - Returns self for chaining.
     */
    lintJS(options = {}) {

        // NOTE: this.file.content - remains unchanged.

        log.action(`Linting JS from: ${this.file.path}`);


        // const reporter = function(errors) {
        //     console.log(errors.length ? "FAIL" : "OK");
        // };

        // Use JSHint
        let config = Object.assign(this.settings.lint.js.syntax, options);
        this.linterJSSyntax(this.file.content, config);
        let processed = this.linterJSSyntax.data();
        let errors = processed.errors;
        // console.log(JSON.stringify(processed));
        if(errors !== undefined && errors.length > 0) {
            // The results object can be used to render a descriptive explanation of each error:
            errors.map(function(err) {
                //console.log(`${this.file.originalName}: line ${err.line}, col ${err.character}, ${err.reason}\n`);
                this.linterJSStats.reports.push(`Lint Error: ${this.file.path + this.file.name}: line ${err.line}, col ${err.character}, ${err.reason}`);
            }.bind(this));
            this.linterJSStats.errors += errors.length;
        }

        // Use JSCS
        config = Object.assign(this.settings.lint.js.style, options);
        this.linterJSStyle.configure(config);
        processed = this.linterJSStyle.checkString(this.file.content);
        errors = processed.getErrorList();
        if(errors !== undefined && errors.length > 0) {
            // The results object can be used to render a descriptive explanation of each error:
            errors.map(function(error) {
                let colorizeOutput = true;
                // console.log(processed.explainError(error, colorizeOutput) + "\n");
                this.linterJSStats.reports.push("Lint Warning: " + this.file.path + this.file.name + "\n" + processed.explainError(error, colorizeOutput) + "\n");
            }.bind(this));
            // console.error("Total number of JavaScript style errors: " + errors.length);
            this.linterJSStats.warnings += errors.length;
        }


        // Return self for chaining.
        return this;
    }

    /**
     * Minify CSS action.  Minimisation for standard CSS.
     * @param {Object} options - Options to further configure this action.
     * @returns {Object} - Returns self for chaining.
     */
    minifyCSS(options = {}) {

        log.action(`Minifying CSS from: ${this.file.path}`);

        let config = Object.assign(this.settings.minify, options);

        this.file.content = csso.minify(this.file.content).css;

        // Return self for chaining.
        return this;
    }

    /**
     * Minify JS action.  Minimisation for ES51/ES2015 JavaScript.
     * @param {Object} options - Options to further configure this action.
     * @returns {Object} - Returns self for chaining.
     */
    minifyJS(options = {}) {

        log.action(`Minifying JS from: ${this.file.path}`);

        let config = Object.assign(this.settings.bundle, options);
        config.fromString = true; // Essential for data input
        
        // // Process the data (old uglify-js)
        // let processed = uglify.minify({"file": this.file.content}, config).code;
        // this.file.content = processed.toString();

        // Process the data (new uglify-es)
        let processed = uglify.minify(this.file.content);
        this.file.content = processed;
        // let processed = uglify.minify(this.file.content, {
        //     sourceMap: {
        //         filename: "out.js",
        //         url: "out.js.map"
        //     }
        // });
        // console.log(processed.map);  // source map
        // console.log(processed.code); // minified output


        // Return self for chaining.
        return this;
    }

    /**
     * Pack GIF asset action.
     * @param {Object} options - Options to further configure this action.
     * @returns {Object} - Returns self for chaining.
     */
    packGIF(options = {}) {

        log.action(`Packing GIF from: ${this.file.path + this.file.name}`);

        let config = Object.assign(this.settings.pack.gif, options);

        config.data = this.file.content;         // e.g. index.scss
        config.includePaths = [this.file.path];  // e.g. ./src/sass
        // ALTERNATIVE config.file = file.path + "/" + file.name;

        // Process the data
        // NOTE: Shell process used in order to force sync behaviour.
        let processed = child.execSync(`imagemin --plugin=gifsicle --optimizationLevel=2`, {
            input: this.file.content,
            encoding: "binary"
        });
        this.file.content = processed;

        // Transform the extension
        // this.file.extension = ".css";
        // this.file.name = this.file.stem + this.file.extension;

        // Return self for chaining.
        return this;
    }

    /**
     * Pack JPG asset action.
     * @param {Object} options - Options to further configure this action.
     * @returns {Object} - Returns self for chaining.
     */
    packJPG(options = {}) {

        log.action(`Packing JPG from: ${this.file.path + this.file.name}`);

        let config = Object.assign(this.settings.pack.jpg, options);

        config.data = this.file.content;         // e.g. index.scss
        config.includePaths = [this.file.path];  // e.g. ./src/sass
        // ALTERNATIVE config.file = file.path + "/" + file.name;

        // Process the data
        // NOTE: Shell process used in order to force sync behaviour.
        let processed = child.execSync(`imagemin --plugin=jpegtran`, {
            input: this.file.content,
            encoding: "binary"
        });
        this.file.content = processed;

        // Transform the extension
        // this.file.extension = ".css";
        // this.file.name = this.file.stem + this.file.extension;

        // Return self for chaining.
        return this;
    }

    /**
     * Pack PNG asset action.
     * @param {Object} options - Options to further configure this action.
     * @returns {Object} - Returns self for chaining.
     */
    packPNG(options = {}) {

        log.action(`Packing PNG from: ${this.file.path + this.file.name}`);

        let config = Object.assign(this.settings.pack.png, options);

        config.data = this.file.content;         // e.g. index.scss
        config.includePaths = [this.file.path];  // e.g. ./src/sass
        // ALTERNATIVE config.file = file.path + "/" + file.name;

        // Process the data
        // NOTE: Shell process used in order to force sync behaviour.
        let processed = child.execSync(`imagemin --plugin=pngquant --quality=75`, {
            input: this.file.content,
            encoding: "binary"
        });
        this.file.content = processed;

        // Transform the extension
        // this.file.extension = ".css";
        // this.file.name = this.file.stem + this.file.extension;

        // Return self for chaining.
        return this;
    }
    
    /**
     * Pack SVG asset action.
     * @param {Object} options - Options to further configure this action.
     * @returns {Object} - Returns self for chaining.
     */
    packSVG(options = {}) {

        log.action(`Packing SVG from: ${this.file.path + this.file.name}`);

        let config = Object.assign(this.settings.pack.svg, options);

        config.data = this.file.content;         // e.g. index.scss
        config.includePaths = [this.file.path];  // e.g. ./src/sass
        // ALTERNATIVE config.file = file.path + "/" + file.name;

        // Process the data
        // NOTE: Shell process used in order to force sync behaviour.
        let processed = child.execSync(`imagemin --plugin=svgo`, {
            input: this.file.content
        });
        this.file.content = processed;

        // Transform the extension
        // this.file.extension = ".css";
        // this.file.name = this.file.stem + this.file.extension;

        // Return self for chaining.
        return this;
    }
    
    /**
     * Rename action.  Allows modification/replacement/injection of file details into the sequence of actions.
     * @param {Object} options - Options to further configure this action.
     * @returns {Object} - Returns self for chaining.
     */
    rename(options = {}) {

        log.action(`Renaming file: ${this.file.path}`);

        let config = Object.assign(this.settings.save, options);

        // Rename (i.e. overwrite) any values in the file object with the user-defined options object
        this.file = Object.assign(this.file, config);

        // Return self for chaining.
        return this;
    }

    /**
     * Splits a file path into its component parts.
     * @param {string} filePath - A standard system file or path name.
     * @returns {Object} - An object containing a destructured hash of the path's parts.
     * @private
     */
    _splitPath(filePath) {

        // Sanity check
        if(!filePath) {return null;}

        //log.stage(`Splitting file path: ${filePath}`); // e.g. /docs/index.html  // DEBUG ONLY

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

    /**
     * Save action.
     * @param {string} dstPath - The file path that this file will be saved to.
     * @param {Object} options - Options to further configure this action.
     * @returns {Object} - Returns self for chaining.
     */
    save(dstPath, options = {}) {

        let config = Object.assign(this.settings.save, options);

        log.action(`Saving file to: ${dstPath}`);

        if(config.compress === true) {
            let data = zlib.gzipSync(this.file.content);
            fs.writeFileSync(dstPath + ".gz", data, config.encoding);
        } else {
            fs.writeFileSync(dstPath, this.file.content, config.encoding);
        }

        // Return self for chaining.
        return this;
    }

    /**
     * Command 'wrapper' function.  Wraps a task, or list of tasks, to be executed by the named command.
     * @param {string} name - Name of the task.
     * @param {string} cmdFn - A function containing the tasks executed for this command.
     * @returns {void}
     */
    cmd(name, cmdFn) {
        this.cmds[name] = cmdFn;
    }

    /**
     * Task 'wrapper' function.  Wraps an action, or list of actions, to be followed by the named task.
     * @param {string} name - Name of the task.
     * @param {string} taskFn - A function containing the actions followed for the task.
     * @returns {void}
     */
    task(name, taskFn) {
        this.tasks[name] = taskFn;
    }

    /**
     * Test JavaScript units action.
     * @param {Object} options - Options to further configure this action.
     * @returns {Object} - Returns self for chaining.
     */
    testJS(options = {}) {

        log.action(`Testing JS from: ${this.file.path + this.file.name}`);

        let config = Object.assign(this.settings.test, options);
        
        jest.runCLI(config, this.workingDirectory, function(result) {
            if(result.numFailedTests || result.numFailedTestSuites) {
                // cb(new gutil.PluginError('gulp-jest', { message: 'Tests Failed' }));
                console.log("Tests failed.");
            } else {
                // cb();
                console.log("Tests succeeded.");
            }
        });

        // Return self for chaining.
        return this;
    }

    /**
     * Private helper for load().
     * @param {string} globPath - A filename, filepath or globpath.
     * @param {Function} task - The task to be executed.
     * @param {Object} options - Options to further configure the task actions.
     * @returns {void}
     * @private
     */
    _use(globPath, task, options) {
        //log.action(`Parsing: ${globPath}`);

        // Sync filesystem check
        let filePaths = glob.sync(globPath);
        if(filePaths.constructor === Array && filePaths.length > 0) {
            for(let filePath of filePaths) {
                this.file = this._splitPath(filePath);
                task(options);
            }
        } else {
            log.warning("No files matched.");
        }
    }

    /**
     * Use function identfies which files are to be used with which task
     * @param {string} taskName - The name of the task to be executed for every batch item.
     * @param {string} filePath - File path (globs/wildcards allowed) to be processed by this action.
     * @param {Object} options - Options are propagated to all task actions.
     * @returns {Object} - Returns self for chaining.
     */
    use(taskName, filePath = "index.html", options = {}) {

        log.task(`TASK: ${taskName}`);

        // Retrieve task from the taskName
        let task = this.tasks[taskName];

        // If it is a batch of filePaths...
        if(filePath.constructor === Array) {
            filePath.map(function(filePathItem) {
                this._use(filePathItem, task, options);}.bind(this)
            );
        }

        // Else if it is single filePath.
        else if(typeof filePath === "string") {
            this._use(filePath, task, options);
        }
        // Otherwise...
        else {
            console.error(`Error: Unrecognisable or null filepath: ${filePath}`);
        }

        // Return self for chaining.
        return this;
    }

    /**
     * Execute task function.
     * @param {string} taskName - Name of the task.
     * @returns {Object} - Returns self for chaining.
     */
    execute(taskName) {
        log.task(`TASK ${taskName}`);
        let task = this.tasks[taskName];
        if(task !== null) {
            //console.log("Executing command: " + typeof task);
            task();
        }

        // Return self for chaining.
        return this;
    }

    /**
     * Execute command function.
     * @param {string} args - Arguments passed from the command line interface.
     * @returns {Object} - Returns self for chaining.
     * @private
     */
    executeCmd(args) {
        let [cmdName, convention="module"] = args;

        log.cmd(`COMMAND ${cmdName}`);

        // Handle built-ins
        if(cmdName === "init") {
            if(this.conventions.includes(convention)) {
                this.cmdInit(convention);
            } else {
                log.error(`Error: Unrecognised project convention: '${convention}'.`);
            }
            return null; // Success or fail - nothing to return.
        } else if(cmdName === "create") {
            this.cmdCreate();
            return null; // Success or fail - nothing to return.
        } else if(cmdName === "lint") {
            this.cmdLint();
            return null; // Success or fail - nothing to return.
        }

        // Handle user-definables
        let cmd = this.cmds[cmdName];
        if(cmd !== null) {
            //console.log("Executing command type: " + typeof cmd);
            cmd();
        }

        // Return self for chaining.
        return this;
    }
}

// Exports
module.exports = Warhorse;

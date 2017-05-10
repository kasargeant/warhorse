# README - Full-stack Cordova


## PREQUISITES

In order to build the project, certain global command-line tools are required prior to installation and operation:-

    npm -g install browserify
    npm -g install shelljs
    npm -g install eslint
    npm -g install jshint
    npm -g install jscs
    npm -g install jsdoc
    npm -g install node-sass
    npm -g install sass-lint
    npm -g install imagemin-cli
    npm -g install imagemin-pngquant
    npm -g install imagemin-svgo
    npm -g install hbs-cli

If not already on your system - using the commands above or the included script:-
 
    npm run install-toolchain

## INSTALLATION

    npm install


## PROJECT STRUCTURE

The general project structure aims to be as flat and as simple as is practical.  Designed to be as 'unsurprising' and 'obvious' in its style, naming and structure - for the purpose of greater manageability, maintainability and automation - of the hybrid application codebase.  

* All configs in one place => conf/
* All docs in one place => docs/
* All source in one place => src/
* All test code, test dependencies in one place => test/
* All distribution code AND boiler-plate 'encapsulated' in one place => dist/

In addition, the 'source', 'test' and 'distribution' directories - attempt to 'mirror' each other in structure - thus making all code/asset organisation uniform.

Only standard public NPM package dependencies used and additionally, utilising both the standard Cordova distribution layout and its standard naming conventions.


## BUILD TOOLING AND PIPELINE

The entire build and packaging/packing process is described between package.json and a number of supporting scripts found in bin/.  This makes it easy for developers to clearly see and be able to maintain/adapt - everything involved.

The few build scripts needed are themselves - delightfully short and readable.  And everything, has been implemented as to be platform independent.  i.e. Scripts use a no-surprises 'bash' syntax - but will run on Windows as well as Unix-based systems.  All scripts can, of course, be executed individually using NPM's:-

    npm run some-script-name

The main 'meta' scripts and their descriptions are:-

* build - 
* dist -
* document -
* lint -
* lint-fix -
* pack
* rebuild -
* test - 

And out of these only TWO are essential for general usage: 'build' for ongoing development and 'pack' to pack a production distribution.

## DOCUMENTATION

All documentation except this README is automatically generated.  There are four areas detaile:-
 
 * API and code units
 * Unit Test results
 * Unit Test coverage
 * Code/stylesheet Lint results
 

## EXTENSION AND FLEXIBILTY

Because the entire project is structured to be so standard and generic - extension and modification should be straight forward.  

For example, if as the app evolved, NPM proved not to have enough 'power' for our build process - we could easily drop back in Gulp and our private gulp-tasks modules to pick up the load.  

The same for Cordova - if we every wanted to use something else in it's place - we'd just have to rip out the dist/ directory, replace it with the new solution and tidy a few script paths.  A trivial refactor, the rest of the project codebase wouldn't even 'notice' it!


## ES2015 SPECIFIC

The project default is to utilise the real level of ES2015 of devices.  Module handling, imports, exports and reuse are facilitated by the straightforward and well-tested CommonJS approach.

    const MyClass = require("./MyClass");
    ...
    module.exports = MyOtherClass;
    
However, to provide the flexibility of full ES2015 compliance - a Babel pipeline script has been provided also.  Thus allowing:-

    import MyClass from "./MyClass";
    ...
    export default MyOtherClass;
    
In addition, if ES2015 Babelisation is used - both module approaches can be used interchangably - and thus incurs no technical-debt other than stylistic.

Specific development scripts are:

    npm run bundle          // Standard ES51 + CommonJS
    npm run bundle-es2015   // Full ES2015 + CommonJS

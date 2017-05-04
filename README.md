# Warhorse v0.0.3

NOTE: THIS PROJECT IS STILL BEING PROTOTYPED.  AND IS BASICALLY UNUSABLE FOR ANY PRODUCTION PROJECTS AT PRESENT.

YOU HAVE BEEN WARNED!!! ;)

## Installation

    npm -g install warhorse

After that one line, you're done.  

## What can Warhorse do?

Warhorse is a task runner designed specifically for JavaScript projects.  It is deliberately not designed to do everything.  It is designed to help make developer's lives easier and to make typical build tasks as near zero-configuration as possible.

Things it does :-

* Bundles files
* Compresses assets
* Documents projects (API, test, coverage and linting)
* Handles version control
* Minimises scripts
* Cleans up codebases

In addition to this core task runner functionality it offers developers, it also offers a range of "Conventions" (pre-defined structures, code templates, naming and configuration schemes) for rapid project development.  In essence a standardised collection of project setups with an emphasis is on minimalism, simplicity and readability.


## Why is Warhorse special?

In short, because it's ludicrously simple to use - and almost as simple to configure.  

And if Warhorse's suggested project Conventions work for you - then your entire project can be automated in less than five minutes and with zero-configuration!

Warhorse was written as a reaction to the approach taken by build tooling and task runners such as Maven, Gradle, Grunt and Gulp.  Warhorse aims to be everything that they are not:-

* An extremely simple to use task-runner,
* Handles all the typical tasks needed by 90% of JavaScript projects,
* Works "out-the-box" and has "batteries-included".  No plug-in installations necessary,
* Is reliable, predictable and simple to modify,
* Follows industry standards and the best commonly-used patterns wherever possible,
* Is lightweight, written in ES2015 style and is hopefully, well-tested and documented.
* It can crush your enemies!

## Usage

### Executing tasks

Warhorse is designed to be used on the command-line, or triggered by file watcher or IDE.

    warhorse <command> <options>

It offers a fixed, but configurable, set of available tasks to the developer:-

* **build**: just pack assets and bundle code.
* **distribute**: runs tests, runs linters, writes docs, packs assets and bundles code.
* **document**: writes full documentation: API, test, coverage, lint reports.
* **lint**: runs the various linters across the project source.
* **lint-fix**: fixes 'auto-fixable' linting issues throughout the project source.,
* **pack**: packs all assets and moves them into place in the final distribution.
* **publish**: publishes the distribution, updating versions and tagging.
* **run**: runs a custom user-defined task script.
* **test**: runs the unit tests and tests unit coverage.
* **watch**: actives a project watcher (and optionally, a linked development server). 

For example, tells Warhorse to test, build, document and bundle your project with a custom config:-

    warhorse distribute --config ./conf/.warhorserc
    
But if you want to run, for example, just the tests in a project that uses Warhorse Conventions, simply:-

    warhorse test

Additionally, there is option to add user-defined tasks.  Although, if Warhorse is doing it's job well - this functionality should rarely be required.

    warhorse run my-task

### Configuring tasks

Warhorse has a single configuration script.  After a standard install, it can be found in the project's ./bin/ directory:

    tasks.js

In this file is the skeleton of Warhorse's configuration - which can be modified to suit your needs - or left, as is, if you require nothing special.

For example, the build task looks like this:

```javascript
warhorse.task("build", function() {
    warhorse.load("./src/js/**/*.js", function(file) {
        warhorse.bundle(file, function(file) {
            warhorse.save(file, "./dist/js/");
        });    
    });
});
```

If you wished to change Warhorse bundling default - and NOT use minification - then you can add a config to the bundle call like:-

```javascript
warhorse.task("build", function() {
    warhorse.load("./src/js/**/*.js", function(file) {
        warhorse.bundle(file, function(file) {
            warhorse.save(file, "./dist/js/");
        },{
            minify: false
        });    
    });
});
```

## Warhorse Conventions

Warhorse favours "convention over configuration".  Sticking to good conventions - saves a ton of configurational complexity and consequently too, a ton of developer and tester time that would be wasted having to update all the special paths, namings and project layouts throughout the life of a changing project.

This convention-based approach works extremely well for the majority of "real-world" production projects with a typical level of product complexity. 

Additionally, where any fixed standard exists within the JavaScript ecosystem - ideas from other language ecosystems have been adopted - wherever they could enhance code clarity.

For example, I shouldn't have to tell every task runner I have to put together - that my source is in the src/ directory!  Because for the last hundred projects I wrote, it was in the src/ directory - and the number of times in my entire 20+ year programming career where I wrote code that wasn't in a directory called src/ is almost never!!!
 
Thus Warhorse EXPECTS to find your source code and sub-directories under src/ - to save you the burden.  To save you having to type those four letters "src/"... a thousand f*ckin' times in your future!!!

And that's just one benefit. :)

### Project Convention

#### Templates

Warhorse offers a number of standard project setups "out-the-box":-

* Client-side application
* Client-side library
* Server-side Node.js application
* NPM module
* Full-stack application

In addition, all client-side applications can be pre-configured for either the browser or Cordova/PhoneGap.

#### Structure

The general project structure of each project template aims to be as flat and as simple as is practical.  Additionally, the various template directory layouts easily interchangeable and overlaid.  For example, starting a project using a client layout and then realising that you wanted a full-stack layout is as easy to fix as one Warhorse command and a file cut 'n paste! 

In each Convention, you will find:-

* All configs in one place => conf/
* All docs in one place => docs/
* All source in one place => src/
* All test code, test dependencies in one place => test/
* All distribution code AND boiler-plate 'encapsulated' in one place => dist/

In addition, the 'source', 'test' and 'distribution' directories - are 'mirrors' of each other in structure - thus making all code/asset organisation uniform and "obvious" to anyone looking at this project for the first time.

## Documentation

All documentation except the README are automatically generated and updated by Warhorse.  

It provides as standard:-
 
 * API documentation for the projects source code
 * a result report for the project's unit tests
 * a coverage report for the project
 * and lint reports for the various code and CSS resources used.
 

## EXTENSION AND FLEXIBILTY

Because the entire project is structured to be so standard and generic - extension and modification, if it proves necessary, should be straight forward.  

## MODULE MANAGEMENT

Warhorse supports both the CommonJS an the newer ES2015 syntactical forms of module handling.  

You can 'require' or 'import' interchangably and export any way you wish too.  The only constraint is that each code file is self-consistent. i.e. does not mix module handling styles in the same file.

Thus,
```javascript
    const MyClass = require("./MyClass");
    ...
    module.exports = MyOtherClass;
```
And,
```javascript
    import MyClass from "./MyClass";
    ...
    export default MyOtherClass;
```
Are treated - in every way - identically by Warhorse.


## A note on the license

Warhorse currently uses the GPLv3 license.  

This may change in the future to the Apache License, Version 2.0.  

Either way though, Warhorse **can be used freely and without restriction in any commercial or non-commercial** toolchain or project.

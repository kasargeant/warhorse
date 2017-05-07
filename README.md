# Warhorse

NOTE: THIS PROJECT IS STILL BEING PROTOTYPED.  AND IS BASICALLY UNUSABLE FOR ANY PRODUCTION PROJECTS AT PRESENT.

YOU HAVE BEEN WARNED!!! ;)

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

## Installation

    npm -g install warhorse


## Quick Start

### Making a New Project

After installation, change directory to where you would like your new JavaScript project set up.  And enter:

    warhorse init your-project

Warhorse will setup up a project structure, together will all boilerplate and scripting, in a directory immediately below your current location.

    /currentDir/
    /currentDir/your-project

[Note: 'init' conforms to NPM naming standards - so, for example, capital letters cannot be used.]


the two key files used by Warhorse are:-

* ./conf/.warhorserc
* ./warhorseTasks.js

Both can be found in the ./conf/ directory of your new project.

### Use in an Existing Project

To let Warhorse know that you want it to automate your project, two files are required to be added at the top-level of your project directory or in a sub-folder immediately below called conf/ .

The two key files are:-

* ./conf/warhorserc - A configuration file for the Warhorse application.
* ./warhorse.js - A configuration file for Warhorse's commands and tasks.

And you'll need to edit these to tell Warhorse:-

* Where your source files are found. (Default: ./src/)
* Where your distribution files are put. (Default: ./dist/)
* Where your documentation files are put. (Default: ./docs/)

That's all that's required for setup.

### Executing comands

Warhorse is designed to be used on the command-line, or triggered by file watcher or IDE.

    warhorse <command> <options>

It offers a fixed, but configurable, set of available commands to the developer or CI system:-

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

Start perhaps by asking Warhorse to build and test absolutely everything!  
Use:-

    warhorse distribute
    
Then, when you're developing, more likely you'll often just want:-

    warhorse build

### Configuring tasks

Warhorse has a single configuration script.  After a standard install, it can be found in the project's root directory:

    ./warhorse.js

In this file is the skeleton of Warhorse's configuration - which can be modified to suit your needs - or left, as is, if you require nothing special.

For example, the 'precompile-sass' action looks like this:

```javascript
warhorse.task("precompile-sass", function() {
    warhorse.load({})
        .compileSASS({})
        .minifyCSS({})
        .save("./test/data/client_dist/css/" + warhorse.file.name);
});
```

But if you wished to change the defaults - not use minification - and perhaps use instead some custom include path - then you could add a config to the bundle call like:-

```javascript
warhorse.task("precompile-sass", function() {
    warhorse.load({})
        .compileSASS({includePaths: "./some/custom/path/"})
        .save("./test/data/client_dist/css/" + warhorse.file.name);
});
```

## Warhorse Conventions

Warhorse favours "convention over configuration".  Sticking to good conventions - saves a ton of configurational complexity and consequently too, a ton of developer and tester time that would be wasted having to update all the special paths, namings and project layouts throughout the life of a changing project.

This convention-based approach works extremely well for the majority of "real-world" production projects with a typical level of product complexity. 

Additionally, where any fixed standard exists within the JavaScript ecosystem - ideas from other language ecosystems have been adopted - wherever they could enhance code clarity.


## A note on the license

Warhorse currently uses the GPLv3 license.  

This may change in the future to the Apache License, Version 2.0.  

Either way though, Warhorse **can be used freely and without restriction in any commercial or non-commercial** toolchain or project.

# Warhorse

NOTE: THIS PROJECT IS STILL BEING PROTOTYPED.  AND IS BASICALLY UNUSABLE FOR ANY SERIOUS  PRODUCTION PROJECTS AT PRESENT.

YOU HAVE BEEN WARNED!!! ;)

## Installation

    npm install warhorse

## What can Warhorse do?

Warhorse is a task runner designed specifically for JavaScript projects.  It is deliberately not designed to do everything.  It is designed to help make developer's lives easier and to make typical build tasks as near zero-configuration as possible.

Things it does :-

* Bundle files
* Compress assets
* Document projects
* Handle version control
* Minimise scripts
* Clean up codebases

In addition to the core functionality it offers developers.  It also offers a range of templates and layouts for project development called the 'Warhorse Convention'.  In essence a limited range of project setups where the emphasis is on minimalism, simplicity and productivity.

So in short, it can setup your project, build and do all the grunge work of on-going development, pack and publish the final result... with absolutely no effort required beyond
 
    npm -g install warhorse
    
After that one line, you're done.  
Oh and you also get all API, test, coverage and linting documentation automatically too!

## Why is Warhorse special?

Warhorse was written as a reaction to the approach taken by build tooling and task runners such as Maven, Gradle, Grunt and Gulp.  Warhorse aims to be everything that they are not.  In short, to be:-

* An extremely simple to use task-runner
* That works "out-the-box" for 90% of projects,
* Is based entirely on plain-old-JavaScript-functions!
* Is reliable, predictable and simple to modify
* Has "batteries-included" - no other installations are required
* Follows only standards and the most commonly-used practises wherever possible 
* Can crush your enemies.

## Usage

Warhorse is designed to be used on the command-line, or triggered by file watcher or IDE.

    warhorse dist
    
for example, tells Warhorse to test, build, document and bundle your project in the dist/ directory.

But if you want to run, for example, just the tests:-

    warhorse test

## Warhorse Convention

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

    const MyClass = require("./MyClass");
    ...
    module.exports = MyOtherClass;
    
And,

    import MyClass from "./MyClass";
    ...
    export default MyOtherClass;
    
Are treated - in every way - identically by Warhorse.

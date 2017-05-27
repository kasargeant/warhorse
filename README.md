# Warhorse

NOTE: THIS PROJECT WILL SHORTLY BE AT IT'S FIRST ALPHA RELEASE.  BUT IS STILL FAR TOO UNSTABLE AND INCOMPLETE FOR PRODUCTION PROJECTS AT PRESENT.

YOU HAVE BEEN WARNED!!! ;)

## What can Warhorse do?

Warhorse is a task runner designed specifically for JavaScript projects.  

It is an on-going attempt to help make developer's lives easier by reducing all typical build and code management tasks to as near zero-configuration as possible.

It can, and (and if you let it) will, do things automatically like:-

* Bundle your files
* Compress your assets
* Document your project (API, test, coverage and linting)
* Minimise your scripts
* Handle your versioning
* Package and publish your end-product (e.g. to NPM)

In addition to running tasks like the above, the Warhorse distribution also offers developers a range of "Conventions" for rapid project development.  A set of carefully thought-out standard and standardised project layouts, templates, boilerplate code, naming and configuration schemes.  

All with the emphasis on practicality, simplicity and readability. 

So you can focus entirely on developing your app - rather than infrastructure. 

## Why is Warhorse special?

In short, because it's ludicrously simple to use.

And simple because - instead of offering to let you spend a lot of time installing, scripting and configuring every build, tool and task that exists, or might exist, in the entire vast multiverse - Warhorse won't even let you install a single plug-in!

Warhorse was written, in part, as a reaction to approachs taken by typical build/dependency management tools and task runners such as Maven, Gradle, Grunt and Gulp.  Warhorse tries to be everything that they are not:-
 
* Extremely simple to use,
* Handles the mainstream of JavaScript project needs only - not edge-cases,
* Works "out-the-box" and has "batteries-included".  No plug-ins or additional dependencies necessary,
* Is reliable, predictable and simple to customise,
* Is lightweight, written in ES2015 style and is hopefully, well-tested and documented.
* Can crush your enemies!!!... rather than crushing you with configuration, and issues with 3rd party plug-ins and dependencies!

And it tries to do all this, whilst following industry standards and the best commonly-used and KISS patterns wherever possible.

## How does it achieve this?

Warhorse isn't designed to give you more and more choices, more and more options in your build process... it's designed, from the ground-up, to take them away!

To explain... Warhorse's pre-configured and extensive toolchain covers more than most JavaScript projects would ever want to use.  Thus you can use it to approach implementing your project's infrastructural needs in an entirely different way to other tools.  With Warhorse you **implement subtractively** ("deleting what you don't want"), **rather than additively** ("installing/configuring what you do want").  

So it's more like sculpting - than scaffolding.

And it's a damn sight faster too!

## An even bigger benefit!

And if one of Warhorse's suggested project Conventions seems like a good fit for your project - then after a single:-

```
warhorse create <your convention>
```

...your entire project is laid out in the current directory - already setup and automated and ready for you and your team to do serious software development!  How's that for zero-configuration?!? ;)


## Installation

    npm -g install warhorse

> MacOS USERS: Warhorse will install with 'sudo' - but it is not advised.  Instead, it is recommended that you follow NPM's advice and relocate your global package directory.
> See, [npmjs.org - 'Fixing npm permissions'](https://docs.npmjs.com/getting-started/fixing-npm-permissions) for guidance.


## Quick Start

See [Wiki:Quick Start](https://github.com/kasargeant/warhorse/wiki/Quick-Start) for guide as well as links to further tutorials and documentation.


## Warhorse Conventions

Warhorse takes one good thing from Java's Maven... the idea of "convention over configuration".  

Sticking to good conventions - saves a ton of configurational complexity and consequently too, a ton of developer and tester time that would be wasted having to update all the special paths, namings and project layouts throughout the life of a changing project.

The 'Conventions' that Warhorse offers - are based on the multiple decades of experience of Warhorse's developer as well as the particular care taken to utilise "well-known" and standard structures and naming - wherever possible.

They have been designed to be logical - yet real-world.  For example, a software 'src/' directory - most logically has a corresponding 'dst/' directory.  But Warhorse doesn't use 'dst/' but rather 'dist/' instead.  The reason being that utilising 'dist/' - is ubiquitious in it's use by developers.  
 
Thus Warhorse's conventions are not an attempt to impose some "pure", "best-practice" or ideal onto developers - but rather - to simply formalise and automate what 80% of good developers already do!

You can find more information the specific Conventions that Warhorse offers in [Wiki:Warhorse Conventions](https://github.com/kasargeant/warhorse/wiki/Warhorse-Conventions).

## A note on the license

Warhorse currently uses the GPLv3 license.  

This may change in the future to the Apache License, Version 2.0.  

Either way though, Warhorse **can be used freely and without restriction in any commercial or non-commercial** toolchain or project.
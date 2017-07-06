# Warhorse [![npm](https://img.shields.io/npm/v/warhorse.svg)]() [![Build Status](https://travis-ci.org/kasargeant/warhorse.svg?branch=master)](https://travis-ci.org/kasargeant/warhorse) [![Build Status Windows](https://ci.appveyor.com/api/projects/status/github/kasargeant/warhorse?branch=master&svg=true)](https://ci.appveyor.com/project/kasargeant/warhorse) [![Coverage Status](https://coveralls.io/repos/github/kasargeant/warhorse/badge.svg?branch=master)](https://coveralls.io/github/kasargeant/warhorse?branch=master)


![Warhorse logo](/docs/shared/img/warhorse_logo.png)

*NOTE: THIS PROJECT IS NOW AT A 'FEATURE-COMPLETE' ALPHA RELEASE.  
PLEASE FILE AN ISSUE FOR ANY BUGS OR PROBLEMS YOU FIND ON YOUR LINUX/MACOS/WIN32 SETUP.  THANK YOU.*

## What can Warhorse do?

Warhorse is designed to be a zero-configuration task runner for JavaScript projects.  

It is an on-going attempt to help make developers lives easier by removing the increasing amount of repetitive "build" task type from day-to-day development.  

When you run it in a project folder - if the folder is layout according to one of the conventions it recognises... then Warhorse will automatically:-

* Bundle/transpile your JS files,
* Minimise/optimize your stylesheets and scripts,
* Compress your project assets,
* Document almost everything... (API, test, coverage and linting)
* Handle your versioning,
* Package and publish your end-product (e.g. to NPM)

...and will keep watching and doing this - until you switch it off! ;)

All with the emphasis on practicality, simplicity and readability. 

So you can focus entirely on developing your app - rather than infrastructure. 

## Why is Warhorse special?

In short, because it's ludicrously simple to use.

And simple because Warhorse doesn't try to be "everything for everyone".  

Instead, Warhorse is aimed strictly at the JavaScript professional - who appreciate anything to reduce their workload without reducing the quality.

And it can do this by using the best in current JS tooling and preconfiguring everything for you in advance!
 
These sets (there's more than one!) of carefully thought-out and standardised project layouts, templates, boilerplate code, naming and configuration schemes - it calls its "Conventions".  

And if one these Conventions is a good fit for you... then congratulations - because now there's nothing more you have to do.  Well, other than code your world-beating application! ;)

You can find more information the specific Conventions that Warhorse offers in [Wiki:Warhorse Conventions](https://github.com/kasargeant/warhorse/wiki/Warhorse-Conventions).

## Installation

    npm -g install warhorse

> MacOS USERS: Warhorse will install with 'sudo' - but it is not advised.  Instead, it is recommended that you follow NPM's advice and relocate your global package directory.
> See, [npmjs.org - 'Fixing npm permissions'](https://docs.npmjs.com/getting-started/fixing-npm-permissions) for guidance.


## Quick Start

See [Wiki:Quick Start](https://github.com/kasargeant/warhorse/wiki/Quick-Start) for guide as well as links to further tutorials and documentation.


## A note on the license

Warhorse is distributed under the AGPL-3.0 license.  

This may change in the future to the Apache License, Version 2.0.  

Either way though, Warhorse **can be used freely and without restriction to build any individual commercial or non-commercial** project.  

Your code is your code - and using Warhorse - doesn't change that. :)
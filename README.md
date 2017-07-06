# Warhorse [![npm](https://img.shields.io/npm/v/warhorse.svg)]() [![Build Status](https://travis-ci.org/kasargeant/warhorse.svg?branch=master)](https://travis-ci.org/kasargeant/warhorse) [![Build Status Windows](https://ci.appveyor.com/api/projects/status/github/kasargeant/warhorse?branch=master&svg=true)](https://ci.appveyor.com/project/kasargeant/warhorse) [![Coverage Status](https://coveralls.io/repos/github/kasargeant/warhorse/badge.svg?branch=master)](https://coveralls.io/github/kasargeant/warhorse?branch=master)


![Warhorse logo](/docs/shared/img/warhorse_logo.png)

*NOTE: THIS PROJECT IS NOW AT A 'FEATURE-COMPLETE' ALPHA RELEASE.  
PLEASE FILE AN ISSUE FOR ANY BUGS OR PROBLEMS YOU FIND ON YOUR LINUX/MACOS/WIN32 SETUP.  THANK YOU.*

## What can Warhorse do?

Warhorse is designed to be a zero-configuration task runner for JavaScript projects.  

Think of it like, Grunt or Gulp - but, without the weeks of configuration. ;)

Warhorse is built to:-

* **Bundle**, **transpile**, **minimise** your JS files,
* **Preprocess** and **post-process** your templates, SASS and CSS stylesheets,
* **Compress** your project assets,
* **Test** everything together with coverage.
* **Document** almost everything... (API, test, coverage and linting)
* Package and **publish** your end-product (e.g. to NPM)
* And will keep **watch** and everything updated - until you switch it off!

So you can focus entirely on developing the actual code - which is your real app.

## How does it do this?

Warhorse is based almost entirely on a set of carefully thought-out and standardised project layouts, templates, boilerplate code, naming and configuration schemes - it calls its "Conventions".  

These Conventions don't try to 'reinvent the wheel' - but rather summerize - the most useful practises and structures that are in common-usage amongst developers and testers today.

An overall design and selection strongly lead by: 'Convention over Configuration', the Principle of Least Astonishment and most of all KISS!

You can find more information the specific Conventions that Warhorse offers in [Wiki:Warhorse Conventions](https://github.com/kasargeant/warhorse/wiki/Warhorse-Conventions).

## What tools does Warhorse use?

Warhorse maintains a curated and opinionated tool-set of core JS tooling to provide its functionality.  These are, in no particular order:-

* Babel,
* Browserify,
* GIT,
* JSDoc,
* JSHint, JSCS and ESLint,
* LESS, SASS, CSSO and PostCSS,
* Gifsicle, JpegTran and PngQuant,
* SVGO,
* plus a variety of bespoke tools.

With everything preconfigured - so you don't have to!

## What deployments can Warhorse support?

Currently Warhorse supports building modules, libraries, clients and servers for targets:-

* Node (Linux, MacOS, Windows)
* Browser
* Cordova (and PhoneGap)
* [TO BE SOON IMPLMENTED] Electron

## Installation

Warhorse is built and tested with all versions of Node v6+ on: Linux, MacOS and Windows.

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
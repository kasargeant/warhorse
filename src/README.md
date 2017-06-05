# Warhorse API Documentation

## Overview

This documentation describes in detail the various components that make up the Warhorse distribution.

Additionally, the [Warhorse Wiki](https://github.com/kasargeant/warhorse/wiki) contains a User's Guide as well as an overview of the conventions adhered to for the different forms of project creation.



// bundling and module resolution for: JS
bundle(type, options) {}

// minifying distributed code: JS, CSS etc
minify(type, options) {}

// generic e.g. tar.gz
compress(type, options) {}

// templates e.g. handlebars, SASS, LESS
preprocess(type, options) {}

// existing assets e.g. css
postprocess(type, options) {}

// For publishing the final distribution: NPM... JSPM???, Yarn???
publish(type, options) {}

// For scripting GIT and other VCSs
version(type, options) {}
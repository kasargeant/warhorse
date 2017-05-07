// NOTE: AS THIS IS A 'BOOTSTRAP' SCRIPT - WE CANNOT RELY ON ANY PACKAGES BEYOND RAW NPM.

"use strict";

const child = require("child_process");

child.execSync("npm -g install browserify");
child.execSync("npm -g install watchify");
child.execSync("npm -g install shelljs");
child.execSync("npm -g install eslint");
child.execSync("npm -g install jshint");
child.execSync("npm -g install jscs");
child.execSync("npm -g install jsdoc");
child.execSync("npm -g install less");
child.execSync("npm -g install node-sass");
child.execSync("npm -g install sass-lint");
child.execSync("npm -g install imagemin-cli");
child.execSync("npm -g install imagemin-gifsicle");
child.execSync("npm -g install imagemin-jpegtran");
child.execSync("npm -g install imagemin-pngquant");
child.execSync("npm -g install imagemin-svgo");
child.execSync("npm -g install handlebars");
child.execSync("npm -g install csso-cli");

console.log("Warhorse toolchain installed.");


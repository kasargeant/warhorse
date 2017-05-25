// NOTE: AS THIS IS A 'BOOTSTRAP' SCRIPT - WE CANNOT RELY ON ANY PACKAGES BEYOND RAW NPM.

"use strict";

const NpmHelper = require("../src/js/helpers/NpmHelper");

console.log("This may take a few minutes...");
let globalToolsToInstall = [
    "browserify",
    "eslint",
    "jshint",
    "jscs",
    "jsdoc",
    "less",
    "node-sass",
    "sass-lint",
    "imagemin-cli",
    "imagemin-gifsicle",
    "imagemin-jpegtran",
    "imagemin-pngquant",
    "imagemin-svgo"
];

NpmHelper.getPackageListGlobal(function(err, res) {
    if(err) {
        console.log(err);
        return;
    }
    let globalPackageList = res;
    let globalToolsInstalled = Object.keys(globalPackageList);
    for(const packageName of globalToolsToInstall) {
        if(!globalToolsInstalled.includes(packageName)) {

            console.log("Would install: " + packageName);

            // Install global package
            NpmHelper.installPackageGlobal(packageName, function(err, res) {
                if(err) {
                    console.error(`Error: Unable to install package '${packageName}'.`);
                    console.error(err);
                } else {
                    console.log(`Installed global package '${packageName}'.`);
                }
            });
        }
    }
});



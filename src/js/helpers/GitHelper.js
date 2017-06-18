/**
 * @file GitHelper.js
 * @description An NPM helper for Warhorse.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const child = require("child_process");


/**
 * @private
 */
class GitHelper {

    static getCurrentBranchName() {
        let stdout = child.execSync("git rev-parse --abbrev-ref HEAD");
        return stdout.toString();
    }

    static createBranch(name) {
        child.execSync(`git checkout -b ${name}`);
        let currentBranchName = this.getCurrentBranchName();
        if(currentBranchName !== name) {
            console.error(`Error: Failed to create new branch '${name}'.  Current branch is '${currentBranchName}'.`);
            return false;
        }
        return true;
    }

    /**
     *
     * @param {string} releaseType - Can be semver options:- "major", "minor", "patch"
     * @param {string} comment - Any text comment for the update release.
     * @returns {boolean} - A flag for success or failure.
     */
    static updateMaster(releaseType, comment) {
        let currentBranchName = this.getCurrentBranchName();
        if(currentBranchName !== "dev") {
            console.error(`Error: You need to update 'master' from 'dev'.  Current branch is '${currentBranchName}'.`);
        } else {
            child.execSync(`npm version ${releaseType} -m "${comment}"`);
            child.execSync(`git push`);
            child.execSync(`git push --tags`);
            child.execSync(`git checkout master`);
            child.execSync(`git merge dev --no-ff -m "${comment}"`);

            child.execSync("git push");
            //child.execSync("npm publish");
            child.execSync(`git checkout dev`);
        }
    }


}

// Exports
module.exports = GitHelper;
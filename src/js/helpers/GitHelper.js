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

    static _execute(cmdLine) {
        let output = {stdout: null, stderr: null};
        try {
            output.stdout = child.execSync(cmdLine);
        } catch(ex) {
            //console.error(ex.message);
            output.stdout = ex.stdout;
            output.stderr = ex.stderr;
        }
        return output;
    }

    static isGitAvailable() {
        let output = this._execute("git --version");
        return (output.stdout.indexOf("git version") !== -1);
    }

    static getCurrentBranchName() {
        if(this.isGitAvailable()) {
            let output = this._execute("git rev-parse --abbrev-ref HEAD");
            return output.stdout.toString();
        } else {
            console.warn("Warning: This is not a GIT repository.");
            return null;
        }
    }

    static checkoutBranch(name) {
        if(this.isGitAvailable()) {
            let output = this._execute(`git checkout ${name}`);
            let currentBranchName = this.getCurrentBranchName();
            if(currentBranchName !== name) {
                throw new Error(`Failed to checkout branch '${name}'.  Current branch is '${currentBranchName}'.`);
            }
        } else {
            console.warn("Warning: This is not a GIT repository.");
            return false;
        }
        return true;
    }

    static checkoutBranchNew(name) {
        if(this.isGitAvailable()) {
            let output = this._execute(`git checkout -b ${name}`);
            let currentBranchName = this.getCurrentBranchName();
            if(currentBranchName !== name) {
                throw new Error(`Failed to create new branch '${name}'.  Current branch is '${currentBranchName}'.`);
            }
        } else {
            console.warn("Warning: This is not a GIT repository.");
            return false;
        }
        return true;
    }
    //
    // static deleteBranch(name) {
    //     if(this.isGitAvailable()) {
    //         let output = this._execute(`git branch -d ${name}`);
    //         let itStillExists = this.checkoutBranch(name);
    //         if(itStillExists === true) {
    //             throw new Error(`Failed to delete branch '${name}'.  Current branch is '${name}'.`);
    //         }
    //     } else {
    //         console.warn("Warning: This is not a GIT repository.");
    //         return false;
    //     }
    //     return true;
    // }
    //
    // /**
    //  *
    //  * @param {string} releaseType - Can be semver options:- "major", "minor", "patch"
    //  * @param {string} comment - Any text comment for the update release.
    //  * @returns {boolean} - A flag for success or failure.
    //  */
    // static updateMaster(releaseType, comment) {
    //     let currentBranchName = this.getCurrentBranchName();
    //     if(currentBranchName !== "dev") {
    //         console.error(`Error: You need to update 'master' from 'dev'.  Current branch is '${currentBranchName}'.`);
    //     } else {
    //         child.execSync(`npm version ${releaseType} -m "${comment}"`);
    //         child.execSync(`git push`);
    //         child.execSync(`git push --tags`);
    //         child.execSync(`git checkout master`);
    //         child.execSync(`git merge dev --no-ff -m "${comment}"`);
    //
    //         child.execSync("git push");
    //         //child.execSync("npm publish");
    //         child.execSync(`git checkout dev`);
    //     }
    // }
}

// Exports
module.exports = GitHelper;
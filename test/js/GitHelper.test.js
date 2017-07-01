/**
 * @file GitHelper.test.js
 * @description Unit tests for the GitHelper Class (static).
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Environment
const IS_CI = process.env.CI;
const IS_TRAVIS = process.env.TRAVIS;

// Imports
const sinon = require("sinon");

// Unit
const GitHelper = require("../../src/js/helpers/GitHelper");

// Constants/Dummy data

// Tests
describe("Class: GitHelper", function() {

    describe("Standard sanity check", function() {
        it("contains spec with an positive expectation", function() {
            expect(true).toBe(true);
        });
        it("contains spec with a negative expectation", function() {
            expect(!true).toBe(false);
        });
    });

    describe("Instantiation", function() {

        it("should be instantiatable", function() {
            expect(GitHelper).toBeDefined();
        });

    });
    // expect(path).toMatchSnapshot();

    // UNMOCKED
    describe("Core functions", function() {
        it("should be able to execute a valid command line and return results", function() {
            let output = GitHelper._execute("echo hi");
            expect(output.stdout.toString()).toBe("hi\n");
        });

        it("should be able to execute an invalid command line and return error", function() {
            let output = GitHelper._execute("fgsdfg");
            let errorOutput = output.stderr.toString();
            let notRecognized = (errorOutput.indexOf("not recognized") !== -1); // For win32
            let notFound = (errorOutput.indexOf("not found") !== -1);           // For MacOS and Linux

            expect(notRecognized || notFound).toBe(true);
        });
    });
    // describe("Core functions", function() {
    //     it("should be able to discover if GIT is available for the installation", function() {
    //         let isGitAvailable = GitHelper.isGitAvailable();
    //         expect(isGitAvailable).toBe(true);
    //     });
    // });

    describe("Core functions", function() {

        // beforeEach(() => {
        //     sinon.stub(GitHelper, "_execute").returns({stdout: "", stderr: ""});
        // });

        afterEach(() => {
            GitHelper._execute.restore(); // Hardly necessary... but just for the symmetrical hell-of-it.
        });

        it("should be able check if GIT is available", function() {

            // Setup
            sinon.stub(GitHelper, "_execute").returns({stdout: "git version 2.11.0", stderr: ""});

            // Test
            let isGitAvailable = GitHelper.isGitAvailable();

            // Evaluate
            expect(GitHelper._execute.callCount).toBe(1);
            expect(GitHelper._execute.getCall(0).args[0]).toBe("git --version");
            expect(isGitAvailable).toBe(true);
        });

        it("should be able check if GIT is not available", function() {

            // Setup
            sinon.stub(GitHelper, "_execute").returns({stdout: "", stderr: ""});

            // Test
            let isGitAvailable = GitHelper.isGitAvailable();

            // Evaluate
            expect(GitHelper._execute.callCount).toBe(1);
            expect(GitHelper._execute.getCall(0).args[0]).toBe("git --version");
            expect(isGitAvailable).toBe(false);
        });

        // it("should be able check if current directory is a GIT repository", function() {
        //
        //     // Setup
        //     sinon.stub(GitHelper, "_execute").returns({stdout: "test", stderr: ""});
        //
        //     let currentBranchName = GitHelper.getCurrentBranchName();
        //     expect(GitHelper._execute.callCount).toBe(1);
        //     expect(GitHelper._execute.callCount).toBe(1);
        //     expect(GitHelper._execute.callCount).toBe(1);
        // });

        it("should be able to retrieve the current branch name", function() {

            // Setup
            let stub = sinon.stub(GitHelper, "_execute");
            stub.onCall(0).returns({stdout: "git version 2.11.0", stderr: ""});
            stub.onCall(1).returns({stdout: "test", stderr: ""});

            let currentBranchName = GitHelper.getCurrentBranchName();
            expect(GitHelper._execute.callCount).toBe(2);
            expect(GitHelper._execute.getCall(0).args[0]).toBe("git --version");
            expect(GitHelper._execute.getCall(1).args[0]).toBe("git rev-parse --abbrev-ref HEAD");
            expect(currentBranchName).toBe("test");
        });


        it("should be able to checkout an existing branch", function() {

            // Setup
            let stub = sinon.stub(GitHelper, "_execute");
            stub.onCall(0).returns({stdout: "git version 2.11.0", stderr: ""});
            stub.onCall(1).returns({stdout: "test_branch", stderr: ""});
            stub.onCall(2).returns({stdout: "git version 2.11.0", stderr: ""});
            stub.onCall(3).returns({stdout: "test_branch", stderr: ""});

            let isCheckedOut = GitHelper.checkoutBranch("test_branch");
            expect(GitHelper._execute.callCount).toBe(4);
            expect(GitHelper._execute.getCall(0).args[0]).toBe("git --version");
            expect(GitHelper._execute.getCall(1).args[0]).toBe("git checkout test_branch");
            expect(isCheckedOut).toBe(true);
        });
    });

});

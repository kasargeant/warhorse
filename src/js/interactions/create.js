"use strict";

const questions = [
    {
        type: "input",
        name: "name",
        message: "What name do you want for your project?",
        default: "untitled"
    },
    {
        type: "input",
        name: "description",
        message: "What is the project's purpose or description?",
        default: "A new project generated by the Warhorse task runner."
    },
    {
        type: "input",
        name: "author",
        message: "What is the name of the project author?",
        default: "Unknown"
    },
    {
        type: "input",
        name: "email",
        message: "What is the email address for the project?",
        validate: function(value) {
            var pass = value.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
            if(pass) {
                return true;
            }

            return "Please enter a valid email address for GIT and NPM configuration";
        },
        default: "undefined@undefined.com"
    },
    {
        type: "input",
        name: "version",
        message: "What version number should this project be set at?",
        validate: function(value) {
            var pass = value.match(/^(\d+\.)?(\d+\.)?(\d+)$/i);
            if(pass) {
                return true;
            }

            return "Please enter a valid version number for GIT and NPM configuration";
        },
        default: "0.0.0"
    },
    {
        type: "list",
        name: "license",
        message: "Which license do you wish to use?",
        choices: ["Unlicense", "AGPL-1.0", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "GPL-2.0", "GPL-3.0", "MIT", "Proprietary"]
    },
    {
        type: "list",
        name: "warhorse.convention",
        message: "Which Warhorse project convention do you wish to use?",
        choices: ["module", "none"],
        filter: function(val) {
            return val.toLowerCase();
        }
    },
    {
        type: "list",
        name: "warhorse.toolingStyle",
        message: "Which CSS preprocessor do you wish to use?",
        choices: ["none", "LESS", "SASS"],
        filter: function(val) {
            return val.toLowerCase();
        }
    },
    {
        type: "list",
        name: "warhorse.toolingTest",
        message: "Which testing setup do you wish to use?",
        choices: ["none", "Jasmine", "Jest", "Mocha"],
        filter: function(val) {
            return val.toLowerCase();
        }
    },
    {
        type: "list",
        name: "warhorse.toolingTemplates",
        message: "Which template engine do you wish to use?",
        choices: ["none", "Handlebars"],
        filter: function(val) {
            return val.toLowerCase();
        }
    }
];

// Exports
module.exports = questions;

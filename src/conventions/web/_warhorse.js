/**
 * @file _warhorse.js
 * @description The Warhorse command configuration file (web convention).
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

// Warhorse task definitions
function tasks(warhorse) {
    "use strict";

    return {
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // COMMANDS
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Commands are used to group together any arbitrary number of tasks.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        "build": function() {
            warhorse.bundle("js", {
                src: "src/index.js",
                dst: "dist/index.js"
            });
            warhorse.minify("js", {
                src: "dist/index.js",
                dst: "dist/index.min.js"
            });
            warhorse.compress("js", {
                src: "dist/index.min.js",
                dst: "dist/index.tar.gz",
            });
        },

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        "distribute": function() {
            warhorse
                .execute("clean")
                .execute("process")
                .execute("lint")
                .execute("test")
                .execute("build")
                .execute("document");
        },

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        "clean": function() {
            warhorse.clean([
                "./dist/img/ico/*",
                "./dist/img/gif/*",
                "./dist/img/jpg/*",
                "./dist/img/png/*",
                "./dist/img/svg/*",
                "./dist/css/*",
                "./dist/js/*",
                "./dist/css/*"]);
        },

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        "document": function() {
            warhorse.document("js", {
                conf: "conf/jsdoc.json"
            });
        },

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        "fix": function() {
            warhorse.fix("js", {
                type: "style",
                conf: "conf/jscs.json",
                src: "src/js/"
            });
        },

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        "lint": function() {
            warhorse.lint("js", {
                type: "quality",
                conf: "conf/jshint.json",
                src: "src/js/",
                exclude: "conf/.jshintignore"
            });
            warhorse.lint("js", {
                type: "style",
                conf: "conf/jscs.json",
                src: "src/js/"
            });
            // warhorse.lint("sass", {
            //     conf: "conf/.sass-lint.yml"
            // });
        },

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        "pack": function() {

            warhorse.compress("gif", {
                src: "src/img/gif/*.gif",
                dst: "dist/img/gif/"
            });
            warhorse.compress("jpg", {
                src: "src/img/jpg/*.jpg",
                dst: "dist/img/jpg/"
            });
            warhorse.compress("png", {
                src: "src/img/png/*.png",
                dst: "dist/img/png/",
            });
            warhorse.compress("svg", {
                src: "src/img/svg/*.svg",
                dst: "dist/img/svg/"
            });
            warhorse.copy("binary", {
                src: "./test/data/client_src/img/ico/*.ico",
                dst: "./test/data/client_dist/img/ico/"
            });
        },

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        "process": function() {
            // warhorse.preprocess("less", {
            //     src: "src/less/index.less",
            //     dst: "dist/css/index.css",
            //     include: "src/less/"
            // });
            // warhorse.preprocess("sass", {
            //     src: "src/sass/index.scss",
            //     dst: "dist/css/index.css"
            // });
            // warhorse.postprocess("css", {
            //     src: "dist/css/index.css",
            //     dst: "dist/css/index.css",
            //     use: "autoprefixer"
            // });
            // warhorse.minify("css", {
            //     src: "dist/css/index.css",
            //     dst: "dist/css/index.min.css"
            // });
        },

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        "publish": function() {
            // TODO - Implement 'publish' command functionality using module 'npm' for first case.
            // warhorse
            //     .execute("distribute")
            //     .version("git", {
            //      });
        },

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        "test": function() {
            warhorse.test("js", {
                tooling: "jest",
                debug: true,
                config: "conf/jest.json",
                src: "./test/js/"
            });
        }
    };
}

// Exports
module.exports = tasks;

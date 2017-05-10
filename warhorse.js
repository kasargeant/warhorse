/**
 * @file tasks.js
 * @description The Warhorse tasks default configuration.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Warhorse task definitions
function tasks(warhorse) {

    // This defines a PER PROJECT configuration.
    warhorse.configure({
        language: ["es51", "es2015", "es2015+JSX"],
        tooling: {
            images: ["gif", "jpg", "png", "svg"],
            stylesheets: ["less", "sass"],
            templates: ["handlebars"]
        }
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // TASKS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Each task describes a single 'pipeline' of actions upon a single file.
    warhorse.task("build-js", function() {
        warhorse.load({}).bundle({})
            .minifyJS({})
            .save("./test/data/client_dist/js/" + warhorse.file.name);
    });

    warhorse.task("clean-dist", function() {
        warhorse.clean([
            "./test/data/client_dist/img/ico/*",
            "./test/data/client_dist/img/gif/*",
            "./test/data/client_dist/img/jpg/*",
            "./test/data/client_dist/img/png/*",
            "./test/data/client_dist/img/svg/*",
            "./test/data/client_dist/css/*",
            "./test/data/client_dist/js/*",
            "./test/data/client_dist/css/*"]);
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    warhorse.task("copy-ico", function() {
        warhorse.load({encoding: "binary"})
            .save("./test/data/client_dist/img/ico/" + warhorse.file.name, {encoding: "binary"});
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    warhorse.task("pack-gif", function() {
        warhorse.load({encoding: "binary"})
            .packGIF({})
            .save("./test/data/client_dist/img/gif/" + warhorse.file.name, {encoding: "binary"});
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    warhorse.task("pack-jpg", function() {
        warhorse.load({encoding: "binary"})
            .packJPG({})
            .save("./test/data/client_dist/img/jpg/" + warhorse.file.name, {encoding: "binary"});
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    warhorse.task("pack-png", function() {
        warhorse.load({encoding: "binary"})
            .packPNG({})
            .save("./test/data/client_dist/img/png/" + warhorse.file.name, {encoding: "binary"});
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    warhorse.task("pack-svg", function() {
        warhorse.load({})
            .packSVG({})
            .save("./test/data/client_dist/img/svg/" + warhorse.file.name);
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    warhorse.task("precompile-less", function() {
        warhorse.load({})
            .compileLESS({})
            .minifyCSS({})
            .save("./test/data/client_dist/css/" + warhorse.file.name);
    });

    warhorse.task("precompile-sass", function() {
        warhorse.load({})
            .compileSASS({})
            .minifyCSS({})
            .save("./test/data/client_dist/css/" + warhorse.file.name);
    });


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // COMMANDS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Commands are used to group together any arbitary number of tasks.
    warhorse.task("build", function() {
        warhorse.use("build-js", "./test/data/client_src/js/*.js", {});
    });

    warhorse.task("distribute", function() {
        warhorse.use("precompile-less", "./test/data/client_src/less/index.less", {})
            .use("precompile-sass", "./test/data/client_src/sass/index.scss", {})
            .use("build-js", "./test/data/client_src/js/*.js", {})
            .documentJS({});
    });

    warhorse.task("clean", function() {
        warhorse.execute("clean-dist");
    });

    warhorse.task("document", function() {
        warhorse.documentJS({});
    });

    warhorse.task("init", function() {
        //warhorse.init({});
        // TODO - Implement command 'init'
    });

    warhorse.task("pack", function() {
        warhorse.use("copy-ico", "./test/data/client_src/img/ico/*.ico", {});
        warhorse.use("pack-gif", "./test/data/client_src/img/gif/*.gif", {});
        warhorse.use("pack-jpg", "./test/data/client_src/img/jpg/*.jpg", {});
        warhorse.use("pack-png", "./test/data/client_src/img/png/*.png", {});
        warhorse.use("pack-svg", "./test/data/client_src/img/svg/*.svg", {});
    });
    
    warhorse.task("precompile", function() {
        warhorse.use("precompile-less", "./test/data/client_src/less/index.less", {});
        // warhorse.use("precompile-sass", "./test/data/client_src/sass/index.scss", {});
    });
    
    warhorse.task("test", function() {
        // TODO - Implement command 'test'
    });

}

function tasksObject(warhorse) {


    return {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // TASKS
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Each task describes a single 'pipeline' of actions upon a single file.

        "build-js": function() {
            warhorse.load({}).bundle({})
                .minifyJS({})
                .save("./test/data/client_dist/js/" + warhorse.file.name);
        },

        "clean-dist": function() {
            warhorse.clean([
                "./test/data/client_dist/img/ico/*",
                "./test/data/client_dist/img/gif/*",
                "./test/data/client_dist/img/jpg/*",
                "./test/data/client_dist/img/png/*",
                "./test/data/client_dist/img/svg/*",
                "./test/data/client_dist/css/*",
                "./test/data/client_dist/js/*",
                "./test/data/client_dist/css/*"]);
        },

        "copy-ico": function() {
            warhorse.load({encoding: "binary"})
                .save("./test/data/client_dist/img/ico/" + warhorse.file.name, {encoding: "binary"});
        },

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        "pack-gif": function() {
            warhorse.load({encoding: "binary"})
                .packGIF({})
                .save("./test/data/client_dist/img/gif/" + warhorse.file.name, {encoding: "binary"});
        },

        "pack-jpg": function() {
            warhorse.load({encoding: "binary"})
                .packJPG({})
                .save("./test/data/client_dist/img/jpg/" + warhorse.file.name, {encoding: "binary"});
        },

        "pack-png": function() {
            warhorse.load({encoding: "binary"})
                .packPNG({})
                .save("./test/data/client_dist/img/png/" + warhorse.file.name, {encoding: "binary"});
        },

        "pack-svg": function() {
            warhorse.load({})
                .packSVG({})
                .save("./test/data/client_dist/img/svg/" + warhorse.file.name);
        },

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        "precompile-less": function() {
            warhorse.load({})
                .compileLESS({})
                .minifyCSS({})
                .save("./test/data/client_dist/css/" + warhorse.file.name);
        },

        "precompile-sass": function() {
            warhorse.load({})
                .compileSASS({})
                .minifyCSS({})
                .save("./test/data/client_dist/css/" + warhorse.file.name);
        },


        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // COMMANDS
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Commands are used to group together any arbitary number of tasks.
        "build": function() {
            warhorse.use("build-js", "./test/data/client_src/js/*.js", {});
        },

        "distribute": function() {
            warhorse.use("precompile-less", "./test/data/client_src/less/index.less", {})
                .use("precompile-sass", "./test/data/client_src/sass/index.scss", {})
                .use("build-js", "./test/data/client_src/js/*.js", {})
                .documentJS({});
        },

        "clean": function() {
            warhorse.execute("clean-dist");
        },

        "document": function() {
            warhorse.documentJS({});
        },

        "init": function() {
            //warhorse.init({});
            // TODO - Implement command 'init'
        },

        "pack": function() {
            warhorse.use("copy-ico", "./test/data/client_src/img/ico/*.ico", {});
            warhorse.use("pack-gif", "./test/data/client_src/img/gif/*.gif", {});
            warhorse.use("pack-jpg", "./test/data/client_src/img/jpg/*.jpg", {});
            warhorse.use("pack-png", "./test/data/client_src/img/png/*.png", {});
            warhorse.use("pack-svg", "./test/data/client_src/img/svg/*.svg", {});
        },

        "precompile": function() {
            warhorse.use("precompile-less", "./test/data/client_src/less/index.less", {});
            // warhorse.use("precompile-sass", "./test/data/client_src/sass/index.scss", {});
        },

        "test": function() {
            // TODO - Implement command 'test'
        }

    };
}

// Exports
module.exports = tasks;
// module.exports = tasksObject;

module.exports = {
    language: "es51",

    pipelines: {
        build: {
            "js": [
                {idn: "bundle:js", src: "./test/data/client_src", dst: "./test/data/client_dist", sxt: ".js", dxt: ".js"},
            ],
            "css": [
                {idn: "copy:css", src: "./test/data/client_src/css/*.css", dst: "./test/data/client_dist/css", sxt: ".css", dxt: ".css"},
                {idn: "postprocess:css", src: "./test/data/client_dist/css", dst: "./test/data/client_dist/css", sxt: ".css", dxt: ".css"}
            ],
            "html": [
                {idn: "copy:html", src: "./test/data/client_src/*.html", dst: "./test/data/client_dist", sxt: ".html", dxt: ".html"}
            ],
            "less": [
                {idn: "preprocess:less", src: "./test/data/client_src/less", dst: "./test/data/client_dist/css", sxt: ".less", dxt: ".css"},
                {idn: "postprocess:css", src: "./test/data/client_dist/css", dst: "./test/data/client_dist/css", sxt: ".css", dxt: ".css"}
            ],
            "sass": [
                {idn: "preprocess:sass", src: "./test/data/client_src/sass", dst: "./test/data/client_dist/css", sxt: ".scss", dxt: ".css"},
                {idn: "postprocess:css", src: "./test/data/client_dist/css", dst: "./test/data/client_dist/css", sxt: ".css", dxt: ".css"}
            ],
            // "hbs": [
            //     {
            //         task: "preprocess:hbs",
            //         src: "./test/data/client_src/js/templates",
            //         dst: "./test/data/client_dist/js/templates",
            //         sxt: ".hbs",
            //         dxt: ".hbs.js"
            //     },
            // ],
            "gif": [
                {idn: "copy:gif", src: "./test/data/client_src/img/*.gif", dst: "./test/data/client_dist/img", sxt: ".gif", dxt: ".gif"},
            ],
            "jpg": [
                {idn: "copy:jpg", src: "./test/data/client_src/img/*.jpg", dst: "./test/data/client_dist/img", sxt: ".jpg", dxt: ".jpg"},
            ],
            "png": [
                {idn: "copy:png", src: "./test/data/client_src/img/*.png", dst: "./test/data/client_dist/img", sxt: ".png", dxt: ".png"},
            ],
            "svg": [
                {idn: "copy:svg", src: "./test/data/client_src/img/*.svg", dst: "./test/data/client_dist/img", sxt: ".svg", dxt: ".svg"},
            ],
            "ico": [
                {idn: "copy:ico", src: "./test/data/client_src/img/*.ico", dst: "./test/data/client_dist/img", sxt: ".ico", dxt: ".svg"},
            ]
        },

        test: {
            "js": [
                // {idn: "lint:js:quality", src: "./test/data/client_src/js", dst: null, sxt: ".js", dxt: null},
                // {idn: "lint:js:style", src: "./test/data/client_src/js", dst: null, sxt: ".js", dxt: null},
                {idn: "test:js", src: "./test/js", dst: null, sxt: ".js", dxt: null}
            ],
            // TODO - ADD CSS Linter
            "css": null,
            "html": null,
            "less": [
                {idn: "lint:less", src: "./test/data/client_src/less", dst: null, sxt: ".less", dxt: null}
            ],
            "sass": [
                {idn: "lint:sass", src: "./test/data/client_src/sass", dst: null, sxt: ".scss", dxt: null}
            ],
            // TODO - IS THERE A TEMPLATE Linter?
            "hbs": null,
            "gif": null,
            "jpg": null,
            "png": null,
            "svg": null,
            "ico": null
        },

        distribute: {
            "js": [
                {idn: "lint:js:quality", src: "./test/data/client_src/js", dst: null, sxt: ".js", dxt: null},
                {idn: "lint:js:style", src: "./test/data/client_src/js", dst: null, sxt: ".js", dxt: null},
                {idn: "test:js", src: "./test/js", dst: null, sxt: ".js", dxt: null},
                {idn: "bundle:js", src: "./test/data/client_src/js", dst: "./test/data/client_dist", sxt: ".js", dxt: ".js"},
                {idn: "minify:js", src: "./test/data/client_dist", dst: "./test/data/client_dist", sxt: ".js", dxt: ".min.js"},
                {idn: "compress:js", src: "./test/data/client_dist", dst: "./test/data/client_dist", sxt: ".min.js", dxt: ".min.js.tar.gz"},
                {idn: "document:js", src: "./test/data/client_src/js", dst: "./docs/api", sxt: ".js", dxt: null},
            ],
            "css": [
                {idn: "copy:css", src: "./test/data/client_src/css/*.css", dst: "./test/data/client_dist/css", sxt: ".css", dxt: ".css"},
                {idn: "postprocess:css", src: "./test/data/client_dist/css", dst: "./test/data/client_dist/css", sxt: ".css", dxt: ".css"},
                {idn: "minify:css", src: "./test/data/client_dist/css", dst: "./test/data/client_dist/css", sxt: ".css", dxt: ".min.css"},
                {idn: "compress:css", src: "./test/data/client_dist/css", dst: "./test/data/client_dist/css", sxt: ".min.css", dxt: ".min.css.tar.gz"},
            ],
            "html": [
                {idn: "minify:html", src: "./test/data/client_src", dst: "./test/data/client_dist", sxt: ".html", dxt: ".html"},
                {idn: "compress:html", src: "./test/data/client_dist", dst: "./test/data/client_dist", sxt: ".html", dxt: ".html.tar.gz"}
            ],
            "less": [
                {idn: "preprocess:less", src: "./test/data/client_src/less", dst: "./test/data/client_dist/css", sxt: ".less", dxt: ".css"},
                {idn: "postprocess:css", src: "./test/data/client_dist/css", dst: "./test/data/client_dist/css", sxt: ".css", dxt: ".css"},
                {idn: "minify:css", src: "./test/data/client_dist/css", dst: "./test/data/client_dist/css", sxt: ".css", dxt: ".min.css"},
                {idn: "compress:css", src: "./test/data/client_dist/css", dst: "./test/data/client_dist/css", sxt: ".min.css", dxt: ".min.css.tar.gz"},
            ],
            "sass": [
                {idn: "preprocess:sass", src: "./test/data/client_src/sass", dst: "./test/data/client_dist/css", sxt: ".scss", dxt: ".css"},
                {idn: "postprocess:css", src: "./test/data/client_dist/css", dst: "./test/data/client_dist/css", sxt: ".css", dxt: ".css"},
                {idn: "minify:css", src: "./test/data/client_dist/css", dst: "./test/data/client_dist/css", sxt: ".css", dxt: ".min.css"},
                {idn: "compress:css", src: "./test/data/client_dist/css", dst: "./test/data/client_dist/css", sxt: ".min.css", dxt: ".min.css.tar.gz"},
            ],
            "hbs": [
                {idn: "preprocess:hbs", src: "./test/data/client_src/js/templates", dst: "./test/data/client_dist/js/templates", sxt: ".hbs", dxt: ".hbs.js"},
            ],
            "gif": [
                {idn: "compress:gif", src: "./test/data/client_src/img/*.gif", dst: "./test/data/client_dist/img", sxt: ".gif", dxt: ".gif"},
            ],
            "jpg": [
                {idn: "compress:jpg", src: "./test/data/client_src/img/*.jpg", dst: "./test/data/client_dist/img", sxt: ".jpg", dxt: ".jpg"},
            ],
            "png": [
                {idn: "compress:png", src: "./test/data/client_src/img/*.png", dst: "./test/data/client_dist/img", sxt: ".png", dxt: ".png"},
            ],
            "svg": [
                {idn: "compress:svg", src: "./test/data/client_src/img/*.svg", dst: "./test/data/client_dist/img", sxt: ".svg", dxt: ".svg"},
            ],
            "ico": [
                {idn: "copy:ico", src: "./test/data/client_src/img/*.ico", dst: "./test/data/client_dist/img", sxt: ".ico", dxt: ".svg"},
            ]
        },
    },

    tools: {
        build: {
            "bundle:js": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "clean": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "compress:css": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "compress:js": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "compress:html": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "compress:gif": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "compress:jpg": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "compress:png": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "compress:svg": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "document:js": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "lint:js:style": {silent: false, debug: false, useOutput: "jscs", useEqualsSign: true, stdio: "pipe"},
            "lint:js:quality": {silent: false, debug: false, useOutput: "jshint", useEqualsSign: true, stdio: "pipe"},
            "minify:js": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "minify:css": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "minify:html": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "preprocess:hbs": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "preprocess:less": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "preprocess:sass": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "postprocess:css": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "test:js": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false, useInherit: true}
        },
        test: {
            "bundle:js": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "clean": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "compress:css": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "compress:js": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "compress:html": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "compress:gif": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "compress:jpg": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "compress:png": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "compress:svg": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "document:js": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "lint:js:style": {silent: false, debug: false, useOutput: "jscs", useEqualsSign: true, stdio: "pipe"},
            "lint:js:quality": {silent: false, debug: false, useOutput: "jshint", useEqualsSign: true, stdio: "pipe"},
            "minify:js": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "minify:css": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "minify:html": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "preprocess:hbs": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "preprocess:less": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "preprocess:sass": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "postprocess:css": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "test:js": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false, useInherit: true}
        },
        distribute: {
            "bundle:js": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "clean": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "compress:css": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "compress:js": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "compress:html": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "compress:gif": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "compress:jpg": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "compress:png": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "compress:svg": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "document:js": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "lint:js:style": {silent: false, debug: false, useOutput: "jscs", useEqualsSign: true, stdio: "pipe"},
            "lint:js:quality": {silent: false, debug: false, useOutput: "jshint", useEqualsSign: true, stdio: "pipe"},
            "minify:js": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "minify:css": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "minify:html": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "preprocess:hbs": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "preprocess:less": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: true},
            "preprocess:sass": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: true},
            "postprocess:css": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "test:js": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false, useInherit: true}
        }
    }
};

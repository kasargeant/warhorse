module.exports = {
    language: "es51",

    pipelines: {
        build: {
            "js": [
                {idn: "bundle:js", src: "./src/js", dst: "./dist/js", sxt: ".js", dxt: ".js"}
            ],
            "css": [
                {idn: "move:css", src: "./src/css", dst: "./dist/css", sxt: ".css", dxt: ".css"},
                {idn: "postprocess:css", src: "./dist/css", dst: "./dist/css", sxt: ".css", dxt: ".css"}
            ],
            "html": [
                {idn: "move:html", src: "./src", dst: "./dist", sxt: ".html", dxt: ".html"}
            ],
            "less": [
                {idn: "precompile:less", src: "./src/less", dst: "./dist/css", sxt: ".less", dxt: ".css"},
                {idn: "postprocess:css", src: "./dist/css", dst: "./dist/css", sxt: ".css", dxt: ".css"}
            ],
            "sass": [
                {idn: "precompile:sass", src: "./src/sass", dst: "./dist/css", sxt: ".scss", dxt: ".css"},
                {idn: "postprocess:css", src: "./dist/css", dst: "./dist/css", sxt: ".css", dxt: ".css"}
            ],
            "hbs": [
                {
                    task: "precompile:hbs",
                    src: "./src/js/templates",
                    dst: "./dist/js/templates",
                    sxt: ".hbs",
                    dxt: ".hbs.js"
                },
            ],
            "gif": [
                {idn: "move:gif", src: "./src/img/*.gif", dst: "./dist/img", sxt: ".gif", dxt: ".gif"},
            ],
            "jpg": [
                {idn: "move:jpg", src: "./src/img/*.jpg", dst: "./dist/img", sxt: ".jpg", dxt: ".jpg"},
            ],
            "png": [
                {idn: "move:png", src: "./src/img/*.png", dst: "./dist/img", sxt: ".png", dxt: ".png"},
            ],
            "svg": [
                {idn: "move:svg", src: "./src/img/*.svg", dst: "./dist/img", sxt: ".svg", dxt: ".svg"},
            ],
            "ico": [
                {idn: "move:ico", src: "./src/img/*.ico", dst: "./dist/img", sxt: ".ico", dxt: ".svg"},
            ]
        },

        test: {
            "js": [
                {idn: "lint:js:quality", src: "./src/js", dst: null, sxt: ".js", dxt: null},
                {idn: "lint:js:style", src: "./src/js", dst: null, sxt: ".js", dxt: null},
                {idn: "test:js", src: "./test/js", dst: null, sxt: ".js", dxt: null}
            ],
            // TODO - ADD CSS Linter
            "css": null,
            "html": null,
            "less": [
                {idn: "lint:less", src: "./src/less", dst: null, sxt: ".less", dxt: null}
            ],
            "sass": [
                {idn: "lint:sass", src: "./src/sass", dst: null, sxt: ".scss", dxt: null}
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
                {idn: "lint:js:quality", src: "./src/js", dst: null, sxt: ".js", dxt: null},
                {idn: "lint:js:style", src: "./src/js", dst: null, sxt: ".js", dxt: null},
                {idn: "test:js", src: "./test/js", dst: null, sxt: ".js", dxt: null},
                {idn: "bundle:js", src: "./src/js", dst: "./dist/js", sxt: ".js", dxt: ".js"},
                {idn: "minify:js", src: "./dist/js", dst: "./dist/js", sxt: ".js", dxt: ".min.js"},
                {idn: "compress:js", src: "./src/js", dst: "./dist/js", sxt: ".min.js", dxt: ".min.js.tar.gz"},
                {idn: "document:js", src: "./src/js", dst: "./docs/api", sxt: ".js", dxt: null},
            ],
            "css": [
                {idn: "move:css", src: "./src/css", dst: "./dist/css", sxt: ".css", dxt: ".css"},
                {idn: "postprocess:css", src: "./dist/css", dst: "./dist/css", sxt: ".css", dxt: ".css"},
                {idn: "minify:css", src: "./dist/css", dst: "./dist/css", sxt: ".css", dxt: ".min.css"},
                {idn: "compress:css", src: "./dist/css", dst: "./dist/css", sxt: ".min.css", dxt: ".min.css.tar.gz"},
            ],
            "html": [
                {idn: "minify:html", src: "./src", dst: "./dist", sxt: ".html", dxt: ".html"},
                {idn: "compress:html", src: "./dist", dst: "./dist", sxt: ".html", dxt: ".html.tar.gz"}
            ],
            "less": [
                {idn: "precompile:less", src: "./src/less", dst: "./dist/css", sxt: ".less", dxt: ".css"},
                {idn: "postprocess:css", src: "./dist/css", dst: "./dist/css", sxt: ".css", dxt: ".css"},
                {idn: "minify:css", src: "./dist/css", dst: "./dist/css", sxt: ".css", dxt: ".min.css"},
                {idn: "compress:css", src: "./dist/css", dst: "./dist/css", sxt: ".min.css", dxt: ".min.css.tar.gz"},
            ],
            "sass": [
                {idn: "precompile:sass", src: "./src/sass", dst: "./dist/css", sxt: ".scss", dxt: ".css"},
                {idn: "postprocess:css", src: "./dist/css", dst: "./dist/css", sxt: ".css", dxt: ".css"},
                {idn: "minify:css", src: "./dist/css", dst: "./dist/css", sxt: ".css", dxt: ".min.css"},
                {idn: "compress:css", src: "./dist/css", dst: "./dist/css", sxt: ".min.css", dxt: ".min.css.tar.gz"},
            ],
            "hbs": [
                {idn: "precompile:hbs", src: "./src/js/templates", dst: "./dist/js/templates", sxt: ".hbs", dxt: ".hbs.js"},
            ],
            "gif": [
                {idn: "compress:gif", src: "./src/img/*.gif", dst: "./dist/img", sxt: ".gif", dxt: ".gif"},
            ],
            "jpg": [
                {idn: "compress:jpg", src: "./src/img/*.jpg", dst: "./dist/img", sxt: ".jpg", dxt: ".jpg"},
            ],
            "png": [
                {idn: "compress:png", src: "./src/img/*.png", dst: "./dist/img", sxt: ".png", dxt: ".png"},
            ],
            "svg": [
                {idn: "compress:svg", src: "./src/img/*.svg", dst: "./dist/img", sxt: ".svg", dxt: ".svg"},
            ],
            "ico": [
                {idn: "move:ico", src: "./src/img/*.ico", dst: "./dist/img", sxt: ".ico", dxt: ".svg"},
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
            "lint:js:style": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "lint:js:quality": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "minify:js": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "minify:css": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "minify:html": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "precompile:hbs": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "precompile:less": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "precompile:sass": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "postprocess:css": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "test:js": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false}
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
            "lint:js:style": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "lint:js:quality": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "minify:js": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "minify:css": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "minify:html": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "precompile:hbs": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "precompile:less": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "precompile:sass": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "postprocess:css": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "test:js": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false}
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
            "lint:js:style": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "lint:js:quality": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "minify:js": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "minify:css": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "minify:html": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "precompile:hbs": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "precompile:less": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "precompile:sass": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "postprocess:css": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false},
            "test:js": {silent: false, debug: false, useOutput: "stdout", useEqualsSign: false}
        }
    }
};

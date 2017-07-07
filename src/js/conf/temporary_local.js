module.exports = {
    language: "es51",

    pipelines: {
        build: {
            "js": [
                {idn: "bundle:js", src: ["./test/data/client_src", "**/index.js"], dst: ["./test/data/client_dist", ".js"]},
            ],
            "css": [
                {idn: "copy:css", src: ["./test/data/client_src/css", "*.css"], dst: ["./test/data/client_dist/css", ".css"]},
                {idn: "postprocess:css", src: ["./test/data/client_dist/css", "**/*.css"], dst: ["./test/data/client_dist/css", ".css"]},
            ],
            "html": [
                {idn: "copy:html", src: ["./test/data/client_src", "*.html"], dst: ["./test/data/client_dist", ".html"]}
            ],
            "less": [
                {idn: "preprocess:less", src: ["./test/data/client_src/less", "**/index.less"], dst: ["./test/data/client_dist/css", ".css"]},
                {idn: "postprocess:css", src: ["./test/data/client_dist/css", "**/*.css"], dst: ["./test/data/client_dist/css", ".css"]},
            ],
            "sass": [
                {idn: "preprocess:sass", src: ["./test/data/client_src/sass", "index.scss"], dst: ["./test/data/client_dist/css", ".css"]},
                {idn: "postprocess:css", src: ["./test/data/client_dist/css", "**/*.css"], dst: ["./test/data/client_dist/css", ".css"]},
            ],
            // "hbs": [
            //     {
            //         task: "preprocess:hbs",
            //         src: ["./test/data/client_src/js/templates",
            //         dst: "./test/data/client_dist/js/templates",
            //         sxt: ".hbs",
            //         dxt: ".hbs.js"
            //     },
            // ],
            "gif": [
                {idn: "copy:gif", src: ["./test/data/client_src/img", "**/*.gif"], dst: ["./test/data/client_dist/img", ".gif"]},
            ],
            "jpg": [
                {idn: "copy:jpg", src: ["./test/data/client_src/img", "**/*.jpg"], dst: ["./test/data/client_dist/img", ".jpg"]},
            ],
            "png": [
                {idn: "copy:png", src: ["./test/data/client_src/img", "**/*.png"], dst: ["./test/data/client_dist/img", ".png"]},
            ],
            "svg": [
                {idn: "copy:svg", src: ["./test/data/client_src/img", "**/*.svg"], dst: ["./test/data/client_dist/img", ".svg"]},
            ],
            "ico": [
                {idn: "copy:ico", src: ["./test/data/client_src/img", "**/*.ico"], dst: ["./test/data/client_dist/img", ".ico"]},
            ]
        },

        test: {
            "js": [
                {idn: "lint:js:quality", src: ["./test/data/client_src/js", ""], dst: null},
                {idn: "lint:js:style", src: ["./test/data/client_src/js", ""], dst: null},
                {idn: "test:js", src: ["./test/js", ""], dst: null}
            ],
            // TODO - ADD CSS Linter
            "css": [],
            "html": [],
            "less": [
                // {idn: "lint:less", src: ["./test/data/client_src/less", ""], dst: null, sxt: ".less", dxt: null}
            ],
            "sass": [
                // {idn: "lint:sass", src: ["./test/data/client_src/sass", ""], dst: null, sxt: ".scss", dxt: null}
            ],
            // TODO - IS THERE A TEMPLATE Linter?
            "hbs": [],
            "gif": [],
            "jpg": [],
            "png": [],
            "svg": [],
            "ico": []
        },

        distribute: {
            "js": [
                {idn: "lint:js:quality", src: ["./test/data/client_src/js", ""], dst: null},
                {idn: "lint:js:style", src: ["./test/data/client_src/js", ""], dst: null},
                {idn: "test:js", src: ["./test/js", ""], dst: null},
                {idn: "bundle:js", src: ["./test/data/client_src", "**/index.js"], dst: ["./test/data/client_dist", ".js"]},
                {idn: "minify:js", src: ["./test/data/client_dist", "**/*.js"], dst: ["./test/data/client_dist", ".min.js"]},
                {idn: "compress:js", src: ["./test/data/client_dist", "**/*.min.js"], dst: ["./test/data/client_dist", ".min.js.tar.gz"]},
                // {idn: "document:js", src: ["./test/data/client_src/js"], dst: ["./docs/api"]},
            ],
            "css": [
                {idn: "copy:css", src: ["./test/data/client_src/css", "**/*.css"], dst: ["./test/data/client_dist/css", ".css"]},
                {idn: "postprocess:css", src: ["./test/data/client_dist/css", "**/*.css"], dst: ["./test/data/client_dist/css", ".css"]},
                {idn: "minify:css", src: ["./test/data/client_dist/css", "**/*.css"], dst: ["./test/data/client_dist/css", ".min.css"]},
                {idn: "compress:css", src: ["./test/data/client_dist/css", "**/*.min.css"], dst: ["./test/data/client_dist/css", ".min.css.tar.gz"]},
            ],
            "html": [
                {idn: "minify:html", src: ["./test/data/client_src"], dst: ["./test/data/client_dist", ".html"]},
                {idn: "compress:html", src: ["./test/data/client_dist"], dst: ["./test/data/client_dist", ".html.tar.gz"]}
            ],
            "less": [
                {idn: "preprocess:less", src: ["./test/data/client_src/less", "**/index.less"], dst: ["./test/data/client_dist/css", ".css"]},
                {idn: "postprocess:css", src: ["./test/data/client_dist/css", "**/*.css"], dst: ["./test/data/client_dist/css", ".css"]},
                {idn: "minify:css", src: ["./test/data/client_dist/css"], dst: ["./test/data/client_dist/css", ".min.css"]},
                {idn: "compress:css", src: ["./test/data/client_dist/css", "**/*.min.css"], dst: ["./test/data/client_dist/css", ".min.css.tar.gz"]},
            ],
            "sass": [
                {idn: "preprocess:sass", src: ["./test/data/client_src/sass", "**/index.scss"], dst: ["./test/data/client_dist/css", ".css"]},
                {idn: "postprocess:css", src: ["./test/data/client_dist/css", "**/*.css"], dst: ["./test/data/client_dist/css", ".css"]},
                {idn: "minify:css", src: ["./test/data/client_dist/css"], dst: ["./test/data/client_dist/css", ".min.css"]},
                {idn: "compress:css", src: ["./test/data/client_dist/css", "**/*.min.css"], dst: ["./test/data/client_dist/css", ".min.css.tar.gz"]},
            ],
            "hbs": [
                {idn: "preprocess:hbs", src: ["./test/data/client_src/js/templates"], dst: ["./test/data/client_dist/js/templates", ".hbs.js"]},
            ],
            "gif": [
                {idn: "compress:gif", src: ["./test/data/client_src/img", "**/*.gif"], dst: ["./test/data/client_dist/img", ".gif"]},
            ],
            "jpg": [
                {idn: "compress:jpg", src: ["./test/data/client_src/img", "**/*.jpg"], dst: ["./test/data/client_dist/img", ".jpg"]},
            ],
            "png": [
                {idn: "compress:png", src: ["./test/data/client_src/img", "**/*.png"], dst: ["./test/data/client_dist/img", ".png"]},
            ],
            "svg": [
                {idn: "compress:svg", src: ["./test/data/client_src/img", "**/*.svg"], dst: ["./test/data/client_dist/img", ".svg"]},
            ],
            "ico": [
                {idn: "copy:ico", src: ["./test/data/client_src/img", "**/*.ico"], dst: ["./test/data/client_dist/img", ".svg"]},
            ]
        },
    },

    tools: {
        build: {
            "bundle:js": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "clean": {silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "compress:css": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "compress:js": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "compress:html": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "compress:gif": {silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "compress:jpg": {silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "compress:png": {silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "compress:svg": {silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "copy:css": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:js": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:html": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:gif": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:ico": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:jpg": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:png": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:svg": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "document:js": {silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "lint:js:style": {silent: false, debug: false, expandGlobs: false, useOutput: "jscs", useEqualsSign: true, stdio: "pipe"},
            "lint:js:quality": {silent: false, debug: false, expandGlobs: false, useOutput: "jshint", useEqualsSign: true, stdio: "pipe"},
            "minify:js": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "minify:css": {silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "minify:html": {silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "preprocess:hbs": {silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "preprocess:less": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "preprocess:sass": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "postprocess:css": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "test:js": {silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false, useInherit: true}
        },
        test: {
            "bundle:js": {silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "clean": {silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "compress:css": {silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "compress:js": {silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "compress:html": {silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "compress:gif": {silent: true, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "compress:jpg": {silent: true, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "compress:png": {silent: true, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "compress:svg": {silent: true, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "copy:css": {silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:ico": {silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:js": {silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:html": {silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:gif": {silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:jpg": {silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:png": {silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:svg": {silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "document:js": {silent: true, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "lint:js:style": {silent: false, debug: false, expandGlobs: false, useOutput: "jscs", useEqualsSign: true, stdio: "pipe"},
            "lint:js:quality": {silent: false, debug: false, expandGlobs: false, useOutput: "jshint", useEqualsSign: true, stdio: "pipe"},
            "minify:js": {silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "minify:css": {silent: true, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "minify:html": {silent: true, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "preprocess:hbs": {silent: true, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "preprocess:less": {silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "preprocess:sass": {silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "postprocess:css": {silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "test:js": {silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false, useInherit: true}
        },
        distribute: {
            "bundle:js": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "clean": {silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "compress:css": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "compress:js": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "compress:html": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "compress:gif": {silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "compress:jpg": {silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "compress:png": {silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "compress:svg": {silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "copy:css": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:ico": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:js": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:html": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:gif": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:jpg": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:png": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:svg": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "document:js": {silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "lint:js:style": {silent: false, debug: false, expandGlobs: false, useOutput: "jscs", useEqualsSign: true, stdio: "pipe"},
            "lint:js:quality": {silent: false, debug: false, expandGlobs: false, useOutput: "jshint", useEqualsSign: true, stdio: "pipe"},
            "minify:js": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "minify:css": {silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "minify:html": {silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "preprocess:hbs": {silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "preprocess:less": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: true},
            "preprocess:sass": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: true},
            "postprocess:css": {silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "test:js": {silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false, useInherit: true}
        }
    }
};

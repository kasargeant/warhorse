module.exports = {
    language: "es51",

    watch: {
        "css": ["./css"],
        "js": ["./src"],
        "less": ["./src/less"],
        "scss": ["./src/sass"],
        "html": ["./src"]
    },

    pipelines: {
        build: {
            "js": [
                {idn: "bundle:js", src: ["./src", "**/index.js"], dst: ["./dist", ".js"]},
            ],
            "html": [
                {idn: "copy:html", src: ["./src", "**/*.html"], dst: ["./dist", ".html"]}
            ],
            "less": [
                {idn: "preprocess:less", src: ["./src/less", "**/index.less"], dst: ["./dist/css", ".css"]},
            ],
            "sass": [
                {idn: "preprocess:sass", src: ["./src/sass", "index.scss"], dst: ["./dist/css", ".css"]},
            ],
            // Note: CSS must follow any other stylesheet work.
            "css": [
                {idn: "copy:css", src: ["./src/css", "*.css"], dst: ["./dist/css", ".css"]},
                {idn: "postprocess:css", src: ["./dist/css", "**/*.css"], dst: ["./dist/css", ".css"]},
            ],
            "hbs": [
                {idn: "preprocess:hbs", src: ["./src/js/templates", "**/*.hbs"], dst: ["./dist/js/templates", ".hbs.js"]},
            ],
            "gif": [
                {idn: "copy:gif", src: ["./src/img", "**/*.gif"], dst: ["./dist/img", ".gif"]},
            ],
            "jpg": [
                {idn: "copy:jpg", src: ["./src/img", "**/*.jpg"], dst: ["./dist/img", ".jpg"]},
            ],
            "png": [
                {idn: "copy:png", src: ["./src/img", "**/*.png"], dst: ["./dist/img", ".png"]},
            ],
            "svg": [
                {idn: "copy:svg", src: ["./src/img", "**/*.svg"], dst: ["./dist/img", ".svg"]},
            ],
            "ico": [
                {idn: "copy:ico", src: ["./src/img", "**/*.ico"], dst: ["./dist/img", ".ico"]},
            ]
        },

        test: {
            "js": [
                {idn: "lint:js:quality", src: ["./src/js", ""], dst: null},
                {idn: "lint:js:style", src: ["./src/js", ""], dst: null},
                {idn: "test:js", src: ["./test/js", ""], dst: null},
                {idn: "document:js", src: ["./src", ""], dst: ["./docs/api", ""]}
            ],
            // TODO - ADD CSS Linter
            "html": [],
            "less": [
                // {idn: "lint:less", src: ["./src/less", ""], dst: null, sxt: ".less", dxt: null}
            ],
            "sass": [
                // {idn: "lint:sass", src: ["./src/sass", ""], dst: null, sxt: ".scss", dxt: null}
            ],
            // Note: CSS must follow any other stylesheet work.
            "css": [],
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
                {idn: "lint:js:quality", src: ["./src/js", ""], dst: null},
                {idn: "lint:js:style", src: ["./src/js", ""], dst: null},
                {idn: "test:js", src: ["./test/js", ""], dst: null},
                {idn: "bundle:js", src: ["./src", "**/index.js"], dst: ["./dist", ".js"]},
                {idn: "minify:js", src: ["./dist", "**/*.js"], dst: ["./dist", ".min.js"]},
                {idn: "compress:js", src: ["./dist", "**/*.min.js"], dst: ["./dist", ".min.js.tar.gz"]},
                {idn: "document:js", src: ["./src", ""], dst: ["./docs/api", ""]}
            ],
            "html": [
                {idn: "copy:html", src: ["./src", "**/*.html"], dst: ["./dist", ".html"]},
                // {idn: "minify:html", src: ["./src", "**/*.html"], dst: ["./dist", ".html"]},
                {idn: "compress:html", src: ["./dist", "**/*.html"], dst: ["./dist", ".html.tar.gz"]}
            ],
            "less": [
                {idn: "preprocess:less", src: ["./src/less", "**/index.less"], dst: ["./dist/css", ".css"]},
            ],
            "sass": [
                {idn: "preprocess:sass", src: ["./src/sass", "**/index.scss"], dst: ["./dist/css", ".css"]},
            ],
            // Note: CSS must follow any other stylesheet work.
            "css": [
                {idn: "copy:css", src: ["./src/css", "**/*.css"], dst: ["./dist/css", ".css"]},
                {idn: "postprocess:css", src: ["./dist/css", "**/*.css"], dst: ["./dist/css", ".css"]},
                {idn: "minify:css", src: ["./dist/css", "**/*.css"], dst: ["./dist/css", ".min.css"]},
                {idn: "compress:css", src: ["./dist/css", "**/*.min.css"], dst: ["./dist/css", ".min.css.tar.gz"]},
            ],
            "hbs": [
                {idn: "preprocess:hbs", src: ["./src/js/templates", "**/*.hbs"], dst: ["./dist/js/templates", ".hbs.js"]},
            ],
            "gif": [
                {idn: "compress:gif", src: ["./src/img", "**/*.gif"], dst: ["./dist/img", ".gif"]},
            ],
            "jpg": [
                {idn: "compress:jpg", src: ["./src/img", "**/*.jpg"], dst: ["./dist/img", ".jpg"]},
            ],
            "png": [
                {idn: "compress:png", src: ["./src/img", "**/*.png"], dst: ["./dist/img", ".png"]},
            ],
            "svg": [
                {idn: "compress:svg", src: ["./src/img", "**/*.svg"], dst: ["./dist/img", ".svg"]},
            ],
            "ico": [
                {idn: "copy:ico", src: ["./src/img", "**/*.ico"], dst: ["./dist/img", ".svg"]},
            ]
        },
    },

    tools: {
        build: {
            "bundle:js": {desc: "Bundling JS", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "clean": {desc: "Cleaning", silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "compress:css": {desc: "Compressing CSS", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "compress:js": {desc: "Compressing JS", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "compress:html": {desc: "Compressing HTML", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "compress:gif": {desc: "Compressing GIF", silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "compress:jpg": {desc: "Compressing JPG", silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "compress:png": {desc: "Compressing PNG", silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "compress:svg": {desc: "Compressing SVG", silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "copy:css": {desc: "Copying CSS", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:js": {desc: "Copying JS", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:html": {desc: "Copying HTML", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:gif": {desc: "Copying GIF", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:ico": {desc: "Copying ICO", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:jpg": {desc: "Copying JPG", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:png": {desc: "Copying PNG", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:svg": {desc: "Copying SVG", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "document:js": {desc: "Documenting JS", silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "lint:js:style": {desc: "Linting JS(style)", silent: false, debug: false, expandGlobs: false, useOutput: "jscs", useEqualsSign: true, stdio: "pipe"},
            "lint:js:quality": {desc: "Linting JS(quality)", silent: false, debug: false, expandGlobs: false, useOutput: "jshint", useEqualsSign: true, stdio: "pipe"},
            "minify:js": {desc: "Minifying JS", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "minify:css": {desc: "Minifying CSS", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "minify:html": {desc: "Minifying HTML", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "preprocess:hbs": {desc: "Preprocessing HBS", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "preprocess:less": {desc: "Preprocessing LESS", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "preprocess:sass": {desc: "Preprocessing SASS", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "postprocess:css": {desc: "Postprocessing CSS", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "test:js": {desc: "Testing JS", silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false, useInherit: true}
        },
        test: {
            "bundle:js": {desc: "Bundling JS", silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "clean": {desc: "Cleaning", silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "compress:css": {desc: "Compressing CSS", silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "compress:js": {desc: "Compressing JS", silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "compress:html": {desc: "Compressing HTML", silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "compress:gif": {desc: "Compressing GIF", silent: true, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "compress:jpg": {desc: "Compressing JPG", silent: true, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "compress:png": {desc: "Compressing PNG", silent: true, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "compress:svg": {desc: "Compressing SVG", silent: true, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "copy:css": {desc: "Copying CSS", silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:ico": {desc: "Copying ICO", silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:js": {desc: "Copying JS", silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:html": {desc: "Copying HTML", silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:gif": {desc: "Copying GIF", silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:jpg": {desc: "Copying JPG", silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:png": {desc: "Copying PNG", silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:svg": {desc: "Copying SVG", silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "document:js": {desc: "Documenting JS", silent: true, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "lint:js:style": {desc: "Linting JS(style)", silent: false, debug: false, expandGlobs: false, useOutput: "jscs", useEqualsSign: true, stdio: "pipe"},
            "lint:js:quality": {desc: "Linting JS(quality)", silent: false, debug: false, expandGlobs: false, useOutput: "jshint", useEqualsSign: true, stdio: "pipe"},
            "minify:js": {desc: "Minifying JS", silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "minify:css": {desc: "Minifying CSS", silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "minify:html": {desc: "Minifying HTML", silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "preprocess:hbs": {desc: "Preprocessing HBS", silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "preprocess:less": {desc: "Preprocessing LESS", silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "preprocess:sass": {desc: "Preprocessing SASS", silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "postprocess:css": {desc: "Postprocessing CSS", silent: true, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "test:js": {desc: "Testing JS", silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false, useInherit: true}
        },
        distribute: {
            "bundle:js": {desc: "Bundling JS", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "clean": {desc: "Cleaning", silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "compress:css": {desc: "Compressing CSS", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "compress:js": {desc: "Compressing JS", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "compress:html": {desc: "Compressing HTML", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "compress:gif": {desc: "Compressing GIF", silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "compress:jpg": {desc: "Compressing JPG", silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "compress:png": {desc: "Compressing PNG", silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "compress:svg": {desc: "Compressing SVG", silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "copy:css": {desc: "Copying CSS", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:ico": {desc: "Copying ICO", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:js": {desc: "Copying JS", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:html": {desc: "Copying HTML", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:gif": {desc: "Copying GIF", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:jpg": {desc: "Copying JPG", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:png": {desc: "Copying PNG", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "copy:svg": {desc: "Copying SVG", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "document:js": {desc: "Documenting JS", silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false},
            "lint:js:style": {desc: "Linting JS(style)", silent: false, debug: false, expandGlobs: false, useOutput: "jscs", useEqualsSign: true, stdio: "pipe"},
            "lint:js:quality": {desc: "Linting JS(quality)", silent: false, debug: false, expandGlobs: false, useOutput: "jshint", useEqualsSign: true, stdio: "pipe"},
            "minify:js": {desc: "Minifying JS", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "minify:css": {desc: "Minifying CSS", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "minify:html": {desc: "Minifying HTML", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "preprocess:hbs": {desc: "Preprocessing HBS", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "preprocess:less": {desc: "Preprocessing LESS", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: true},
            "preprocess:sass": {desc: "Preprocessing SASS", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: true},
            "postprocess:css": {desc: "Postprocessing CSS", silent: false, debug: false, expandGlobs: true, useOutput: "stdout", useEqualsSign: false},
            "test:js": {desc: "Testing JS", silent: false, debug: false, expandGlobs: false, useOutput: "stdout", useEqualsSign: false, useInherit: true}
        }
    }
};

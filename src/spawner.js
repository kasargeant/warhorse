const child = require("child_process");

let result = child.spawnSync("node", ["js/interactions/create.js"], {
    cwd: __dirname,
    stdio: "inherit"
});

console.log("RESULT: " + JSON.stringify(result));

let stdout = result.stdout;

let options = JSON.parse(stdout);

//console.log("TTTT" + options.warhorse.convention);


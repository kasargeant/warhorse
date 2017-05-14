// Imports
const chalk = require("chalk");

/**
 * @class
 * @classdesc A class of static pretty-print console functions.
 * @static
 */
class Unfurl {

    static cmd(value) {console.log(chalk.bgMagenta(" " + value));}
    static task(value) {console.log(chalk.bgBlue("  " + value));}
    static action(value) {console.log(chalk.blue("  - " + value));}
    static stage(value) {console.log(chalk.cyan("    -> " + value));}

    static info(value) {console.info(chalk.bgBlue(value));}
    static warning(value) {console.warn(chalk.yellow(value));}
    static error(value) {console.error(chalk.red(value));}

}

// Exports
module.exports = Unfurl;



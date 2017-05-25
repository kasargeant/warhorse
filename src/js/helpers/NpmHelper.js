const npm = require("npm");

const errorHandler = function(err) {
    console.error(err);
    return err;
};

class NpmHelper {

    static installPackageGlobal(packageName, callback) {
        this._execute("install", [packageName], {silent: true, global: true}, function(err, res) {
            if(err) {
                callback(err, null);
            }
            callback(null, res);
        });
    }

    static getPackageListGlobal(callback) {
        this._execute("list", [], {silent: true, global: true, depth: 0}, function(err, res) {
            if(err) {
                callback(err, null);
            }
            callback(null, res.dependencies);
        });
    }

    /**
     *
     * @param {string} command
     * @param {Array} args
     * @param {Object} config
     * @param {Function} callback
     * @returns {void}
     * @private
     */
    static _execute(command, args, config, callback) {
        config._exit = true;
        npm.load(config, function(er) {
            if(er) {return this.errorHandler(er);}
            npm.commands[command](args, callback);
        }.bind(this));
    }
}

// Exports
module.exports = NpmHelper;
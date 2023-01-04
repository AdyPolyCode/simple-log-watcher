const { existsSync, writeFileSync } = require('fs');
const { dirname, join } = require('path');

const {
    InvalidArgumentTypeError,
    InvalidConfigPropertiesError,
    InvalidPathError,
    NoConfigFileError,
} = require('./errors');

const PKG_ROOT = dirname(__dirname);
const PKG_ROOT_PARENT = dirname(PKG_ROOT);

// TODO: update messages
const errorMessages = {
    _verifyPath: 'Path does not exist',
    _verifyConfigPath: 'Config file does not exist',
    _getConfigFileProps: 'Invalid config properties',
};

class FileHandler {
    /**
     *
     * @returns {String}
     * absolute path to file to handle is returned on success
     */
    static _getFile() {
        const configFilePath = FileHandler._verifyConfigPath();
        const { filename, path } =
            FileHandler._getConfigFileProps(configFilePath);

        const fileToWatch = join(path, filename);

        if (!existsSync(fileToWatch)) {
            writeFileSync(fileToWatch, '', { encoding: 'utf8', flag: 'w' });
        }

        return { fileToWatch, config: { filename, path } };
    }

    /**
     *
     * @param {String} file
     * @returns {Object}
     * configuration file properties are returned on success
     * where filename = file with .txt extension to handle
     * where path = path to the file with .txt extension to handle
     */
    static _getConfigFileProps(file) {
        const configFile = require(file);

        const { filename, path } = configFile;

        if (!filename) throw new InvalidConfigPropertiesError('');
        if (!path) throw new InvalidConfigPropertiesError('');
        if (!filename && !path)
            throw new InvalidConfigPropertiesError(
                `Invalid config properties, 'filename' and 'path' should be valid properties`
            );

        return configFile;
    }

    /**
     *
     * @returns {String | boolean} string or boolean
     * valid absolute path from root directory
     * or valid absolute path from parent directory of root directory
     * is returned for further operations
     */
    static _verifyConfigPath() {
        const absRootPath = join(PKG_ROOT, 'watcher.config.js');
        const absRootParentPath = join(PKG_ROOT_PARENT, 'watcher.config.js');

        const validPath = this._verifyPath(absRootPath)
            ? absRootPath
            : this._verifyPath(absRootParentPath)
            ? absRootParentPath
            : null;

        if (!validPath)
            throw new NoConfigFileError(
                `Config file does not exist, please provide one either in ${absRootPath} or in ${absRootParentPath}`
            );

        return validPath;
    }

    /**
     *
     * @param {String} path - path to a config.js file
     * @returns {boolean} boolean
     * config file should exist in order to extract valid config parameters
     * for further operations and run any functionality accordingly
     */
    static _verifyPath(path) {
        if (typeof path !== 'string')
            throw new InvalidArgumentTypeError(
                `Argument 'path' has invalid argument type`
            );
        if (!path) throw new InvalidPathError(`Path '${path}' does not exist`);

        return existsSync(path);
    }
}

module.exports = { FileHandler, errorMessages };

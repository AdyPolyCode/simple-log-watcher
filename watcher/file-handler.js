const { existsSync, writeFileSync } = require('fs');
const { dirname, join } = require('path');

const {
    InvalidArgumentTypeError,
    InvalidConfigPropertiesError,
    NoConfigFileError,
} = require('./errors');

const PKG_ROOT = dirname(__dirname);
const PKG_ROOT_PARENT = dirname(PKG_ROOT);

const errorMessages = {
    _verifyPath: {
        invalidArgumentType: "Argument 'path' has invalid argument type",
    },
    _verifyConfigPath: {
        noPath: "Config file does not exist, please provide one either in root of 'watcher' or in parent root of 'watcher'",
    },
    _getConfigFileProps: {
        noFilenameProperty: "Config file 'filename' property does not exist",
        noPathProperty: "Config file 'path' property does not exist",
    },
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

        if (!filename)
            throw new InvalidConfigPropertiesError(
                errorMessages._getConfigFileProps.noFilenameProperty
            );
        if (!path)
            throw new InvalidConfigPropertiesError(
                errorMessages._getConfigFileProps.noPathProperty
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
            throw new NoConfigFileError(errorMessages._verifyConfigPath.noPath);

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
        if (!path || typeof path !== 'string')
            throw new InvalidArgumentTypeError(
                errorMessages._verifyPath.invalidArgumentType
            );

        return existsSync(path);
    }
}

module.exports = { FileHandler, errorMessages };

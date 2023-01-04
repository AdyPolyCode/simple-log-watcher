class NoConfigFileError extends Error {
    constructor(message) {
        super(message);
    }
}

module.exports = NoConfigFileError;

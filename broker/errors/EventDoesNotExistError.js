class EventDoesNotExistError extends Error {
    constructor(message) {
        super(message);
    }
}

module.exports = EventDoesNotExistError;

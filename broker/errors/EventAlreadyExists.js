class EventAlreadyExists extends Error {
    constructor(message) {
        super(message);
    }
}

module.exports = EventAlreadyExists;

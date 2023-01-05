const { EventEmitter } = require('events');
const { ServerResponse } = require('http');

const {
    InvalidArgumentTypeError,
    EventAlreadyExists,
    EventDoesNotExistError,
} = require('./errors');

const errorMessages = {
    subscribe: {
        eventUndefined: "Argument 'event' should be a type of 'String'",
        invalidResponseType:
            "Argument 'response' should be an instance of 'ServerResponse'",
        eventExists: 'Event already registered',
    },
    publish: {
        eventNotReal: "Argument 'event' is not registered",
        dataNotReal: "Argument 'data' must not be empty",
    },
};

// Todo: finish subscribe listener & publish emitter
class ServerEventHandler extends EventEmitter {
    constructor() {
        super({ captureRejections: true });
    }

    subscribe(event, response) {
        if (!event)
            throw new InvalidArgumentTypeError(
                errorMessages.subscribe.eventUndefined
            );

        if (!(response instanceof ServerResponse))
            throw new InvalidArgumentTypeError(
                errorMessages.subscribe.invalidResponseType
            );

        if (this.listeners(event).length > 1)
            throw new EventAlreadyExists(errorMessages.subscribe.eventExists);

        this.on(event, () => {
            // response.write('Hello');
            console.log('Listening');
        });
        return;
    }

    publish(event, data) {
        if (this.listeners(event).length == 0)
            throw new EventDoesNotExistError(
                errorMessages.publish.eventNotReal
            );

        if (!data)
            throw new InvalidArgumentTypeError(
                errorMessages.publish.dataNotReal
            );

        this.emit(event, data);
        return;
    }
}

module.exports = {
    ServerEventHandler: new ServerEventHandler(),
    errorMessages,
};

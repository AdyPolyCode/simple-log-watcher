const { describe, it } = require('mocha');
const { expect } = require('chai');
const { Socket } = require('net');
const { ServerResponse, IncomingMessage } = require('http');

const { ServerEventHandler, errorMessages } = require('./server-event-handler');
const {
    InvalidArgumentTypeError,
    EventAlreadyExists,
    EventDoesNotExistError,
} = require('./errors');

// Todo: finish test cases
describe("Validate 'ServerEventHandler' methods", function () {
    describe('Verify positive test cases', function () {
        it('Should register for server events', function () {
            const eventType = 'update';
            const socket = new Socket();
            const message = new IncomingMessage(socket);
            const response = new ServerResponse(message);

            ServerEventHandler.subscribe(eventType, response);

            expect(ServerEventHandler.listenerCount(eventType)).to.be.equal(1);
            expect(ServerEventHandler.eventNames()[0]).to.be.equal(eventType);
        });
    });

    describe('Verify negative test cases', function () {
        it("Should throw error on method 'subscribe' with invalid arguments", function () {
            const eventType = '';
            const error = new Error('');

            try {
                expect(ServerEventHandler.subscribe(eventType, error));
            } catch (error) {
                expect(error.message).to.be.equal('Invalid arguments');
            }
        });
    });
});

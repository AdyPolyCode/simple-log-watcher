const { describe, it, before } = require('mocha');
const { expect } = require('chai');
const { Socket } = require('net');
const { ServerResponse, IncomingMessage } = require('http');

const { ServerEventHandler, errorMessages } = require('./server-event-handler');
const {
    InvalidArgumentTypeError,
    EventAlreadyExists,
    EventDoesNotExistError,
} = require('./errors');

describe("Validate 'ServerEventHandler' methods", function () {
    describe('Verify positive test cases', function () {
        /**
         * Valid Subscribe
         */
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
        before(function () {
            const eventType = 'update';
            const socket = new Socket();
            const message = new IncomingMessage(socket);
            const response = new ServerResponse(message);

            ServerEventHandler.subscribe(eventType, response);
        });

        /**
         * Invalid Subscribe
         */
        it("Should throw error on method 'subscribe' with invalid event argument", function () {
            const eventType = '';

            try {
                expect(ServerEventHandler.subscribe(eventType, null));
            } catch (error) {
                expect(error).to.be.instanceOf(InvalidArgumentTypeError);
                expect(error.message).to.be.equal(
                    errorMessages.subscribe.eventUndefined
                );
            }
        });

        it("Should throw error on method 'subscribe' with invalid response argument", function () {
            const eventType = 'data';

            try {
                expect(ServerEventHandler.subscribe(eventType, null));
            } catch (error) {
                expect(error).to.be.instanceOf(InvalidArgumentTypeError);
                expect(error.message).to.be.equal(
                    errorMessages.subscribe.invalidResponseType
                );
            }
        });

        it("Should throw error on method 'subscribe' on event that exists", function () {
            const eventType = 'update';
            const socket = new Socket();
            const message = new IncomingMessage(socket);
            const response = new ServerResponse(message);

            try {
                ServerEventHandler.subscribe(eventType, response);
            } catch (error) {
                expect(error).to.be.instanceOf(EventAlreadyExists);
                expect(error.message).to.be.equal(
                    errorMessages.subscribe.eventExists
                );
            }
        });

        /**
         * Invalid Publish
         */
        it("Should throw error on method 'publish' with invalid data argument", function () {
            const eventType = 'update';

            try {
                ServerEventHandler.publish(eventType, null);
            } catch (error) {
                expect(error).to.be.instanceOf(InvalidArgumentTypeError);
                expect(error.message).to.be.equal(
                    errorMessages.publish.dataNotReal
                );
            }
        });

        it("Should throw error on method 'publish' with not existing event type", function () {
            const eventType = 'fake-event';

            try {
                ServerEventHandler.publish(eventType, 'data');
            } catch (error) {
                expect(error).to.be.instanceOf(EventDoesNotExistError);
                expect(error.message).to.be.equal(
                    errorMessages.publish.eventNotReal
                );
            }
        });
    });
});

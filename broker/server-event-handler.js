const { EventEmitter } = require('events');

class ServerEventHandler extends EventEmitter {
    static instance;
    __response;

    /**
     *
     * @returns ServerEventHandler instance
     */
    constructor() {
        if (!ServerEventHandler.instance) {
            super({ captureRejections: true });

            this.__response = null;
            this.registerServerListener('server-init');
            this.registerWatchListener('watch-data');

            ServerEventHandler.instance = this;
        }
        return ServerEventHandler.instance;
    }

    /**
     *
     * @returns ServerEventHandler instance
     */
    static getInstance() {
        return ServerEventHandler.instance;
    }

    /**
     *
     * @returns ServerResponse
     */
    getResponse() {
        return this.__response;
    }

    /**
     *
     * @param {String} event
     * @returns void
     */
    registerServerListener(event) {
        this.once(event, (response) => {
            this.__response = response;
        });
        return;
    }

    /**
     *
     * @param {String} event
     * @returns void
     */
    registerWatchListener(event) {
        this.on(event, (data) => {
            if (this.__response) this.__response.end(data);
        });
        return;
    }
}

const instance = new ServerEventHandler();

module.exports = {
    ServerEventHandler,
};

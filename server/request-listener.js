const { urlParser, sendInitialResponse } = require('./utils');
const {
    responses: { success, fail },
} = require('./config');

function registerListener(eventHandler) {
    const ServerEventHandler = eventHandler;

    return function requestListener(request, response) {
        const { path } = urlParser(request);

        if (path === '/logs') {
            if (!ServerEventHandler.getResponse()) {
                ServerEventHandler.emit('server-init', response);
            }
            sendInitialResponse(response, success);
        } else {
            sendInitialResponse(response, fail);
        }
    };
}

module.exports = registerListener;

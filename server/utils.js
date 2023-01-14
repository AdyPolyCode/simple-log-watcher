const { URL } = require('url');

function urlParser(request) {
    const requestPath = request.url || '/';

    const url = new URL(
        `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}${requestPath}`
    );

    return { path: url.pathname };
}

function sendInitialResponse(response, options) {
    function setHeaders(response, options) {
        const { code, message, headers } = options;

        response.writeHead(code, message, {
            ...headers,
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*',
        });
    }

    const { type } = options;

    setHeaders(response, options);

    if (type === 'Success') {
        const body = [':' + new Array(2049).join(' ') + '\n', 'retry: 2000\n'];

        response.write(body[0]);
        response.write(body[1]);

        response.on('close', () => {
            // ! TODO: handle proper closure
            console.log('Client disconnected');
        });
    } else {
        const body = 'Page Not Found';

        response.write(body);
        response.end();
    }
}

module.exports = { urlParser, sendInitialResponse };

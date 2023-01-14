const { createServer } = require('http');

const registerListener = require('./request-listener');

function run(eventHandler) {
    const server = createServer(registerListener(eventHandler.getInstance()));

    return {
        start: () =>
            server.listen(
                process.env.SERVER_PORT,
                process.env.SERVER_HOST,
                () => {
                    console.log(
                        `Server application @${process.env.SERVER_HOST} is listening on port: ${process.env.SERVER_PORT}`
                    );
                }
            ),
    };
}

module.exports = run;

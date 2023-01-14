module.exports = {
    validPaths: {
        logs: '/logs',
    },
    responses: {
        success: {
            type: 'Success',
            code: 200,
            message: 'Success',
            headers: (length) => ({
                'Content-Type': 'text/event-stream',
                'Content-Length': length,
                Connection: 'keep-alive',
            }),
        },
        fail: {
            type: 'Fail',
            code: 404,
            message: 'Not Found',
            headers: (length) => ({
                'Content-Type': 'text/plain',
                'Content-Length': length,
            }),
        },
    },
};

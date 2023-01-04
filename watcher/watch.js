const { read, open, close } = require('fs');
const { EventEmitter } = require('events');

const { FileHandler } = require('./file-handler');

class FileWatcher extends EventEmitter {
    instance;
    fileName;
    filePath;

    constructor(fileName, filePath) {
        super({ captureRejections: true });
        this.fileName = fileName;
        this.filePath = filePath;
    }

    static watch() {
        if (!this.instance) {
            const { fileToWatch, config } = FileHandler._getFile();

            this.instance = new FileWatcher(config.filename, config.path);

            /**
             *
             * @param {*} err
             * @param {*} bytes
             * @param {*} buffer
             */
            const readHandler = (err, bytes, buffer) => {
                if (err) throw err;

                if (bytes) {
                    console.log(buffer.toString('utf8'));
                }
            };

            /**
             *
             * @param {*} fd
             */
            const reader = (fd) => {
                read(fd, readHandler);
            };

            /**
             *
             */
            open(fileToWatch, (err, fd) => {
                if (err) throw err;

                const interval = this.instance._watchHelper(fd, 5000, reader);

                this.instance.on('close-watch', () => {
                    console.info(
                        `Closing file: ${this.instance.fileName} at path: ${this.instance.filePath}`
                    );
                    clearInterval(interval);
                    close(fd, (err) => {
                        if (err) throw err;
                    });
                });
            });

            return this.instance;
        }

        return this.instance;
    }

    /**
     *
     * @param {*} fd
     * @param {*} time
     * @param {*} cb
     * @returns
     */
    _watchHelper(fd, time, cb) {
        const interval = setInterval(() => {
            cb(fd);
        }, time);

        return interval;
    }
}

module.exports = FileWatcher;

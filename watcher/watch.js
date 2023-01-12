const { read, open, close } = require('fs');
const { EventEmitter } = require('events');

const { FileHandler } = require('./file-handler');

/**
 *
 */
class FileWatcher extends EventEmitter {
    static instance;
    fileName;
    filePath;
    eventHandler;

    /**
     *
     * @param {String} fileName
     * @param {String} filePath
     * @returns FileWatcher instance
     */
    constructor(fileName, filePath, eventHandler) {
        if (!FileWatcher.instance) {
            super({ captureRejections: true });
            this.fileName = fileName;
            this.filePath = filePath;
            this.eventHandler = eventHandler;
            FileWatcher.instance = this;
        }
        return FileWatcher.instance;
    }

    /**
     *
     * @returns FileWatcher instance
     */
    static init(eventHandler) {
        if (!FileWatcher.instance) {
            const {
                config: { filename, path },
            } = FileHandler._getFile();

            FileWatcher.instance = new FileWatcher(
                filename,
                path,
                eventHandler
            );
        }
        return FileWatcher.instance;
    }

    /**
     *
     */
    watch() {
        const { fileToWatch } = FileHandler._getFile();
        /**
         *
         * @param {Object} err
         * @param {Number} bytes
         * @param {ArrayBuffer} buffer
         */
        const readHandler = (err, bytes, buffer) => {
            if (err) throw err;

            if (bytes) {
                const data = buffer.toString('utf8');

                this.eventHandler.emit('watch-data', data);
            }
        };

        /**
         *
         * @param {Number} fd
         */
        const reader = (fd) => {
            read(fd, readHandler);
        };

        open(fileToWatch, (err, fd) => {
            if (err) throw err;

            const interval = this._watchHelper(fd, 5000, reader);

            this.on('close-watch', () => {
                console.info(
                    `Closing file: ${this.fileName} at path: ${this.filePath}`
                );
                clearInterval(interval);
                close(fd, (err) => {
                    if (err) throw err;
                });
            });
        });
    }

    /**
     *
     * @param {Number} fd
     * @param {Number} time
     * @param {Function} cb
     * @returns Async interval
     */
    _watchHelper(fd, time, cb) {
        const interval = setInterval(() => {
            cb(fd);
        }, time);

        return interval;
    }
}

module.exports = FileWatcher;

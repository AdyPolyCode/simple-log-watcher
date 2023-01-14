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
    fileDescriptor;
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
            this.fileDescriptor = 0;
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

        open('asd', (err, fd) => {
            if (err) this._handleClosure(err);

            this.fileDescriptor = fd;

            const interval = this._watchHelper(
                5000,
                this._watchReader(this._watchReadHandler.bind(this))
            );

            this.on('close-watch', () => {
                console.info(
                    `Closing file: ${this.fileName} at path: ${this.filePath}`
                );
                clearInterval(interval);
                this._handleClosure(null);
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
    _watchHelper(time, cb) {
        const interval = setInterval(() => {
            cb();
        }, time);

        return interval;
    }

    /**
     *
     * @param {Number} fd
     * @param {Function} handler
     */
    _watchReader(handler) {
        return () => read(this.fileDescriptor, handler);
    }

    /**
     *
     * @param {Object} err
     * @param {Number} bytes
     * @param {ArrayBuffer} buffer
     */
    _watchReadHandler(err, bytes, buffer) {
        if (err) this._handleClosure(err);

        if (bytes) {
            const data = buffer.toString('utf8');

            this.eventHandler.emit('watch-data', data);
        }
    }

    _handleClosure(error) {
        if (process.env.NODE_ENV === 'dev') {
            console.log('Error caught exiting...\n');

            return setTimeout(() => {
                this._handleError(error);
            }, 3000);
        }

        this._handleError(error);
    }

    _handleError(error) {
        if (error) console.log(error);

        if (this.fileDescriptor)
            return close(this.fileDescriptor, (err) => {
                if (err) console.log(err);
            });

        process.exit(1);
    }
}

module.exports = FileWatcher;

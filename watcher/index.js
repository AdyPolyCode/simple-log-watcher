const FileWatcher = require('./watch');

function run() {
    return FileWatcher.watch();
}

const instance = run();
console.log(
    `File: ${instance.fileName} at path: ${instance.filePath} is being watched`
);

process.on('uncaughtException', (error, origin) => {
    console.error(error.message);
    instance.emit('close-watch');
});

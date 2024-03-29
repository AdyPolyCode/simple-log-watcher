const FileWatcher = require('./watch');

function run(eventHandler) {
    const fileWatcher = FileWatcher.init(eventHandler.getInstance());

    console.log(
        `File: ${fileWatcher.fileName} at path: ${fileWatcher.filePath} is being watched`
    );

    return { start: () => fileWatcher.watch() };
}

module.exports = run;

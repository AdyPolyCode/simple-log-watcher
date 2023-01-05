const { fork } = require('child_process');

// TODO: add all handlers
function runProcesses() {
  const watcher = fork('./watcher/index.js', { killSignal: 'SIGINT' });
}

runProcesses();

process.on('uncaughtException', (error, origin) => {
  console.error(error.message);
});

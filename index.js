const AppFactory = require('./app-factory');
const Server = require('./server');
const Watcher = require('./watcher');
const { ServerEventHandler } = require('./broker/server-event-handler');

function runProcesses() {
  const { server, watcher } = AppFactory.create(
    Server,
    Watcher,
    ServerEventHandler
  );

  watcher.start();
  server.start();
}

runProcesses();

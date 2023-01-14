require('dotenv').config();

const AppFactory = require('./app-factory');
const Server = require('./server');
const Watcher = require('./watcher');
const { ServerEventHandler } = require('./broker/server-event-handler');

function createServerModules(appFactory) {
  return appFactory.create(Server, Watcher, ServerEventHandler);
}

const { server, watcher } = createServerModules(AppFactory);

try {
  // server.start()
  watcher.start();
} catch (error) {
  console.log('Error:, ', error);
}

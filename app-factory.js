class AppFactory {
  static create(Server, Watcher, ServerEventHandler) {
    const watcher = Watcher(ServerEventHandler);
    const server = Server(ServerEventHandler);

    return { server, watcher };
  }
}

module.exports = AppFactory;

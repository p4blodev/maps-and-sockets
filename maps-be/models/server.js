const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const cors = require("cors");
const Sockets = require("./sockets");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.server = http.createServer(this.app);
    this.io = socketio(this.server, {
      /* configurations */
    });
    this.sockets = new Sockets(this.io);
  }

  middlewares() {
    this.app.use(express.static(path.resolve(__dirname, "../public")));
    this.app.use(cors());
  }

  // socketsConfigurations() {
  //   new Sockets(this.io);
  // }

  execute() {
    this.middlewares();
    // this.socketsConfigurations();
    this.server.listen(this.port, () => {
      console.log("server running in port: ", this.port);
    });
  }
}

module.exports = Server;

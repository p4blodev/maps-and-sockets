const MarkersList = require("./markersList");

class Sockets {
  constructor(io) {
    this.io = io;
    this.MarkersList = new MarkersList();
    this.socketEvents();
  }

  socketEvents() {
    // On connection
    this.io.on("connection", (socket) => {
      console.log("🚀 ~ client connected");

      socket.emit("actives-markers", this.MarkersList.actives);

      socket.on("new-marker", (marker) => {
        console.log(
          "🚀 ~ file: sockets.js ~ line 23 ~ Sockets ~ socket.on ~ marker",
          marker
        );
        this.MarkersList.addMarker(marker);

        socket.broadcast.emit("new-marker", marker);
      });

      socket.on("updated-marker", (marker) => {
        this.MarkersList.updateMarker(marker);
        socket.broadcast.emit("updated-marker", marker);
      });
    });
  }
}

module.exports = Sockets;

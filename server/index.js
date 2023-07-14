const app = require("./app");
const { syncAndSeed, User } = require("./db");
const { WebSocketServer } = require("ws");
const socketMap = require("./SocketMap");

// Function to initialize the server and WebSocket connection
const init = async () => {
  try {
    // Synchronize the database and seed initial data
    await syncAndSeed();

    // Set the port for the server to listen on
    const port = process.env.PORT || 3000;
    const server = app.listen(port, () =>
      console.log(`listening on port ${port}`)
    );

    // Create a WebSocket server instance and attach it to the HTTP server
    const socketServer = new WebSocketServer({ server });

    // Handle WebSocket connections
    socketServer.on("connection", (socket) => {
      console.log("connected");

      // Handle socket close event
      socket.on("close", () => {
        const userId = socket.userId;
        delete socketMap[userId];
        console.log("closed");

        // Notify all connected sockets that the user has gone offline
        Object.values(socketMap).forEach((value) => {
          value.socket.send(
            JSON.stringify({ type: "OFFLINE", user: { id: userId } })
          );
        });
      });

      // Handle incoming messages from sockets
      socket.on("message", async (data) => {
        const message = JSON.parse(data);

        if (message.token) {
          // Retrieve the user associated with the token
          const user = await User.findByToken(message.token);

          // Map the socket to the user
          socketMap[user.id] = { socket, user };
          socket.userId = user.id;
          socket.send(JSON.stringify({ status: "online" }));

          // Notify all connected sockets that the user is online
          Object.values(socketMap).forEach((value) => {
            if (value.user.id !== user.id) {
              value.socket.send(
                JSON.stringify({
                  type: "ONLINE",
                  user: { id: user.id, name: user.name, avatar: user.avatar },
                })
              );
            }
          });
        }
      });
    });
  } catch (ex) {
    console.log(ex);
  }
};

// Call the init function to start the server and WebSocket connection
init();

const WebSocket = require("ws");

let wss;

exports.setupWebSocketServer = (server) => {
  wss = new WebSocket.Server({ noServer: true });

  server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  });

  wss.on("connection", (ws) => {
    console.log("✅ New WebSocket connection");

    ws.on("message", (message) => {
      console.log("📩 Received:", message);
      ws.send(`Server received: ${message}`);
    });

    ws.on("close", () => console.log("❌ Client disconnected"));
  });
};

// Function to send real-time updates
exports.notifyUsers = (transaction) => {
  if (!wss) return;

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(transaction));
    }
  });
};

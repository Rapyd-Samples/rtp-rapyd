const express = require("express");
const http = require("http");
const cors = require("cors");
const { setupWebSocketServer } = require("./websocket"); // Import WebSocket setup
const walletRoutes = require("./routes/walletRoutes"); // Import wallet routes

const app = express();

const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Use the wallet routes for any requests under /api/wallet
app.use("/api/wallet", walletRoutes);

setupWebSocketServer(server); // Attached WebSocket to the server

server.listen(4000, () => console.log("Server running on port 4000"));

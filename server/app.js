const express = require("express");
const app = express();
const path = require("path");
app.use(express.json({ limit: "50mb" }));

// Serve static files from their directories

app.use("/dist", express.static(path.join(__dirname, "../dist")));
app.use("/static", express.static(path.join(__dirname, "../static")));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../static/index.html"))
);

// Route Handlers for various endpoints

app.use("/api/auth", require("./api/auth"));
app.use("/api/notifications", require("./api/notifications"));
app.use("/api/team", require("./api/team"));
app.use("/api/users", require("./api/users"));
app.use("/api/messages", require("./api/messages"));
app.use("/api/projects", require("./api/projects"));

module.exports = app;

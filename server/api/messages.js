const express = require("express");
const app = express.Router();
const { isLoggedIn } = require("./middleware");
const socketMap = require("../SocketMap");

app.get("/", isLoggedIn, async (req, res, next) => {
  try {
    res.send(await req.user.messagesForUser());
  } catch (ex) {
    next(ex);
  }
});

module.exports = app;

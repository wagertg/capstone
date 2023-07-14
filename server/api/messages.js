const express = require("express");
const app = express.Router();
const { Message } = require("../db");
const { isLoggedIn } = require("./middleware");
const socketMap = require("../SocketMap");

// Route for fetching all messages for the logged in user.

app.get("/", isLoggedIn, async (req, res, next) => {
  try {
    res.send(await req.user.messagesForUser());
  } catch (ex) {
    next(ex);
  }
});

// Route for sending a message from the logged in user to another user.

app.post("/", isLoggedIn, async (req, res, next) => {
  try {
    res
      .status(201)
      .send(await req.user.sendMessage(req.body.toId, req.body.content));
  } catch (ex) {
    next(ex);
  }
});

// Route for marking a message as read by the logged in user.

app.put("/:id/read", isLoggedIn, async (req, res, next) => {
  try {
    const message = await req.user.readMessage(req.params.id);
    res.send(message);
  } catch (ex) {
    next(ex);
  }
});

// Route for sending a team message from the logged in user.

app.post("/team", isLoggedIn, async (req, res, next) => {
  try {
    res.status(201).send(await req.user.sendTeamMessage(req.body.content));
  } catch (ex) {
    next(ex);
  }
});

// Route for fetching all team messages for the logged in user.

app.get("/team", isLoggedIn, async (req, res, next) => {
  try {
    res.send(await req.user.getTeamMessages());
  } catch (ex) {
    next(ex);
  }
});

// Route for marking a team message as read by the logged in user.

app.put("/team/:id/read", isLoggedIn, async (req, res, next) => {
  try {
    const message = await req.user.readTeamMessage(req.params.id);
    res.send(message);
  } catch (ex) {
    next(ex);
  }
});

module.exports = app;

const express = require("express");
const app = express.Router();
const { Message } = require("../db");
const { isLoggedIn } = require("./middleware");
const socketMap = require("../SocketMap");

app.get("/", isLoggedIn, async (req, res, next) => {
  try {
    res.send(await req.user.messagesForUser());
  } catch (ex) {
    next(ex);
  }
});

app.post("/", isLoggedIn, async (req, res, next) => {
  try {
    res
      .status(201)
      .send(await req.user.sendMessage(req.body.toId, req.body.content));
  } catch (ex) {
    next(ex);
  }
});

app.put("/:id/read", isLoggedIn, async (req, res, next) => {
  try {
    const message = await req.user.readMessage(req.params.id);
    res.send(message);
  } catch (ex) {
    next(ex);
  }
});

app.post("/team", isLoggedIn, async (req, res, next) => {
  try {
    res.status(201).send(await req.user.sendTeamMessage(req.body.content));
  } catch (ex) {
    next(ex);
  }
});

app.get("/team", isLoggedIn, async (req, res, next) => {
  try {
    res.send(await req.user.getTeamMessages());
  } catch (ex) {
    next(ex);
  }
});

app.put("/team/:id/read", isLoggedIn, async (req, res, next) => {
  try {
    const message = await req.user.readTeamMessage(req.params.id);
    res.send(message);
  } catch (ex) {
    next(ex);
  }
});

module.exports = app;

const express = require("express");
const app = express.Router();
const { User } = require("../db");
const { isLoggedIn } = require("./middleware");
const socketMap = require("../SocketMap");

module.exports = app;

app.post("/", async (req, res, next) => {
  try {
    res.send(await User.authenticate(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.post("/register", async (req, res, next) => {
  try {
    const user = await User.create({
      ...req.body,
      avatar: `https://api.dicebear.com/6.x/thumbs/svg?seed=${req.body.username}`,
    });
    res.send(user.generateToken()); // Generate and send an authentication token for the user
  } catch (ex) {
    next(ex);
  }
});

app.get("/", isLoggedIn, (req, res, next) => {
  try {
    res.send(req.user);
  } catch (ex) {
    next(ex);
  }
});

app.put("/", isLoggedIn, async (req, res, next) => {
  try {
    const user = req.user;
    await user.update(req.body);

    const users = await User.findAll({
      attributes: ["id", "name", "avatar", "teamId"],
    });

    // Send updated user information to all connected sockets

    Object.values(socketMap).forEach((value) => {
      value.socket.send(
        JSON.stringify({
          type: "SET_USERS",
          users,
        })
      );
    });

    res.send(user);
  } catch (ex) {
    next(ex);
  }
});

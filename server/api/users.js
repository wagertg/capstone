const express = require("express");
const app = express.Router();
const { User } = require("../db");
const { isLoggedIn } = require("./middleware");
const socketMap = require("../SocketMap");

module.exports = app;

// Route for fetching all users. Only 'id', 'name', 'avatar', and 'teamId' attributes are returned for each user.

app.get("/", isLoggedIn, async (req, res, next) => {
  try {
    res.send(
      await User.findAll({
        attributes: ["id", "name", "avatar", "teamId"],
      })
    );
  } catch (ex) {
    next(ex);
  }
});

// Route for updating a user by id. The updated user's 'id', 'name', 'avatar', and 'teamId' are returned.

app.put("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    await user.update(req.body);

    res.send(
      await User.findByPk(req.params.id, {
        attributes: ["id", "name", "avatar", "teamId"],
      })
    );
  } catch (ex) {
    next(ex);
  }
});

// Route for fetching all currently online users. Only the 'id' attribute is returned for each user.

app.get("/online_users", (req, res, next) => {
  try {
    res.send(
      Object.values(socketMap).map((value) => {
        return { id: value.user.id };
      })
    );
  } catch (ex) {
    next(ex);
  }
});

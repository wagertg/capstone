const express = require("express");
const app = express.Router();
const { Comment, Task } = require("../db");
const { isLoggedIn } = require("./middleware");

app.post("/", async (req, res, next) => {
  try {
    const { taskId, content } = req.body;
    const comment = await Comment.create({ taskId, content });
    res.status(201).send(comment);
  } catch (ex) {
    res.status(500).send({ ex: "Failed to create comment" });
  }
});

app.put("/:id", async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    await comment.update(req.body);
    res.send(comment);
  } catch (ex) {
    res.status(500).send({ ex: "Failed to update comment" });
  }
});

app.delete("/:id", async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    await comment.destroy();
    res.sendStatus(204);
  } catch (ex) {
    res.status(500).send({ error: "Failed to delete comment" });
  }
});

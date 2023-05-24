const express = require("express");
const app = express.Router();
const { Comment, Task } = require("../db");
const { isLoggedIn } = require("./middleware");

app.post("/", async (req, res, next) => {
  try {
    const { taskId, comment } = req.body;
    const userId = req.user.id;
    const newComment = await Comment.create({ taskId, userId, comment });
    res.send(newComment);
  } catch (ex) {
    next(ex);
  }
});

app.put("/:commentId", async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.commentId);
    const updatedComment = await comment.update({
      comment: req.body,
    });
    res.send(updatedComment);
  } catch (error) {
    next(ex);
  }
});

app.delete("/comments/:commentId", async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;
    await Comment.destroy({ where: { id: commentId, userId } });
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

app.get("/tasks/:taskId/comments", async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const comments = await Comment.findAll({
      where: { taskId },
      include: [User],
    });
    res.send(comments);
  } catch (ex) {
    next(ex);
  }
});

const express = require("express");
const app = express.Router();
const { Comment, Task } = require("../db");

app.get("/", async (req, res, next) => {
  try {
    const tasks = await Task.findAll({ include: "comments" });
    res.send(tasks);
  } catch (ex) {
    next(ex);
  }
});

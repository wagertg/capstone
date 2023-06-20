const express = require("express");
const app = express.Router();
const { Task } = require("../db");

app.get("/", async (req, res, next) => {
  try {
    const tasks = await Task.findAll();
    res.send(tasks);
  } catch (ex) {
    next(ex);
  }
});

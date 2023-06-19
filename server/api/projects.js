const express = require("express");
const app = express.Router();
const { Project } = require("../db");


app.get('/', async (req, res, next) => {
  try {
    res.send(await Project.findAll());
  } catch (ex) {
    next(ex);
  }
});

app.post('/', async (req, res, next) => {
  try {
    res.status(201).send(await Project.create(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.delete('/:id', async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    await project.destroy();
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

app.put('/:id', async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    await project.update(req.body);
    res.send(project);
  } catch (ex) {
    next(ex);
  }
});


module.exports = app;

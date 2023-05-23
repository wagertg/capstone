const express = require('express');
const app = express.Router();
const { Team } = require('../db');
const { isLoggedIn } = require('./middleware');

module.exports = app;

app.get('/', async (req, res, next) => {
  try {
    res.send(await Team.findAll());
  } catch (ex) {
    next(ex);
  }
});

app.post('/', async (req, res, next) => {
  try {
    res.status(201).send(await Team.create(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.delete('/:id', async (req, res, next) => {
  try {
    const team = await Team.findByPk(req.params.id);
    await team.destroy();
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

app.put('/:id', async (req, res, next) => {
  try {
    const team = await Team.findByPk(req.params.id);
    await team.update(req.body);
    res.send(team);
  } catch (ex) {
    next(ex);
  }
});

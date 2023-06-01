const express = require('express');
const app = express.Router();
const { User } = require('../db');
const { isLoggedIn } = require('./middleware');
const socketMap = require('../SocketMap');

module.exports = app;

app.get('/', isLoggedIn, async (req, res, next) => {
  try {
    res.send(
      await User.findAll({
        attributes: ['id', 'name', 'avatar', 'teamId']
      })
    );
  } catch (ex) {
    next(ex);
  }
});

app.put('/:id', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    await user.update(req.body);

    res.send(
      await User.findByPk(req.params.id, {
        attributes: ['id', 'name', 'avatar', 'teamId']
      })
    );
  } catch (ex) {
    next(ex);
  }
});

app.get('/online_users', (req, res, next) => {
  try {
    res.send(
      Object.values(socketMap).map(value => {
        return { id: value.user.id };
      })
    );
  } catch (ex) {
    next(ex);
  }
});

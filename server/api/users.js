const express = require('express');
const app = express.Router();
const { isLoggedIn } = require('./middleware');
const socketMap = require('../SocketMap');

module.exports = app;

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

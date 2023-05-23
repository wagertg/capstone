const express = require('express');
const app = express.Router();
const { isLoggedIn } = require('./middleware');

module.exports = app;

app.get('/', isLoggedIn, async (req, res, next) => {
  try {
    res.send(await req.user.getNotifications());
  } catch (ex) {
    next(ex);
  }
});

app.delete('/', isLoggedIn, async (req, res, next) => {
  try {
    res.send(await req.user.removeAllNotifications());
  } catch (ex) {
    next(ex);
  }
});

app.delete('/:id', isLoggedIn, async (req, res, next) => {
  try {
    res.send(await req.user.removeNotification(req.params.id));
  } catch (ex) {
    next(ex);
  }
});

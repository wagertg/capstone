const express = require('express');
const app = express.Router();
const { Project, User, Notification } = require('../db');
const socketMap = require('../SocketMap');

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

    const teamMembers = await User.findAll({
      where: {
        teamId: project.teamId
      }
    });

    teamMembers.forEach(async member => {
      if (
        socketMap[member.id] &&
        socketMap[member.id].user.projectNotification
      ) {
        const notification = await Notification.create({
          type: 'PROJECT_STATUS',
          message: 'has been updated',
          subjectId: project.id,
          userId: member.id
        });

        socketMap[member.id].socket.send(
          JSON.stringify({ type: 'ADD_NOTIFICATION', notification })
        );
      }
    });

    res.send(project);
  } catch (ex) {
    next(ex);
  }
});

app.put('/:id/team', async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    await project.update({ teamId: req.body.teamId });

    const teamMembers = await User.findAll({
      where: {
        teamId: project.teamId
      }
    });

    teamMembers.forEach(async member => {
      if (
        socketMap[member.id] &&
        socketMap[member.id].user.projectNotification
      ) {
        const notification = await Notification.create({
          type: 'PROJECT_STATUS',
          message: 'has been assigned to your team',
          subjectId: project.id,
          userId: member.id
        });

        socketMap[member.id].socket.send(
          JSON.stringify({ type: 'ADD_NOTIFICATION', notification })
        );
      }
    });

    res.send(project);
  } catch (ex) {
    next(ex);
  }
});

module.exports = app;

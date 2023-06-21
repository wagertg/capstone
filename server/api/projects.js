const express = require("express");
const app = express.Router();
const { Project, Task, User, Notification } = require("../db");
const socketMap = require("../SocketMap");
const { isLoggedIn } = require("./middleware");

app.get("/", isLoggedIn, async (req, res, next) => {
  try {
    res.send(await Project.findAll());
  } catch (ex) {
    next(ex);
  }
});

app.post("/", isLoggedIn, async (req, res, next) => {
  try {
    res.status(201).send(await Project.create(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.delete("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    await project.destroy();
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

app.put("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    await project.update(req.body);

    const teamMembers = await User.findAll({
      where: {
        teamId: project.teamId,
      },
    });

    teamMembers.forEach(async (member) => {
      if (
        socketMap[member.id] &&
        socketMap[member.id].user.projectNotification
      ) {
        const notification = await Notification.create({
          type: "PROJECT_STATUS",
          message: "has been updated",
          subjectId: project.id,
          userId: member.id,
        });

        socketMap[member.id].socket.send(
          JSON.stringify({ type: "ADD_NOTIFICATION", notification })
        );
      }
    });

    res.send(project);
  } catch (ex) {
    next(ex);
  }
});

app.put("/:id/team", isLoggedIn, async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    await project.update({ teamId: req.body.teamId });

    const teamMembers = await User.findAll({
      where: {
        teamId: project.teamId,
      },
    });

    teamMembers.forEach(async (member) => {
      if (
        socketMap[member.id] &&
        socketMap[member.id].user.projectNotification
      ) {
        const notification = await Notification.create({
          type: "PROJECT_STATUS",
          message: "has been assigned to your team",
          subjectId: project.id,
          userId: member.id,
        });

        socketMap[member.id].socket.send(
          JSON.stringify({ type: "ADD_NOTIFICATION", notification })
        );
      }
    });

    res.send(project);
  } catch (ex) {
    next(ex);
  }
});

app.get("/:id/tasks", isLoggedIn, async (req, res, next) => {
  try {
    const tasks = await Task.findAll({
      where: {
        projectId: req.params.id,
      },
    });
    res.send(tasks);
  } catch (ex) {
    next(ex);
  }
});

app.post("/:id/tasks", isLoggedIn, async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    const user = await User.findByPk(req.body.userId);

    if (user.teamId !== project.teamId) {
      return res.sendStatus(400);
    }

    const task = await Task.create({ ...req.body, projectId: req.params.id });
    res.status(201).send(task);
  } catch (ex) {
    next(ex);
  }
});

app.delete("/:id/tasks/:taskId", isLoggedIn, async (req, res, next) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.taskId,
        projectId: req.params.id,
      },
    });
    if (task) {
      await task.destroy();
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (ex) {
    next(ex);
  }
});

app.put("/:id/tasks/:taskId", isLoggedIn, async (req, res, next) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.taskId,
        projectId: req.params.id,
      },
    });
    if (task) {
      const project = await Project.findByPk(req.params.id);
      const user = await User.findByPk(req.body.userId);

      if (user.teamId !== project.teamId) {
        return res.sendStatus(400);
      }

      await task.update(req.body);
      res.send(task);
    } else {
      res.sendStatus(404);
    }
  } catch (ex) {
    next(ex);
  }
});

module.exports = app;

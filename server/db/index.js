const conn = require("./conn");
const User = require("./User");
const Team = require("./Team");
const Notification = require("./Notification");
const Message = require("./Message");
const Project = require("./Project");
const Task = require("./Task");

User.belongsTo(Team);
Team.hasMany(User);
Notification.belongsTo(User);
User.hasMany(Notification);
Message.belongsTo(User, { as: "from" });
Message.belongsTo(User, { as: "to" });
Team.hasMany(Message);
Message.belongsTo(Team);
Project.hasMany(Task);
Task.belongsTo(Project);
Project.belongsTo(Team);
User.hasMany(Project);
Project.belongsTo(User);
Task.belongsTo(User);
User.hasMany(Task);

const syncAndSeed = async () => {
  await conn.sync({ force: true });
  try {
    const dream = await Team.create({
      name: "Dream",
      avatar: "https://api.dicebear.com/6.x/shapes/svg?seed=Jasper",
    });
    const nova = await Team.create({
      name: "Nova",
      avatar: "https://api.dicebear.com/6.x/shapes/svg?seed=Jasper",
    });
    const [moe, lucy, larry, ethyl] = await Promise.all([
      User.create({
        name: "Moe M",
        username: "moe",
        password: "123",
        avatar: "https://api.dicebear.com/6.x/thumbs/svg?seed=moe",
        teamId: dream.id,
        isTeamLead: true,
      }),
      User.create({
        name: "Lucy L",
        username: "lucy",
        password: "123",
        avatar: "https://api.dicebear.com/6.x/thumbs/svg?seed=lucy",
        teamId: dream.id,
      }),
      User.create({
        name: "Larry L",
        username: "larry",
        password: "123",
        avatar: "https://api.dicebear.com/6.x/thumbs/svg?seed=larry",
        teamId: nova.id,
      }),
      User.create({
        name: "Ethyl E",
        username: "ethyl",
        password: "123",
        avatar: "https://api.dicebear.com/6.x/thumbs/svg?seed=ethyl",
        teamId: dream.id,
      }),
    ]);
    const ProjectA = await Project.create({
      title: "ProjectA",
      notes:
        "The goal of this project is to come up with an app for financial spending",
      startDate: "6/12/23",
      deadline: "7/1/23",
      priority: "Low",
      userStatus: "25% completed",
      teamId: dream.id,
    });
    const ProjectB = await Project.create({
      title: "ProjectB",
      notes:
        "We want to create a mobile application for keeping track of calories each day",
      startDate: "7/4/23",
      deadline: "7/8/23",
      priority: "High",
      userStatus: "0% completed",
      teamId: nova.id,
    });
    const TaskOne = await Task.create({
      title: "Money strategy",
      startDate: "6/13/23",
      deadline: "6/14/23",
      priority: "High",
      userStatus: "Completed",
      projectId: ProjectA.id,
      userId: moe.id,
    });
    const TaskTwo = await Task.create({
      title: "Layout plan",
      startDate: "6/17/23",
      deadline: "6/18/23",
      priority: "High",
      userStatus: "To Do",
      projectId: ProjectA.id,
      userId: moe.id,
    });
    const TaskThree = await Task.create({
      title: "Make calorie counter",
      startDate: "7/4/23",
      deadline: "7/4/23",
      priority: "High",
      userStatus: "In Progress",
      projectId: ProjectB.id,
      userId: larry.id,
    });
    const TaskFour = await Task.create({
      title: "Counter layout",
      startDate: "7/5/23",
      deadline: "7/6/23",
      priority: "High",
      userStatus: "In Progress",
      projectId: ProjectA.id,
      userId: moe.id,
    });
    const TaskFive = await Task.create({
      title: "Logistics",
      startDate: "7/5/23",
      deadline: "7/6/23",
      priority: "High",
      userStatus: "To Do",
      projectId: ProjectA.id,
      userId: ethyl.id,
    });
    const TaskSix = await Task.create({
      title: "Security management",
      startDate: "7/5/23",
      deadline: "7/6/23",
      priority: "High",
      userStatus: "Completed",
      projectId: ProjectA.id,
      userId: lucy.id,
    });

    const [toMoe, toEthyl] = await Promise.all([
      Message.create({ content: "hey moe!", fromId: lucy.id, toId: moe.id }),
      Message.create({
        content: "hello ethyl",
        fromId: moe.id,
        toId: ethyl.id,
      }),
    ]);

    return {
      users: {
        moe,
        lucy,
        larry,
        ethyl,
      },
    };
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  syncAndSeed,
  User,
  Team,
  Notification,
  Message,
  Task,
  Project,
};

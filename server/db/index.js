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
      }),
      User.create({
        name: "Ethyl E",
        username: "ethyl",
        password: "123",
        avatar: "https://api.dicebear.com/6.x/thumbs/svg?seed=ethyl",
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
      // taskID: TaskOne.id,
      // taskID: TaskTwo.id,
    });
    const ProjectB = await Project.create({
      title: "ProjectB",
      notes:
        "We want to create a mobile application for keeping track of calories each day",
      startDate: "7/4/23",
      deadline: "7/8/23",
      priority: "High",
      userStatus: "0% completed",
      // taskID: TaskThree.id,
      // taskID: TaskFour.id,
    });
    // const TaskOne = await Task.create({
    //   startDate: "6/13/23",
    //   deadline: "6/14/23",
    //   priority: "High",
    //   userStatus: "Completed",
    // })
    // const TaskTwo = await Task.create({
    //   startDate: "6/17/23",
    //   deadline: "6/18/23",
    //   priority: "High",
    //   userStatus: "Stuck!",
    // })
    // const TaskThree = await Task.create({
    //   startDate: "7/4/23",
    //   deadline: "7/4/23",
    //   priority: "High",
    //   userStatus: "Not started",
    // })
    // const TaskFour = await Task.create({
    //   startDate: "7/5/23",
    //   deadline: "7/6/23",
    //   priority: "High",
    //   userStatus: "Not started",
    // })

    const [toMoe, toEthyl] = await Promise.all([
      Message.create({ content: "hey moe!", fromId: lucy.id, toId: moe.id }),
      Message.create({
        content: "hello ethyl",
        fromId: moe.id,
        toId: ethyl.id,
      }),
    ]);

    await Notification.create({
      type: "MESSAGE_STATUS",
      message: "new message",
      userId: moe.id,
      subjectId: toMoe.id,
    });

    await Notification.create({
      type: "PROJECT_STATUS",
      message: "done",
      userId: lucy.id,
      subjectId: ProjectA.id,
    });

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

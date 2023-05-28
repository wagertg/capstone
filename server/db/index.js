const conn = require("./conn");
const User = require("./User");
const Team = require("./Team");
const Comment = require("./Comment");
const Notification = require("./Notification");
const Message = require("./Message");

User.belongsTo(Team);
Team.hasMany(User);
Notification.belongsTo(User);
User.hasMany(Notification);
Comment.belongsTo(User);
//Comment.belongsTo(Task);
//Task.hasMany(Comment);
User.hasMany(Comment);
Message.belongsTo(User, { as: "from" });
Message.belongsTo(User, { as: "to" });

const syncAndSeed = async () => {
  await conn.sync({ force: true });
  const dream = await Team.create({ name: "Dream" });
  const [moe, lucy, larry, ethyl] = await Promise.all([
    User.create({
      name: "Moe M",
      username: "moe",
      password: "123",
      avatar: "https://api.dicebear.com/6.x/thumbs/svg?seed=moe",
      teamId: dream.id,
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
  await Notification.create({
    type: "PROJECT_STATUS",
    message: "done",
    userId: lucy.id,
  });
  await Promise.all([
    Message.create({ content: "hey moe!", fromId: lucy.id, toId: moe.id }),
    Message.create({ content: "hello ethyl", fromId: moe.id, toId: ethyl.id }),
  ]);

  return {
    users: {
      moe,
      lucy,
      larry,
    },
  };
};

module.exports = {
  syncAndSeed,
  User,
  Team,
  Notification,
  Comment,
  Message,
};

const conn = require('./conn');
const User = require('./User');
const Team = require('./Team');
const Comment = require('./Comment');
const Notification = require('./Notification');
const { combineReducers } = require('redux');

User.belongsTo(Team);
Team.hasMany(User);
Notification.belongsTo(User);
User.hasMany(Notification);
Comment.belongsTo(User);
//Comment.belongsTo(Task);
//Task.hasMany(Comment);
User.hasMany(Comment);

const syncAndSeed = async () => {
  await conn.sync({ force: true });
  const [moe, lucy, larry, ethyl] = await Promise.all([
    User.create({ name: 'Moe M', username: 'moe', password: '123' }),
    User.create({ name: 'Lucy L', username: 'lucy', password: '123' }),
    User.create({ name: 'Larry L', username: 'larry', password: '123' }),
    User.create({ name: 'Ethyl E', username: 'ethyl', password: '123' })
  ]);
  Notification.create({
    type: 'PROJECT_STATUS',
    message: 'done',
    userId: lucy.id
  });

  return {
    users: {
      moe,
      lucy,
      larry
    }
  };
};

module.exports = {
  syncAndSeed,
  User,
  Team,
  Notification,
  Comment
};

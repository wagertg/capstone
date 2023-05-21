const conn = require('./conn');
const User = require('./User');
const Team = require('./Team');

User.belongsTo(Team);
Team.hasMany(User);

Notification.belongsTo(User);
User.hasMany(Notification);

const syncAndSeed = async () => {
  await conn.sync({ force: true });
  const [moe, lucy, larry, ethyl] = await Promise.all([
    User.create({ username: 'moe', password: '123' }),
    User.create({ username: 'lucy', password: '123' }),
    User.create({ username: 'larry', password: '123' }),
    User.create({ username: 'ethyl', password: '123' })
  ]);

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
  User
};

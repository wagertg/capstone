const conn = require('./conn');
const { UUID, UUIDV4, STRING } = conn.Sequelize;

const Team = define('team', {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  },

  name: {
    type: STRING,
    allowNull: false,

    validate: {
      notEmpty: true
    }
  }
});

module.exports = Team;

const conn = require("./conn");
const { UUID, UUIDV4, STRING, TEXT } = conn.Sequelize;

const Team = conn.define("team", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },

  name: {
    type: STRING,
    allowNull: false,

    validate: {
      notEmpty: true,
    },
  },
  avatar: {
    type: TEXT,
  },
});

module.exports = Team;

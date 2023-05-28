const conn = require("./conn");
const { STRING, UUID, UUIDV4, TEXT, BOOLEAN } = conn.Sequelize;

const Message = conn.define("message", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  content: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  toId: {
    type: UUID,
    allowNull: false,
  },
  fromId: {
    type: UUID,
    allowNull: false,
  },
});

module.exports = Message;

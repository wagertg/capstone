const conn = require("./conn");
const { STRING, UUID, UUIDV4, TEXT, BOOLEAN } = conn.Sequelize;

const Message = conn.define("message", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  content: {
    type: TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  toId: {
    type: UUID,
    allowNull: true,
  },
  fromId: {
    type: UUID,
    allowNull: false,
  },
  isRead: {
    type: BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  teamId: {
    type: UUID,
    allowNull: true,
  },
});

module.exports = Message;

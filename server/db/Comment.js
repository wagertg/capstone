const conn = require("./conn");
const { STRING, UUID, UUIDV4, TEXT, BOOLEAN } = conn.Sequelize;

const Comment = conn.define("comment", {
  content: {
    type: TEXT,
    allowNull: false,
  },
  userId: {
    type: UUID,
    allowNull: false,
  },
  taskId: {
    type: UUID,
    allowNull: false,
  },
});

module.exports = Comment;

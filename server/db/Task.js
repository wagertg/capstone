const conn = require("./conn");
const { STRING, UUID, UUIDV4, TEXT, BOOLEAN, ENUM, DATE } = conn.Sequelize;

const Task = conn.define("task", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  title: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  startDate: {
    type: DATE,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  deadline: {
    type: DATE,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  priority: {
    type: ENUM("Low", "High"),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  userStatus: {
    type: ENUM("To Do", "In Progress", "Completed"),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  notes: {
    type: TEXT,
  },
});

module.exports = Task;

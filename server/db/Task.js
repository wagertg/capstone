const conn = require('./conn');
const { STRING, UUID, UUIDV4, TEXT, BOOLEAN, ENUM } = conn.Sequelize;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT;


const Task = conn.define('task', {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  },
  startDate: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  deadline: {
    type: STRING,
    allowNull: false, 
    validate: {
      notEmpty: true,
    }
  },
  priority: {
    type: ENUM("Low", "High"),
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  userStatus: {
    type: ENUM("Not started", "In progress", "Stuck!", "Completed"),
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  notes: {
    type: TEXT
  },
  // assignedUser: {
  //   allowNull: false,
  //   validate: {
  //     notEmpty: true,
  //   } 
  // },
});





module.exports = Task;

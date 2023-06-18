const conn = require('./conn');
const { STRING, UUID, UUIDV4, TEXT, BOOLEAN, ENUM } = conn.Sequelize;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT;


const Project = conn.define('project', {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  },
  title: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
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
    type: ENUM("0% completed", "25% completed", "50% completed", "75% completed", "100% completed"),
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  notes: {
    type: TEXT
  },
  isArchieved: {
    type: BOOLEAN
  }
  // assignedUser: {
  //   allowNull: false,
  //   validate: {
  //     notEmpty: true,
  //   }
  // },
});



module.exports = Project;

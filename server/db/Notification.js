const conn = require('./conn');
const { UUID, UUIDV4, STRING, ENUM } = conn.Sequelize;
const Notification = conn.define('notification', {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  },
  type: {
    type: ENUM('PROJECT_STATUS', 'MESSAGE_STATUS'),
    allowNull: false
  },
  message: {
    type: STRING,
    allowNull: false,

    validate: {
      notEmpty: true
    }
  },
  subjectId: {
    type: UUID,
    allowNull: false,

    validate: {
      notEmpty: true
    }
  }
});

module.exports = Notification;

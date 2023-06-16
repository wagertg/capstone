const conn = require("./conn");
const { STRING, UUID, UUIDV4, TEXT, BOOLEAN } = conn.Sequelize;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT;

const User = conn.define("user", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  username: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
    unique: true,
  },
  password: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
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
  isTeamLead: {
    type: BOOLEAN,
    defaultValue: false,
  },
  messageNotification: {
    type: BOOLEAN,
    defaultValue: true,
  },
  projectNotification: {
    type: BOOLEAN,
    defaultValue: true,
  },
});

User.addHook("beforeSave", async (user) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 5);
  }
});

User.findByToken = async function (token) {
  try {
    const { id } = jwt.verify(token, process.env.JWT);
    const user = await this.findByPk(id);
    if (user) {
      return user;
    }
    throw "user not found";
  } catch (ex) {
    const error = new Error("bad credentials");
    error.status = 401;
    throw error;
  }
};

User.prototype.generateToken = function () {
  return jwt.sign({ id: this.id }, JWT);
};

User.prototype.getNotifications = async function () {
  return await conn.models.notification.findAll({
    where: {
      userId: this.id,
    },
  });
};

User.prototype.removeNotification = async function (id) {
  const notification = await conn.models.notification.findByPk(id);
  await notification.destroy();
};

User.prototype.removeAllNotifications = async function () {
  conn.models.notification.destroy({
    where: {
      userId: this.id,
    },
  });
};

User.authenticate = async function ({ username, password }) {
  const user = await this.findOne({
    where: {
      username,
    },
  });
  if (user && (await bcrypt.compare(password, user.password))) {
    return jwt.sign({ id: user.id }, JWT);
  }
  const error = new Error("bad credentials");
  error.status = 401;
  throw error;
};

User.prototype.sendMessage = function (toId, content) {
  return conn.models.message.create({
    content: content,
    fromId: this.id,
    toId: toId,
  });
};

User.prototype.messagesForUser = function () {
  return conn.models.message.findAll({
    where: {
      [conn.Sequelize.Op.or]: [
        {
          toId: this.id,
        },
        {
          fromId: this.id,
        },
      ],
    },
    include: [
      {
        model: User,
        as: "from",
        attributes: ["username", "id"],
      },
      {
        model: User,
        as: "to",
        attributes: ["username", "id"],
      },
    ],
  });
};

User.prototype.readMessage = async function (messageId) {
  const message = await conn.models.message.findByPk(messageId);
  if (message && message.toId === this.id) {
    message.isRead = true;
    await message.save();
    return message;
  }
  throw new Error("Message not found or user unauthorized");
};

User.prototype.getTeamMessages = async function () {
  const team = await this.getTeam();
  const messages = await conn.models.message.findAll({
    where: {
      teamId: team.id,
    },
  });
  return messages;
};

User.prototype.sendTeamMessage = async function (content) {
  const team = await this.getTeam();
  return conn.models.message.create({
    content: content,
    fromId: this.id,
    teamId: team.id,
  });
};

User.prototype.readTeamMessage = async function (messageId) {
  const team = await this.getTeam();
  const message = await conn.models.message.findOne({
    where: {
      id: messageId,
      teamId: team.id,
    },
  });
  if (message) {
    message.isRead = true;
    await message.save();
    return message;
  }
  throw new Error("Message not found or user unauthorized");
};

module.exports = User;

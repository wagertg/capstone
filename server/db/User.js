const conn = require("./conn");
const { STRING, UUID, UUIDV4, TEXT, BOOLEAN } = conn.Sequelize;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT;
const socketMap = require("../SocketMap");

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

// This hook encrypts the user's password before it is saved to the database.

User.addHook("beforeSave", async (user) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 5);
  }
});

// This function uses a token to find a user in the database.

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

// This method generates a JWT for a user instance.

User.prototype.generateToken = function () {
  return jwt.sign({ id: this.id }, JWT);
};

// This method fetches all notifications for a user instance.

User.prototype.getNotifications = async function () {
  return await conn.models.notification.findAll({
    where: {
      userId: this.id,
    },
  });
};

// This method removes a specific notification for a user instance.

User.prototype.removeNotification = async function (id) {
  const notification = await conn.models.notification.findByPk(id);
  await notification.destroy();
};

// This method removes all notifications for a user instance.

User.prototype.removeAllNotifications = async function () {
  conn.models.notification.destroy({
    where: {
      userId: this.id,
    },
  });
};

// This static method authenticates a user and returns a JWT if successful.

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

// This method allows a user instance to send a message to another user.

User.prototype.sendMessage = async function (toId, content) {
  const message = await conn.models.message.create({
    content: content,
    fromId: this.id,
    toId: toId,
  });

  const user = await conn.models.user.findByPk(toId);

  if (user.messageNotification) {
    await conn.models.notification.create({
      type: "MESSAGE_STATUS",
      message: "sent a new message",
      subjectId: message.id,
      userId: toId,
    });
  }

  const toUser = socketMap[toId];

  if (toUser) {
    toUser.socket.send(
      JSON.stringify({ type: "NEW_INDIVIDUAL_MESSAGE", message })
    );
    if (toUser.user.messageNotification) {
      const notification = await conn.models.notification.findAll({
        where: {
          subjectId: message.id,
        },
      });
      toUser.socket.send(
        JSON.stringify({ type: "ADD_NOTIFICATION", notification })
      );
    }
  }
  return message;
};

// This method fetches all messages to and from a user instance.

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

// This method allows a user instance to mark a message as read.

User.prototype.readMessage = async function (messageId) {
  const message = await conn.models.message.findByPk(messageId);
  if (message && message.toId === this.id) {
    message.isRead = true;
    await message.save();
    return message;
  }
  throw new Error("Message not found or user unauthorized");
};

// This method fetches all messages for a team that a user instance is part of.

User.prototype.getTeamMessages = async function () {
  const team = await this.getTeam();
  const messages = await conn.models.message.findAll({
    where: {
      teamId: team.id,
    },
  });
  return messages;
};

// This method allows a user instance to send a message to their team.

User.prototype.sendTeamMessage = async function (content) {
  const team = await this.getTeam();

  let message = await conn.models.message.create({
    content: content,
    fromId: this.id,
    teamId: team.id,
  });

  message = await conn.models.message.findByPk(message.id, {
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
  const teamMembers = await team.getUsers();
  teamMembers.forEach(async (member) => {
    if (member.messageNotification) {
      await conn.models.notification.create({
        type: "TEAM_MESSAGE_STATUS",
        message: "sent a new message",
        subjectId: message.id,
        userId: member.id,
      });
    }

    if (member.id !== this.id && socketMap[member.id]) {
      socketMap[member.id].socket.send(
        JSON.stringify({ type: "NEW_TEAM_MESSAGE", message })
      );

      if (
        socketMap[member.id] &&
        socketMap[member.id].user.messageNotification
      ) {
        const notification = await conn.models.notification.findAll({
          where: {
            subjectId: message.id,
          },
        });

        socketMap[member.id].socket.send(
          JSON.stringify({ type: "ADD_NOTIFICATION", notification })
        );
      }
    }
  });

  return message;
};

// This method allows a user instance to mark a team message as read.

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

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendMessage,
  fetchMessages,
  readMessage,
  fetchTeamMessages,
  sendTeamMessage,
  readTeamMessage,
} from "../store/messages";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  AvatarGroup,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/system";
import SendIcon from "@mui/icons-material/Send";
import BadgedAvatar from "./BadgedAvatar";

const DateBubble = styled(Box)({
  alignSelf: "center",
  justifyContent: "center",
  color: "black",
  padding: "0.5em 1em",
  marginBottom: "1em",
});

const UserList = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "20vh",
  borderBottom: "1px solid gray",
  padding: "1em",
});

const Sidebar = styled(Box)({
  overflow: "auto",
  width: "30%",
  height: "100vh",
  borderRight: "1px solid gray",
});

const ChatArea = styled(Box)({
  overflow: "auto",
  width: "70%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
});

const ChatWrapper = styled(Box)({
  overflow: "auto",
  flex: 1,
  padding: "4em",
});

const MessageBox = styled(Paper)(({ owner }) => ({
  maxWidth: "100%",
  margin: "10px 0",
  padding: "1em",
  backgroundColor: owner === "true" ? "#9FA8DA" : "#B2DFDB",
  borderRadius: owner === "true" ? "10px 10px 0 10px" : "10px 10px 10px 0",
}));

const MessageInputWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  padding: "2em",
  borderTop: "1px solid gray",
});

const MessageWrapper = styled(Box)(({ owner }) => ({
  maxWidth: "50%",
  margin: owner === "true" ? "10px 10px 10px auto" : "10px auto 10px 10px",
}));

const ChatHeader = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "2em",
  borderBottom: "1px solid gray",
});

const Message = () => {
  const { individualMessages, teamMessages } = useSelector(
    (state) => state.messages
  );
  const { auth, users, teams } = useSelector((state) => state);
  const [messageContent, setMessageContent] = useState({});
  const [receiverId, setReceiverId] = useState(null);
  const [teamId, setTeamId] = useState(null);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMessages());
    dispatch(fetchTeamMessages());
  }, [dispatch]);

  useEffect(() => {
    if (window.socket) {
      window.socket.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        dispatch(readMessage(message.id));
      });
    }
  }, [dispatch]);

  const createMessage = (content, toId) => {
    if (window.socket && window.socket.readyState === WebSocket.OPEN) {
      window.socket.send(
        JSON.stringify({ fromId: auth.userId, toId, content })
      );
      dispatch(sendMessage({ toId, content }));
    }
  };

  const createTeamMessage = (content, toTeamId) => {
    if (window.socket && window.socket.readyState === WebSocket.OPEN) {
      window.socket.send(
        JSON.stringify({ fromId: auth.userId, toTeamId, content })
      );
      dispatch(sendTeamMessage({ toTeamId, content }));
    }
  };

  const handleInputChange = (event) => {
    setMessageContent((prevState) => ({
      ...prevState,
      [receiverId]: event.target.value,
    }));
  };

  const handleTeamInputChange = (event) => {
    setMessageContent((prevState) => ({
      ...prevState,
      [teamId]: event.target.value,
    }));
  };

  const handleSendClick = (ev) => {
    ev.preventDefault();
    createMessage(messageContent[receiverId], receiverId);
    setMessageContent((prevState) => ({
      ...prevState,
      [receiverId]: "",
    }));
  };

  const handleSendTeamClick = (ev) => {
    ev.preventDefault();
    createTeamMessage(messageContent[teamId], teamId);
    setMessageContent((prevState) => ({
      ...prevState,
      [teamId]: "",
    }));
  };

  const messagesByUser = individualMessages.reduce((prev, curr) => {
    const key = curr.fromId === auth.id ? curr.toId : curr.fromId;
    if (!prev[key]) {
      prev[key] = [];
    }
    prev[key].push(curr);
    return prev;
  }, {});

  const messagesByTeam = teamMessages.reduce((prev, curr) => {
    const key = curr.teamId;
    if (!prev[key]) {
      prev[key] = [];
    }
    prev[key].push(curr);
    return prev;
  }, {});

  const recentMessagesByUser = Object.keys(messagesByUser).reduce(
    (prev, curr) => {
      messagesByUser[curr].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      prev[curr] = messagesByUser[curr][0];
      return prev;
    },
    {}
  );

  const recentMessagesByTeam = Object.keys(messagesByTeam).reduce(
    (prev, curr) => {
      messagesByTeam[curr].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      prev[curr] = messagesByTeam[curr][0];
      return prev;
    },
    {}
  );

  const sortedUsers = [...users]
    .filter((user) => user.id !== auth.id)
    .filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const latestMessageA = recentMessagesByUser[a.id];
      const latestMessageB = recentMessagesByUser[b.id];

      if (!latestMessageA && !latestMessageB) return 0;
      if (!latestMessageA) return 1;
      if (!latestMessageB) return -1;

      return (
        new Date(latestMessageB.createdAt) - new Date(latestMessageA.createdAt)
      );
    });

  const formatMessageDate = (dateString) => {
    const messageDate = new Date(dateString);
    const now = new Date();
    const twentyFourHoursAgo = now.setHours(now.getHours() - 24);

    if (messageDate > twentyFourHoursAgo) {
      return messageDate.toLocaleTimeString();
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const usersWithOpenConversations = sortedUsers.filter(
    (user) => messagesByUser[user.id]
  );

  const teamsWithOpenConversations = teams.filter(
    (team) => messagesByTeam[team.id]
  );

  const userIdToName = users.reduce((prev, curr) => {
    prev[curr.id] = curr.name;
    return prev;
  }, {});

  const startConversation = (userId) => {
    setReceiverId(userId);
    setTeamId(null);
    const recentMessage = recentMessagesByUser[userId];
    if (
      recentMessage &&
      recentMessage.fromId !== auth.id &&
      !recentMessage.isRead
    ) {
      dispatch(readMessage(recentMessage.id));
    }
  };

  const startTeamConversation = (teamId) => {
    setTeamId(teamId);
    setReceiverId(null);
    const recentMessage = recentMessagesByTeam[teamId];
    if (
      recentMessage &&
      recentMessage.fromId !== auth.id &&
      !recentMessage.isRead
    ) {
      dispatch(readTeamMessage(recentMessage.id));
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "100%",
      }}
    >
      <Sidebar>
        <UserList>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              {teams
                .filter((team) => team.id === auth.teamId)
                .map((team) => (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "row",
                      cursor: "pointer",
                      alignItems: "center",
                    }}
                    key={team.id}
                    onClick={() => startTeamConversation(team.id)}
                  >
                    <Avatar
                      id={team.id}
                      src={team.avatar}
                      sx={{ mb: 1, mr: 1, width: 50, height: 50 }}
                    />
                    <Typography>{team.name}</Typography>
                  </Box>
                ))}
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              {sortedUsers.map((user) => (
                <Box
                  key={user.id}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    margin: "2%",
                  }}
                  onClick={() => startConversation(user.id)}
                >
                  <BadgedAvatar id={user.id} src={user.avatar} sx={{ mb: 1 }} />
                  <Typography>{user.name}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              marginTop: ".5em",
            }}
          >
            <TextField
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>
        </UserList>

        <List>
          {teamsWithOpenConversations.map((team) => {
            const recentMessage = recentMessagesByTeam[team.id];
            const isUnreadIncomingMessage =
              recentMessage &&
              recentMessage.fromId !== auth.id &&
              !recentMessage.isRead;

            return (
              <ListItem
                key={team.id}
                button
                onClick={() => startTeamConversation(team.id)}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ListItemAvatar>
                    <Avatar id={team.id} src={team.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={team.name}
                    secondary={
                      recentMessage
                        ? `${userIdToName[recentMessage.fromId]}: ${
                            recentMessage.content
                          } at ${formatMessageDate(recentMessage.createdAt)}`
                        : null
                    }
                  />
                </Box>
                <Badge
                  overlap="circular"
                  variant="dot"
                  color={isUnreadIncomingMessage ? "success" : "default"}
                  sx={{
                    alignSelf: "center",
                    visibility: isUnreadIncomingMessage ? "visible" : "hidden",
                  }}
                >
                  <Box />
                </Badge>
              </ListItem>
            );
          })}
          {usersWithOpenConversations.map((user) => {
            const recentMessage = recentMessagesByUser[user.id];
            const isUnreadIncomingMessage =
              recentMessage &&
              recentMessage.fromId !== auth.id &&
              !recentMessage.isRead;
            return (
              <ListItem
                key={user.id}
                button
                onClick={() => startConversation(user.id)}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ListItemAvatar>
                    <BadgedAvatar id={user.id} src={user.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.name}
                    secondary={
                      recentMessage
                        ? `${
                            recentMessage.fromId === auth.id
                              ? "Me"
                              : userIdToName[recentMessage.fromId]
                          }: ${recentMessage.content} at ${formatMessageDate(
                            recentMessage.createdAt
                          )}`
                        : null
                    }
                  />
                </Box>
                <Badge
                  overlap="circular"
                  variant="dot"
                  color={isUnreadIncomingMessage ? "success" : "default"}
                  sx={{
                    alignSelf: "center",
                    visibility: isUnreadIncomingMessage ? "visible" : "hidden",
                  }}
                >
                  <Box />
                </Badge>
              </ListItem>
            );
          })}
        </List>
      </Sidebar>
      <ChatArea>
        <ChatHeader>
          {receiverId && (
            <>
              <BadgedAvatar
                id={receiverId}
                src={users.find((user) => user.id === receiverId)?.avatar}
                sx={{ mr: 2 }}
              />
              <Typography sx={{ ml: 1 }} variant="h5">
                {receiverId ? `${userIdToName[receiverId]}` : "Messages"}
              </Typography>
            </>
          )}

          {teamId && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  src={teams.find((team) => team.id === teamId)?.avatar}
                  sx={{ mr: 1 }}
                />
                <Typography variant="h5">
                  {teamId
                    ? `${teams.find((team) => team.id === teamId)?.name}`
                    : "Messages"}
                </Typography>
              </Box>
              <Box>
                <AvatarGroup
                  sx={{ display: "flex", justifyContent: "center", mt: 1 }}
                >
                  {users
                    .filter((user) => user.teamId === teamId)
                    .map((user) => (
                      <BadgedAvatar
                        key={user.id}
                        id={user.id}
                        src={user.avatar}
                        sx={{ mr: 1 }}
                      />
                    ))}
                </AvatarGroup>
              </Box>
            </Box>
          )}
        </ChatHeader>

        {receiverId && (
          <>
            <ChatWrapper>
              {individualMessages
                .filter(
                  (message) =>
                    (message.fromId === auth.id &&
                      message.toId === receiverId) ||
                    (message.fromId === receiverId && message.toId === auth.id)
                )
                .map((message) => (
                  <MessageWrapper
                    key={message.id}
                    owner={(message.fromId === auth.id).toString()}
                  >
                    <MessageBox owner={(message.fromId === auth.id).toString()}>
                      <BadgedAvatar
                        id={message.fromId}
                        src={
                          users.find((user) => user.id === message.fromId)
                            ?.avatar
                        }
                        sx={{ mr: 1, mb: 1 }}
                      />

                      <Typography>{message.content}</Typography>
                    </MessageBox>
                    <DateBubble>
                      <Typography variant="caption">
                        {formatMessageDate(message.createdAt)}
                      </Typography>
                    </DateBubble>
                  </MessageWrapper>
                ))}
            </ChatWrapper>
            <MessageInputWrapper>
              <Box
                component="form"
                onSubmit={handleSendClick}
                sx={{ display: "flex", alignItems: "center", flex: 1 }}
              >
                <TextField
                  value={messageContent[receiverId] || ""}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  sx={{ mr: 2 }}
                />

                <Button
                  fontSize="large"
                  type="submit"
                  variant="text"
                  color="primary"
                >
                  <SendIcon fontSize="large" />
                </Button>
              </Box>{" "}
            </MessageInputWrapper>
          </>
        )}

        {teamId && (
          <>
            <ChatWrapper>
              {teamMessages
                .filter((message) => message.teamId === teamId)
                .map((message) => (
                  <MessageWrapper
                    key={message.id}
                    owner={(message.fromId === auth.id).toString()}
                  >
                    <MessageBox owner={(message.fromId === auth.id).toString()}>
                      <BadgedAvatar
                        id={message.fromId}
                        src={
                          users.find((user) => user.id === message.fromId)
                            ?.avatar
                        }
                        sx={{ mr: 1, mb: 1 }}
                      />

                      <Typography>{message.content}</Typography>
                    </MessageBox>
                    <DateBubble>
                      <Typography variant="caption">
                        {formatMessageDate(message.createdAt)}
                      </Typography>
                    </DateBubble>
                  </MessageWrapper>
                ))}
            </ChatWrapper>
            <MessageInputWrapper>
              <Box
                component="form"
                onSubmit={handleSendTeamClick}
                sx={{ display: "flex", alignItems: "center", flex: 1 }}
              >
                <TextField
                  value={messageContent[teamId] || ""}
                  onChange={handleTeamInputChange}
                  variant="outlined"
                  fullWidth
                  sx={{ mr: 2 }}
                />
                <Button
                  fontSize="large"
                  type="submit"
                  variant="text"
                  color="primary"
                >
                  <SendIcon fontSize="large" />
                </Button>
              </Box>{" "}
            </MessageInputWrapper>
          </>
        )}
      </ChatArea>
    </Box>
  );
};

export default Message;

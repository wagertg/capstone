import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Routes, Route, useLocation } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Nav from "./Navigation/Nav";
import Team from "./Team";
import CreateAccount from "./CreateAccount";
import AdminPanel from "./AdminPanel";
import Message from "./Message";
import Projects from "./Projects";
import ProjectArchieve from "./ProjectArchieve";
import Project from "./Project";
import Profile from "./Profile";
import {
  loginWithToken,
  fetchNotifications,
  removeAllNotifications,
  fetchOnlineUsers,
  fetchUsers,
  fetchTeams,
  fetchMessages,
  sendMessage,
  readMessage,
  fetchTeamMessages,
  sendTeamMessage,
  readTeamMessage,
  fetchProjects,
  fetchTasks,
} from "../store";

import { IconButton, Snackbar, Stack } from "@mui/material";

import { Close } from "@mui/icons-material";
import BadgedAvatar from "./BadgedAvatar";

const App = () => {
  const { auth, users } = useSelector((state) => state);
  const [open, setOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const dispatch = useDispatch();
  const location = useLocation();
  const prevAuth = useRef({});
  const prevLocation = useRef("/");

  // This function is responsible for displaying a snackbar notification based on the `newMessage` object received as an argument.

  const showSnackBar = (newMessage) => {
    if (newMessage.type === "ONLINE" || newMessage.type === "OFFLINE") {
      console.log(newMessage);
      setNotificationMessage(
        <Stack spacing={4} direction="row">
          <BadgedAvatar id={newMessage.user.id} />
          {`${newMessage.user.name} is now ${newMessage.type.toLowerCase()}`}
        </Stack>
      );
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  // This action attempts to log in the user using the token stored in the local storage. It has an empty array, so it only runs once on component mount.

  useEffect(() => {
    dispatch(loginWithToken());
  }, []);

  // Updates the prevLocation ref whenever the `location` object changes. The ref stores the previous location in the application, helping track navigation history.

  useEffect(() => {
    prevLocation.current = location.pathname;
  }, [location]);

  // handles the login and logout scenarios based on changes in the auth object
  // Dispatches actions to fetch data, establishes a WebSocket connection, and set up event listeners for different types of WebSocket messages.
  //  Upon connection, it sends the user's token to the server through the WebSocket connection.
  //  Handles incoming WebSocket messages and dispatches corresponding actions based on the message types.

  useEffect(() => {
    if (!prevAuth.current.id && auth.id) {
      console.log("logged in");
      dispatch(fetchNotifications());
      dispatch(fetchUsers());
      dispatch(fetchTeams());
      dispatch(fetchMessages());
      dispatch(fetchTeamMessages());
      dispatch(fetchProjects());
      dispatch(fetchTasks());

      window.socket = new WebSocket(
        window.location.origin.replace("http", "ws")
      );

      window.socket.addEventListener("open", () => {
        window.socket.send(
          JSON.stringify({ token: window.localStorage.getItem("token") })
        );
      });

      window.socket.addEventListener("message", (ev) => {
        const message = JSON.parse(ev.data);

        if (message.type) {
          if (message.type === "SEND_MESSAGE") {
            dispatch(sendMessage(message));
          } else if (message.type === "READ_MESSAGE") {
            dispatch(readMessage(message.id));
          } else if (message.type === "SEND_TEAM_MESSAGE") {
            dispatch(sendTeamMessage(message));
          } else if (message.type === "READ_TEAM_MESSAGE") {
            dispatch(readTeamMessage(message.id));
          } else {
            dispatch(message);
            console.log(message);
            showSnackBar(message);
          }
        }

        if (message.status && message.status === "online") {
          dispatch(fetchOnlineUsers());
        }
      });
    } else if (prevAuth.current.id && !auth.id) {
      console.log("logged out");
      window.socket.close();
      dispatch(removeAllNotifications());
    }
  }, [auth]);

  // Updates the `prevAuth` and `prevLocation` refs after each render.

  useEffect(() => {
    prevAuth.current = auth;
    prevLocation.current = location.pathname;
  });

  return (
    <div>
      <Nav />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<Login prevLocation={prevLocation.current} />}
          />
          <Route
            path="/register"
            element={<CreateAccount prevLocation={prevLocation.current} />}
          />
          <Route path="/team/:id" element={<Team />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/message" element={<Message />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/projects/:id" element={<Project />} />
          <Route path="/projects/archieved" element={<ProjectArchieve />} />
        </Routes>
      </div>
      <Snackbar
        ContentProps={{
          sx: {
            background: "gray",
          },
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={notificationMessage}
        action={
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        }
      />
    </div>
  );
};

export default App;

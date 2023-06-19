import React, { useEffect, useRef } from "react";
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
} from "../store";

const App = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const location = useLocation();
  const prevAuth = useRef({});
  const prevLocation = useRef("/");

  console.log(`current location: ${location.pathname}`);
  console.log(`previous location: ${prevLocation.current}`);

  useEffect(() => {
    dispatch(loginWithToken());
  }, []);

  useEffect(() => {
    prevLocation.current = location.pathname;
  }, [location]);

  useEffect(() => {
    if (!prevAuth.current.id && auth.id) {
      console.log("logged in");
      dispatch(fetchNotifications());
      dispatch(fetchUsers());
      dispatch(fetchTeams());
      dispatch(fetchMessages());
      dispatch(fetchTeamMessages());
      dispatch(fetchProjects());

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
          <Route path="/projects/:id" element={<Project />} />
          <Route path="/projects/archieved" element={<ProjectArchieve />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;

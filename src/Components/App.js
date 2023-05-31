import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Routes, Route, useLocation } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Nav from "./Navigation/Nav";
import Team from "./Team";
import CreateAccount from "./CreateAccount";
import Message from "./Message";
import {
  loginWithToken,
  fetchNotifications,
  removeAllNotifications,
  fetchOnlineUsers,
  fetchUsers,
  fetchTeams,
  fetchMessages,
  sendMessage,
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
          <Route path="/team" element={<Team />} />
          <Route path="/message" element={<Message />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;

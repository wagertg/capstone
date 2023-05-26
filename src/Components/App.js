import React, { useEffect, useRef } from 'react';
import Home from './Home';
import Login from './Login';
import { useSelector, useDispatch } from 'react-redux';
import {
  loginWithToken,
  fetchNotifications,
  removeAllNotifications,
  fetchOnlineUsers,
  fetchUsers,
  fetchTeams
} from '../store';
import { Link, Routes, Route } from 'react-router-dom';
import Nav from './Nav';
import Team from './Team';

const App = () => {
  const { auth } = useSelector(state => state);
  const dispatch = useDispatch();
  const prevAuth = useRef({});

  useEffect(() => {
    dispatch(loginWithToken());
  }, []);

  useEffect(() => {
    if (!prevAuth.current.id && auth.id) {
      console.log('logged in');
      dispatch(fetchNotifications());
      dispatch(fetchUsers());
      dispatch(fetchTeams());

      window.socket = new WebSocket(
        window.location.origin.replace('http', 'ws')
      );

      window.socket.addEventListener('open', () => {
        window.socket.send(
          JSON.stringify({ token: window.localStorage.getItem('token') })
        );
      });

      window.socket.addEventListener('message', ev => {
        const message = JSON.parse(ev.data);

        if (message.type) {
          dispatch(message);
        }
        if (message.status && message.status === 'online') {
          dispatch(fetchOnlineUsers());
        }
      });
    } else if (prevAuth.current.id && !auth.id) {
      console.log('logged out');
      window.socket.close();
      dispatch(removeAllNotifications());
    }
  }, [auth]);

  useEffect(() => {
    prevAuth.current = auth;
  });

  return (
    <div>
      <Nav />
      <div>
        <Routes>
          <Route
            path='/'
            element={<Home />}
          />
          <Route
            path='/login'
            element={<Login />}
          />
          <Route
            path='/team'
            element={<Team />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;

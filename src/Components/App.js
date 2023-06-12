import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Nav from './Navigation/Nav';
import Team from './Team';
import CreateAccount from './CreateAccount';
import AdminPanel from './AdminPanel';
import Message from './Message';
import {
  loginWithToken,
  fetchNotifications,
  removeAllNotifications,
  fetchOnlineUsers,
  fetchUsers,
  fetchTeams,
  fetchMessages,
  sendMessage
} from '../store';

import { IconButton, Snackbar, Stack } from '@mui/material';

import { Close } from '@mui/icons-material';
import BadgedAvatar from './BadgedAvatar';

const App = () => {
  const { auth } = useSelector(state => state);
  const [open, setOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const dispatch = useDispatch();
  const location = useLocation();
  const prevAuth = useRef({});
  const prevLocation = useRef('/');

  const showSnackBar = newMessage => {
    setNotificationMessage(
      <Stack
        spacing={4}
        direction='row'
      >
        <BadgedAvatar id={newMessage.user.id} />
        {`${newMessage.user.name} is now ${newMessage.type.toLowerCase()}`}
      </Stack>
    );
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    dispatch(loginWithToken());
  }, []);

  useEffect(() => {
    prevLocation.current = location.pathname;
  }, [location]);

  useEffect(() => {
    if (!prevAuth.current.id && auth.id) {
      console.log('logged in');
      dispatch(fetchNotifications());
      dispatch(fetchUsers());
      dispatch(fetchTeams());
      dispatch(fetchMessages());

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
          if (message.type === 'SEND_MESSAGE') {
            dispatch(sendMessage(message));
          } else {
            dispatch(message);
            showSnackBar(message);
          }
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
    prevLocation.current = location.pathname;
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
            element={<Login prevLocation={prevLocation.current} />}
          />
          <Route
            path='/register'
            element={<CreateAccount prevLocation={prevLocation.current} />}
          />
          <Route
            path='/team/:id'
            element={<Team />}
          />
          <Route
            path='/admin'
            element={<AdminPanel />}
          />
          <Route
            path='/message'
            element={<Message />}
          />
        </Routes>
      </div>
      <Snackbar
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

import React, { useEffect, useRef } from 'react';
import Home from './Home';
import Login from './Login';
import { useSelector, useDispatch } from 'react-redux';
import {
  loginWithToken,
  fetchNotifications,
  removeAllNotifications
} from '../store';
import { Link, Routes, Route } from 'react-router-dom';
import Nav from './Nav';

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
    } else if (prevAuth.current.id && !auth.id) {
      console.log('logged out');
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
        </Routes>
      </div>
    </div>
  );
};

export default App;

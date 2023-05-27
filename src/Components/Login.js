import React, { useState } from 'react';
import { attemptLogin, register } from '../store';
import { useDispatch } from 'react-redux';
import { TextField, Button, Typography } from '@mui/material';

const Login = () => {
  const dispatch = useDispatch();
  const [changeForm, setChangeForm] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const onChange = ev => {
    setCredentials({ ...credentials, [ev.target.name]: ev.target.value });
  };

  const login = ev => {
    ev.preventDefault();
    dispatch(attemptLogin(credentials));
  };

  const create = ev => {
    ev.preventDefault();
    dispatch(register({ ...credentials, name: credentials.username }));
  };

  return (
    <div>
      <Typography variant='h2'>
        {changeForm ? 'Create Account' : 'Login'}
      </Typography>
      <Button
        onClick={
          changeForm ? () => setChangeForm(false) : () => setChangeForm(true)
        }
      >
        {changeForm ? 'Login' : 'Create Account'}
      </Button>
      <form onSubmit={changeForm ? create : login}>
        <TextField
          placeholder='username'
          value={credentials.username}
          name='username'
          onChange={onChange}
        />
        <TextField
          placeholder='password'
          name='password'
          value={credentials.password}
          onChange={onChange}
        />
        <Button type='submit'>{changeForm ? 'Create Account' : 'Login'}</Button>
      </form>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { register } from '../store';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { TextField, Button, Typography } from '@mui/material';

const CreateAccount = ({ prevLocation }) => {
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    name: ''
  });

  const onChange = ev => {
    setCredentials({ ...credentials, [ev.target.name]: ev.target.value });
  };

  const create = ev => {
    ev.preventDefault();
    dispatch(register(credentials));
    navigate('/');
  };

  return (
    <div>
      <Typography variant='h2'>Create Account</Typography>
      <Button
        component={RouterLink}
        to='/login'
      >
        Login
      </Button>
      <form onSubmit={create}>
        <TextField
          required
          placeholder='name'
          value={credentials.name}
          name='name'
          onChange={onChange}
        />
        <TextField
          required
          placeholder='username'
          value={credentials.username}
          name='username'
          onChange={onChange}
        />
        <TextField
          required
          placeholder='password'
          name='password'
          value={credentials.password}
          onChange={onChange}
        />
        <Button type='submit'>Create Account</Button>
      </form>
    </div>
  );
};

export default CreateAccount;

import React, { useState } from "react";
import { attemptLogin, register } from "../store";
import { useDispatch } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { TextField, Button, Typography } from "@mui/material";

const Login = ({ prevLocation }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const onChange = (ev) => {
    setCredentials({ ...credentials, [ev.target.name]: ev.target.value });
  };

  const login = (ev) => {
    ev.preventDefault();
    dispatch(attemptLogin(credentials));
    navigate(prevLocation);
  };

  return (
    <div>
      <Typography variant="h2">Login</Typography>
      <Button component={RouterLink} to="/register">
        Create Account
      </Button>
      <form onSubmit={login}>
        <TextField
          placeholder="username"
          value={credentials.username}
          name="username"
          onChange={onChange}
        />
        <TextField
          placeholder="password"
          name="password"
          value={credentials.password}
          onChange={onChange}
        />
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
};

export default Login;

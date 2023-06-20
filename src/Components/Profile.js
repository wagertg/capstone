import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { updateAuth } from '../store';
import BadgedAvatar from './BadgedAvatar';

import {
  Typography,
  Box,
  Avatar,
  TextField,
  Button,
  IconButton,
  Stack,
  Card,
  Divider,
  CardContent,
  Chip
} from '@mui/material';
import { Cancel, Upload, ToggleOff, ToggleOn } from '@mui/icons-material';
import Grid from '@mui/material/Unstable_Grid2';

const Profile = () => {
  const { id } = useParams();
  const { auth, users, teams, projects } = useSelector(state => state);
  const [isPublic, setIsPublic] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [messageNotification, setMessageNotification] = useState(true);
  const [projectNotification, setProjectNotification] = useState(true);
  const dispatch = useDispatch();
  const ref = useRef();
  const user = users.find(_user => _user.id === id);
  let team, project;
  if (user) {
    team = teams.find(_team => _team.id === user.teamId);
    if (team) project = projects.find(_project => _project.teamId === team.id);
  }

  useEffect(() => {
    if (auth.id && auth.id === id) {
      setIsPublic(false);
    } else {
      setIsPublic(true);
    }
  }, [id, auth]);

  useEffect(() => {
    if (editForm && auth.id) {
      setUsername(auth.username);
      setAvatarUrl(auth.avatar);
      setMessageNotification(auth.messageNotification);
      setProjectNotification(auth.projectNotification);
    }
  }, [editForm]);

  if (ref.current) {
    ref.current.addEventListener('change', ev => {
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('load', () => {
        setAvatarUrl(reader.result);
      });
    });
  }

  const update = ev => {
    ev.preventDefault();
    if (password === '') {
      dispatch(
        updateAuth({
          id,
          username,
          avatar: avatarUrl,
          projectNotification,
          messageNotification
        })
      );
    } else {
      dispatch(
        updateAuth({
          id,
          username,
          password,
          avatar: avatarUrl,
          projectNotification,
          messageNotification
        })
      );
    }
  };

  return (
    <Grid
      spacing={2}
      container
    >
      <Grid
        xs={12}
        textAlign='center'
      >
        <Typography variant='h2'>
          {isPublic && user ? user.name : auth.name}
        </Typography>
        <BadgedAvatar
          size={100}
          id={isPublic && user ? user.id : auth.id}
        />
        <Box>
          {!isPublic &&
            (editForm ? (
              <Button onClick={() => setEditForm(false)}>Cancel</Button>
            ) : (
              <Button onClick={() => setEditForm(true)}>Edit Profile</Button>
            ))}
        </Box>
      </Grid>

      <Grid xs={6}>
        <Typography variant='h5'>Project:</Typography>
        {project ? (
          <Card>
            <CardContent>
              <Typography
                variant='h6'
                color='text.secondary'
              >
                <Link to={`/projects/${project.id}`}>{project.title}</Link>
              </Typography>
              <Typography color='text.secondary'>
                Start Date: {new Date(project.startDate).toLocaleDateString()}
              </Typography>
              <Typography color='text.secondary'>
                Deadline: {new Date(project.deadline).toLocaleDateString()}
              </Typography>
              <Chip
                label={`Priority: ${project.priority}`}
                variant='outlined'
                color='primary'
                style={{ marginTop: 10 }}
              />
            </CardContent>
          </Card>
        ) : (
          <Typography variant='h5'>None</Typography>
        )}
      </Grid>

      {!isPublic && editForm && (
        <Grid xs={6}>
          <form onSubmit={update}>
            <TextField
              margin='dense'
              label='Username'
              placeholder='Change Username?'
              value={username}
              onChange={ev => setUsername(ev.target.value)}
            />
            <TextField
              margin='dense'
              label='Password'
              placeholder='Change Password?'
              value={password}
              onChange={ev => setPassword(ev.target.value)}
            />

            <Card
              raised
              sx={{ maxWidth: 200, m: 0.5 }}
            >
              <Typography
                variant='h6'
                align='center'
              >
                Avatar
              </Typography>
              <Avatar
                id='avatarSrc'
                src={avatarUrl}
                align='center'
                sx={{ width: 100, height: 100, margin: 'auto' }}
              />
              <Stack
                direction='row'
                divider={
                  <Divider
                    orientation='vertical'
                    variant='middle'
                    flexItem
                  />
                }
                justifyContent='space-around'
              >
                <IconButton
                  variant='contained'
                  component='label'
                >
                  <Upload />
                  <input
                    hidden
                    id='avatarUrl'
                    name='avatarUrl'
                    type='file'
                    ref={ref}
                  />
                </IconButton>
                <IconButton onClick={() => setAvatarUrl(auth.avatar)}>
                  <Cancel />
                </IconButton>
              </Stack>
            </Card>
            <Typography variant='body1'>
              Message Notifications:
              <IconButton
                onClick={() => setMessageNotification(!messageNotification)}
              >
                {messageNotification ? (
                  <ToggleOn color='primary' />
                ) : (
                  <ToggleOff />
                )}
              </IconButton>
            </Typography>
            <Typography variant='body1'>
              Project Notifications:
              <IconButton
                onClick={() => setProjectNotification(!projectNotification)}
              >
                {projectNotification ? (
                  <ToggleOn color='primary' />
                ) : (
                  <ToggleOff />
                )}
              </IconButton>
            </Typography>
            <Button type='submit'>Submit</Button>
          </form>
        </Grid>
      )}
    </Grid>
  );
};

export default Profile;

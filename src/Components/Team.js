import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  AvatarGroup,
  Box,
  Card,
  Typography,
  IconButton,
  Chip,
  TextField,
  CardContent
} from '@mui/material';
import BadgedAvatar from './BadgedAvatar';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import {
  PersonAdd,
  PersonRemove,
  Edit,
  Cancel,
  Send
} from '@mui/icons-material';
import { updateTeam, updateUser } from '../store';

const Team = () => {
  const { id } = useParams();
  const { users, teams, projects } = useSelector(state => state);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const team = teams.find(_team => _team.id === id);
  let project;
  if (team) project = projects.find(_project => _project.teamId === team.id);

  useEffect(() => {
    if (team) {
      setName(team.name);
    }
  }, [id]);

  const add = userId => {
    dispatch(updateUser({ id: userId, teamId: id }));
  };

  const remove = userId => {
    dispatch(updateUser({ id: userId, teamId: null }));
  };

  const edit = () => {
    dispatch(updateTeam({ id, name }));
    setShowForm(false);
  };

  return (
    <Box>
      <Typography variant='h2'>{`Team ${
        team ? team.name : 'Error'
      }`}</Typography>

      <Chip
        color='primary'
        icon={showForm ? <Cancel /> : <Edit />}
        label={showForm ? 'Cancel' : 'Edit Name'}
        onClick={() => setShowForm(!showForm)}
        sx={{ m: 1 }}
      />
      {showForm && (
        <form>
          <TextField
            value={name}
            label='Team Name'
            onChange={ev => setName(ev.target.value)}
          />
          <IconButton onClick={() => edit()}>
            <Send />
          </IconButton>
        </form>
      )}

      <Typography variant='h5'>Project:</Typography>
      {project ? (
        <Card>
          <CardContent>
            <Typography
              variant='h6'
              color='text.secondary'
            >
              <RouterLink to={`/projects/${project.id}`}>
                {project.title}
              </RouterLink>
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

      <Typography variant='h4'> Edit Team</Typography>
      <AvatarGroup sx={{ flexDirection: 'row', m: 1 }}>
        {users
          .filter(user => user.teamId === id)
          .map(user => {
            return (
              <Box key={user.id}>
                <BadgedAvatar id={user.id} />
                <Typography
                  variant='body2'
                  component={RouterLink}
                  to={`/profile/${user.id}`}
                  sx={{
                    display: 'block',
                    color: 'primary',
                    textDecoration: 'none'
                  }}
                >
                  {user.name}
                </Typography>
                <IconButton onClick={() => remove(user.id)}>
                  <PersonRemove />
                </IconButton>
              </Box>
            );
          })}
      </AvatarGroup>
      <Grid
        container
        spacing={2}
      >
        {users
          .filter(user => user.teamId !== id)
          .map(user => {
            return (
              <Grid key={user.id}>
                <Card>
                  <BadgedAvatar id={user.id} />
                  <Typography
                    variant='body2'
                    component={RouterLink}
                    to={`/profile/${user.id}`}
                    sx={{
                      display: 'block',
                      color: 'primary',
                      textDecoration: 'none'
                    }}
                  >
                    {user.name}
                  </Typography>
                  <IconButton onClick={() => add(user.id)}>
                    <PersonAdd />
                  </IconButton>
                </Card>
              </Grid>
            );
          })}
      </Grid>
    </Box>
  );
};

export default Team;

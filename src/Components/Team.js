import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  AvatarGroup,
  Box,
  Card,
  Typography,
  IconButton,
  Chip,
  TextField
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
  const { users, auth, teams } = useSelector(state => state);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const team = teams.find(_team => _team.id === id);

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

      <Typography variant='h4'> Edit Team</Typography>
      <AvatarGroup sx={{ flexDirection: 'row', m: 1 }}>
        {users
          .filter(user => user.teamId === id)
          .map(user => {
            return (
              <Box key={user.id}>
                <BadgedAvatar id={user.id} />
                <Typography variant='body2'>{user.name}</Typography>
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
                  <Typography variant='body2'>{user.name}</Typography>
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

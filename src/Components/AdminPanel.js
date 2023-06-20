import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  Typography,
  Box,
  Button,
  AvatarGroup,
  Chip,
  TextField,
  IconButton
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { Add, Cancel, Send } from '@mui/icons-material';
import BadgedAvatar from './BadgedAvatar';
import { createTeam, removeTeam } from '../store/team';

const AdminPanel = () => {
  const { users, teams } = useSelector(state => state);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const dispatch = useDispatch();

  //console.log(teamList);
  const onChange = ev => {
    setTeamList({ ...teamList, [ev.target.name]: ev.target.value });
  };

  const remove = id => {
    dispatch(removeTeam(id));
  };

  const create = () => {
    dispatch(createTeam({ name }));
  };

  return (
    <Box>
      <Typography variant='h2'>Teams</Typography>
      <Chip
        color='primary'
        icon={showForm ? <Cancel /> : <Add />}
        label={showForm ? 'Cancel' : 'Create Team'}
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
          <IconButton onClick={() => create()}>
            <Send />
          </IconButton>
        </form>
      )}

      <Grid
        container
        spacing={2}
      >
        {teams.map(team => {
          return (
            <Grid key={team.id}>
              <Card sx={{ m: 1 }}>
                <Typography
                  component={RouterLink}
                  to={`/team/${team.id}`}
                  sx={{ textDecoration: 'none' }}
                >
                  {team.name}
                </Typography>
                <Button onClick={() => remove(team.id)}>Remove Team</Button>
                <AvatarGroup>
                  {users
                    .filter(user => user.teamId === team.id)
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
                        </Box>
                      );
                    })}
                </AvatarGroup>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default AdminPanel;

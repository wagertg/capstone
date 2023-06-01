import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AvatarGroup, Box, Card, Typography, IconButton } from '@mui/material';
import BadgedAvatar from './BadgedAvatar';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { PersonAdd } from '@mui/icons-material';
import { updateUser } from '../store';

const Team = () => {
  const { id } = useParams();
  const { users, auth } = useSelector(state => state);
  const dispatch = useDispatch();

  const update = userId => {
    dispatch(updateUser({ id: userId, teamId: id }));
  };

  return (
    <Box>
      <AvatarGroup>
        {users
          .filter(user => user.teamId === id)
          .map(user => {
            return (
              <BadgedAvatar
                key={user.id}
                id={user.id}
              />
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
                  <IconButton onClick={() => update(user.id)}>
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

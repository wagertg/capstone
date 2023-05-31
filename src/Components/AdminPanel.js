import React from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { Card, Typography, Box, Button, AvatarGroup } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import BadgedAvatar from './BadgedAvatar';

const AdminPanel = () => {
  const { users, teams } = useSelector(state => state);

  //console.log(teamList);
  const onChange = ev => {
    setTeamList({ ...teamList, [ev.target.name]: ev.target.value });
  };

  return (
    <Box>
      <Typography variant='h2'>Teams</Typography>

      <Grid
        container
        spacing={2}
      >
        {teams.map(team => {
          return (
            <Grid key={team.id}>
              <Card>
                <Typography
                  component={RouterLink}
                  to={`/team/${team.id}`}
                >
                  {team.name}
                </Typography>
                <AvatarGroup>
                  {users
                    .filter(user => user.teamId === team.id)
                    .map(user => {
                      return (
                        <BadgedAvatar
                          key={user.id}
                          id={user.id}
                          imageUrl={user.avatar}
                        />
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

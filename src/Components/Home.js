import React from 'react';

import { Typography, Box } from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';

const Home = () => {
  return (
    <Box textAlign='center'>
      <Typography
        color='primary'
        variant='h1'
      >
        Welcome to
      </Typography>
      <Typography
        color='primary'
        variant='h1'
      >
        Project Planner Plus
      </Typography>
      <CalendarMonth
        color='primary'
        sx={{ fontSize: 100 }}
      />
    </Box>
  );
};

export default Home;

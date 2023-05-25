import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store';

import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Avatar,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material/';

const Nav = () => {
  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Typography
            variant='h6'
            noWrap
            component={RouterLink}
            to='/'
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            PP+
          </Typography>

          <Typography
            variant='h6'
            noWrap
            component={RouterLink}
            to='/'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            Project Planner +
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title='Account settings'>
              <IconButton sx={{ p: 0 }}>
                <Avatar />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Nav;

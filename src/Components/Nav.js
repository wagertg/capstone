import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NavMenu from './NavMenu';
import AccountMenu from './AccountMenu';
import Notification from './Notification';

import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button
} from '@mui/material';

import { Login } from '@mui/icons-material';

const Nav = () => {
  const { auth } = useSelector(state => state);
  const navigate = useNavigate();

  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <NavMenu />
          <Typography
            variant='h6'
            noWrap
            component={RouterLink}
            to='/'
            sx={{
              mr: 2,
              display: { xs: 'flex', sm: 'none' },
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
              display: { xs: 'none', sm: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            Project Planner Plus
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
            <Button
              component={RouterLink}
              sx={{ my: 2, color: 'white', display: 'block' }}
              to='/team'
            >
              Team
            </Button>
          </Box>

          {!!auth.id && <Notification />}
          {auth.id ? (
            <AccountMenu />
          ) : (
            <IconButton
              color='inherit'
              onClick={() => navigate('/login')}
            >
              <Login fontSize='small' />
              <Typography
                margin={0.5}
                variant='body1'
              >
                Login
              </Typography>
            </IconButton>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Nav;
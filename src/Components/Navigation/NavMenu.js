import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, MenuItem, Box, IconButton, Link } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material/';

const NavMenu = () => {
  const { auth } = useSelector(state => state);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = ev => {
    setAnchorEl(ev.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1, display: { xs: 'flex', sm: 'none' } }}>
      <IconButton
        size='large'
        aria-controls='nav-menu'
        aria-haspopup='true'
        onClick={handleOpen}
        color='inherit'
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id='nav-menu'
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{
          display: { xs: 'block', sm: 'none' }
        }}
      >
        <MenuItem onClick={handleClose}>
          <Link
            component={RouterLink}
            underline='none'
            to='/'
          >
            Home
          </Link>
        </MenuItem>

        {!!auth.id && auth.isTeamLead && (
          <MenuItem onClick={handleClose}>
            <Link
              component={RouterLink}
              underline='none'
              to='/admin'
            >
              Admin
            </Link>
          </MenuItem>
        )}

        {!!auth.id && (
          <MenuItem onClick={handleClose}>
            <Link
              component={RouterLink}
              underline='none'
              to='/message'
            >
              Messages
            </Link>
          </MenuItem>
        )}
        {!!auth.id && (
          <MenuItem onClick={handleClose}>
            <Link
              component={RouterLink}
              underline='none'
              to='/projects'
            >
              Projects
            </Link>
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default NavMenu;

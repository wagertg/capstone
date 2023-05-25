import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Menu, MenuItem, Box, IconButton, Link } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material/';

const NavMenu = () => {
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
      </Menu>
    </Box>
  );
};

export default NavMenu;

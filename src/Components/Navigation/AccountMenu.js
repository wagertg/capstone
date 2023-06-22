import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { logout } from '../../store';
import BadgedAvatar from '../BadgedAvatar';
import { Menu, MenuItem, Box, IconButton, Link, Tooltip } from '@mui/material';
import { Logout } from '@mui/icons-material';

const AccountMenu = () => {
  const { auth } = useSelector(state => state);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpen = ev => {
    setAnchorEl(ev.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title='Account settings'>
        <IconButton
          onClick={handleOpen}
          sx={{ p: 0 }}
        >
          <BadgedAvatar id={auth.id} />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id='menu-appbar'
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {!!auth.id && (
          <MenuItem onClick={handleClose}>
            <Link
              component={RouterLink}
              underline='none'
              to={`/profile/${auth.id}`}
            >
              Profile
            </Link>
          </MenuItem>
        )}

        {!!auth.id && (
          <MenuItem onClick={handleClose}>
            <Link
              component='button'
              underline='none'
              onClick={() => {
                dispatch(logout());
                navigate('/');
              }}
            >
              Logout
            </Link>
            {/* I still need to fix the way this looks... -Lateisha */}
            <Logout fontSize='small' />
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default AccountMenu;

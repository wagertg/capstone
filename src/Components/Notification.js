import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import NavMenu from './Navigation/NavMenu';

import {
  IconButton,
  Badge,
  Box,
  Dialog,
  DialogTitle,
  List,
  ListItem
} from '@mui/material';

import {
  Notifications,
  NotificationsActive,
  NotificationsNone
} from '@mui/icons-material';

const Notification = () => {
  const { notifications } = useSelector(state => state);
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch = useDispatch();

  return (
    <Box>
      <IconButton
        size='large'
        color='inherit'
        onClick={() => setOpenDialog(true)}
      >
        <Badge
          badgeContent={notifications.length}
          color='secondary'
          overlap='circular'
          max={9}
        >
          <Notifications />
        </Badge>
      </IconButton>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Your Notifications</DialogTitle>
        <List>
          {notifications.map(notification => {
            return (
              <ListItem key={notification.id}>{notification.message}</ListItem>
            );
          })}
        </List>
      </Dialog>
    </Box>
  );
};

export default Notification;

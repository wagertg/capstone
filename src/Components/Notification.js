import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import {
  IconButton,
  Badge,
  Box,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  Typography,
  Stack
} from '@mui/material';

import {
  Notifications,
  NotificationsActive,
  NotificationsNone
} from '@mui/icons-material';
import BadgedAvatar from './BadgedAvatar';

const Notification = () => {
  const { notifications, messages, users } = useSelector(state => state);
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
            const message = messages.find(
              _message => _message.id === notification.subjectId
            );
            if (message) {
              const user = users.find(_users => _users.id === message.fromId);
              return (
                <ListItem key={notification.id}>
                  {!!user && (
                    <Stack
                      spacing={4}
                      direction='row'
                    >
                      <BadgedAvatar id={user.id} />
                      <Typography>{`sent a ${notification.message}`}</Typography>
                    </Stack>
                  )}
                </ListItem>
              );
            } else {
              return (
                <ListItem key={notification.id}>
                  <Typography>{`loading`}</Typography>
                </ListItem>
              );
            }
          })}
        </List>
      </Dialog>
    </Box>
  );
};

export default Notification;

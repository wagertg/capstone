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
  Stack,
  Chip
} from '@mui/material';

import { Notifications, Clear, ClearAll } from '@mui/icons-material';
import BadgedAvatar from './BadgedAvatar';
import { removeAllNotifications, removeNotification } from '../store';

const Notification = () => {
  const { notifications, messages, users, projects } = useSelector(
    state => state
  );
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
        <DialogTitle>
          Your Notifications
          <IconButton onClick={() => setOpenDialog(false)}>
            <Clear color='primary' />
          </IconButton>
        </DialogTitle>
        <List>
          {notifications.map(notification => {
            if (notification.type === 'MESSAGE_STATUS') {
              const message = messages.individualMessages.find(
                _message => _message.id === notification.subjectId
              );
              if (message) {
                const user = users.find(_users => _users.id === message.fromId);
                return (
                  <ListItem key={notification.id}>
                    {!!user && (
                      <Stack
                        spacing={1}
                        direction='row'
                        alignItems={'center'}
                      >
                        <BadgedAvatar id={user.id} />
                        <Typography
                          variant='body1'
                          component={RouterLink}
                          to={`/message`}
                          sx={{
                            color: 'primary',
                            textDecoration: 'none'
                          }}
                        >{`${user.name} ${notification.message}`}</Typography>
                        <IconButton
                          onClick={() =>
                            dispatch(removeNotification(notification.id))
                          }
                        >
                          <Clear />
                        </IconButton>
                      </Stack>
                    )}
                  </ListItem>
                );
              }
            }
            if (notification.type === 'TEAM_MESSAGE_STATUS') {
              const message = messages.teamMessages.find(
                _message => _message.id === notification.subjectId
              );
              if (message) {
                const user = users.find(_users => _users.id === message.fromId);
                return (
                  <ListItem key={notification.id}>
                    {!!user && (
                      <Stack
                        spacing={1}
                        direction='row'
                        alignItems={'center'}
                      >
                        <BadgedAvatar id={user.id} />
                        <Typography
                          variant='body1'
                          component={RouterLink}
                          to={`/message`}
                          sx={{
                            color: 'primary',
                            textDecoration: 'none'
                          }}
                        >{`${user.name} ${notification.message}`}</Typography>
                        <IconButton
                          onClick={() =>
                            dispatch(removeNotification(notification.id))
                          }
                        >
                          <Clear />
                        </IconButton>
                      </Stack>
                    )}
                  </ListItem>
                );
              }
            }
            if (notification.type === 'PROJECT_STATUS') {
              const project = projects.find(
                _project => _project.id === notification.subjectId
              );
              if (project) {
                return (
                  <ListItem key={notification.id}>
                    {
                      <Stack
                        spacing={4}
                        direction='row'
                        alignItems={'center'}
                      >
                        <Typography>{`${project.title} ${notification.message}`}</Typography>
                        <IconButton
                          onClick={() =>
                            dispatch(removeNotification(notification.id))
                          }
                        >
                          <Clear />
                        </IconButton>
                      </Stack>
                    }
                  </ListItem>
                );
              }
            }
          })}
        </List>
        <Chip
          color='primary'
          icon={<ClearAll />}
          label='Clear All'
          onClick={() => dispatch(removeAllNotifications())}
          sx={{ m: 1 }}
        />
      </Dialog>
    </Box>
  );
};

export default Notification;

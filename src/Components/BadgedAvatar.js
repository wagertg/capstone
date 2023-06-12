import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Badge, Tooltip } from '@mui/material';

const BadgedAvatar = ({ id, size = 40 }) => {
  const { onlineUsers, users } = useSelector(state => state);
  const [badgeColor, setBadgeColor] = useState('offline');

  const onlineUser = onlineUsers.find(_user => _user.id === id);
  const user = users.find(_user => _user.id === id);

  useEffect(() => {
    if (onlineUser) {
      setBadgeColor('online');
    } else {
      setBadgeColor('offline');
    }
  }, [onlineUsers, id]);

  return (
    <Tooltip title={`${user ? user.name : 'Anonymous'}`}>
      <Badge
        color={badgeColor}
        overlap='circular'
        badgeContent=' '
        variant='dot'
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ mr: 1 }}
      >
        <Avatar
          sx={{ width: size, height: size }}
          src={user ? user.avatar : ''}
        />
      </Badge>
    </Tooltip>
  );
};

export default BadgedAvatar;

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Badge } from '@mui/material';

const BadgedAvatar = ({ imageUrl, id, size = 40 }) => {
  const { onlineUsers } = useSelector(state => state);
  const [badgeColor, setBadgeColor] = useState('offline');

  const user = onlineUsers.find(_user => _user.id === id);

  useEffect(() => {
    if (user) {
      setBadgeColor('online');
    } else {
      setBadgeColor('offline');
    }
  }, [onlineUsers, id]);

  return (
    <Badge
      color={badgeColor}
      overlap='circular'
      badgeContent=' '
      variant='dot'
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Avatar
        sx={{ width: size, height: size }}
        src={imageUrl}
      />
    </Badge>
  );
};

export default BadgedAvatar;

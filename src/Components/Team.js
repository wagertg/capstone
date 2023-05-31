import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AvatarGroup } from '@mui/material';
import BadgedAvatar from './BadgedAvatar';

const Team = () => {
  const id = useParams();
  const { users, auth } = useSelector(state => state);
  return (
    <AvatarGroup>
      {users
        .filter(user => user.teamId === auth.teamId)
        .map(user => {
          return (
            <BadgedAvatar
              key={user.id}
              id={user.id}
              imageUrl={user.avatar}
            />
          );
        })}
    </AvatarGroup>
  );
};

export default Team;

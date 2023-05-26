import axios from 'axios';

const onlineUsers = (state = [], action) => {
  if (action.type === 'SET_ONLINE_USERS') {
    return action.users;
  }
  if (action.type === 'ONLINE') {
    return [...state, action.user];
  }
  if (action.type === 'OFFLINE') {
    return state.filter(user => user.id !== action.user.id);
  }
  return state;
};

export const fetchOnlineUsers = () => {
  return async (dispatch, getState) => {
    const token = window.localStorage.getItem('token');
    if (getState().auth.id) {
      const response = await axios.get('/api/users/online_users', {
        headers: {
          authorization: token
        }
      });
      dispatch({ type: 'SET_ONLINE_USERS', users: response.data });
    }
  };
};

export default onlineUsers;

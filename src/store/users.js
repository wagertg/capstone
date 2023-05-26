import axios from 'axios';

const users = (state = [], action) => {
  if (action.type === 'SET_USERS') {
    return action.users;
  }
  return state;
};

export const fetchUsers = () => {
  return async (dispatch, getState) => {
    const token = window.localStorage.getItem('token');
    if (getState().auth.id) {
      const response = await axios.get('/api/users/', {
        headers: {
          authorization: token
        }
      });
      dispatch({ type: 'SET_USERS', users: response.data });
    }
  };
};

export default users;

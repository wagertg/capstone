import axios from 'axios';

const users = (state = [], action) => {
  if (action.type === 'SET_USERS') {
    return action.users;
  }
  if (action.type === 'UPDATE_USER') {
    return state.map(user => {
      if (user.id === action.user.id) {
        return action.user;
      }

      return user;
    });
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

export const updateUser = updated => {
  return async (dispatch, getState) => {
    const token = window.localStorage.getItem('token');
    if (getState().auth.id && getState().auth.isTeamLead) {
      const response = await axios.put(`api/users/${updated.id}`, updated, {
        headers: {
          authorization: token
        }
      });
      dispatch({ type: 'UPDATE_USER', user: response.data });
    }
  };
};

export default users;

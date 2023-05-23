import axios from 'axios';

const notifications = (state = [], action) => {
  if (action.type === 'SET_NOTIFICATIONS') {
    return action.notifications;
  }

  return state;
};

export const fetchNotifications = () => {
  return async (dispatch, getState) => {
    const token = window.localStorage.getItem('token');

    if (getState().auth.id) {
      const response = axios.get('/api/notifications', {
        headers: {
          authorization: token
        }
      });

      dispatch({ type: 'SET_NOTIFICATIONS', notifications: response.data });
    }
  };
};

export default notifications;

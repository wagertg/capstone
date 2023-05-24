import axios from 'axios';

const notifications = (state = [], action) => {
  if (action.type === 'SET_NOTIFICATIONS') {
    return action.notifications;
  }
  if (action.type === 'REMOVE_NOTIFICATIONS') {
    return [];
  }
  if (action.type === 'REMOVE_NOTIFICATION') {
    return state.filter(
      notification => notification.id !== action.notificationId
    );
  }

  return state;
};

export const fetchNotifications = () => {
  return async (dispatch, getState) => {
    const token = window.localStorage.getItem('token');

    if (getState().auth.id) {
      const response = await axios.get('/api/notifications', {
        headers: {
          authorization: token
        }
      });

      dispatch({ type: 'SET_NOTIFICATIONS', notifications: response.data });
    }
  };
};

export const removeAllNotifications = () => {
  return async (dispatch, getState) => {
    const token = window.localStorage.getItem('token');

    if (getState().auth.id) {
      await axios.delete('/api/notifications', {
        headers: {
          authorization: token
        }
      });

      dispatch({ type: 'REMOVE_NOTIFICATIONS' });
    }
  };
};

export const removeNotification = id => {
  return async (dispatch, getState) => {
    const token = window.localStorage.getItem('token');

    if (getState().auth.id) {
      await axios.delete(`/api/notifications/${id}`, {
        headers: {
          authorization: token
        }
      });

      dispatch({ type: 'REMOVE_NOTIFICATION', notificationId: id });
    }
  };
};

export default notifications;

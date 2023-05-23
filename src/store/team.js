import axios from 'axios';

const teams = (state = [], action) => {
  if (action.type === 'SET_TEAMS') {
    return action.teams;
  }

  return state;
};

export const fetchTeams = () => {
  return async (dispatch, getState) => {
    const token = window.localStorage.getItem('token');

    if (getState().auth.id) {
      const response = axios.get('/api/team', {
        headers: {
          authorization: token
        }
      });

      dispatch({ type: 'SET_TEAMS', teams: response.data });
    }
  };
};

export default teams;

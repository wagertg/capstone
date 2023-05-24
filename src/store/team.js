import axios from 'axios';

const teams = (state = [], action) => {
  if (action.type === 'SET_TEAMS') {
    return action.teams;
  }
  if (action.type === 'CREATE_TEAM') {
    return [...state, action.team];
  }
  if (action.type === 'UPDATE_TEAM') {
    return state.map(team => {
      if (team.id === action.team.id) {
        return action.team;
      }
      return team;
    });
  }
  if (action.type === 'REMOVE_TEAM') {
    return state.filter(team => team.id !== action.teamId);
  }

  return state;
};

export const fetchTeams = () => {
  return async (dispatch, getState) => {
    const token = window.localStorage.getItem('token');

    if (getState().auth.id) {
      const response = await axios.get('/api/team', {
        headers: {
          authorization: token
        }
      });

      dispatch({ type: 'SET_TEAMS', teams: response.data });
    }
  };
};

export const createTeam = team => {
  return async (dispatch, getState) => {
    const token = window.localStorage.getItem('token');

    if (getState().auth.id) {
      const response = await axios.post('/api/team', team, {
        headers: {
          authorization: token
        }
      });

      dispatch({ type: 'CREATE_TEAM', team: response.data });
    }
  };
};

export const updateTeam = team => {
  return async (dispatch, getState) => {
    const token = window.localStorage.getItem('token');

    if (getState().auth.id) {
      const response = await axios.put(`/api/team/${team.id}`, team, {
        headers: {
          authorization: token
        }
      });

      dispatch({ type: 'UPDATE_TEAM', team: response.data });
    }
  };
};

export const removeTeam = id => {
  return async (dispatch, getState) => {
    const token = window.localStorage.getItem('token');

    if (getState().auth.id) {
      const response = await axios.delete(`/api/team/${id}`, {
        headers: {
          authorization: token
        }
      });

      dispatch({ type: 'REMOVE_TEAM', teamId: id });
    }
  };
};

export default teams;

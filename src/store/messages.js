import axios from "axios";

// Defines the initial state for the `messages` reducer, which consists of `individualMessages` and `teamMessages` arrays.

const initialState = {
  individualMessages: [],
  teamMessages: [],
};

// handles different types of actions to update the state accordingly.

const messages = (state = initialState, action) => {
  if (action.type === "SET_MESSAGES") {
    return { ...state, individualMessages: action.messages };
  }
  if (action.type === "NEW_INDIVIDUAL_MESSAGE") {
    return {
      ...state,
      individualMessages: [...state.individualMessages, action.message],
    };
  }
  if (action.type === "SEND_MESSAGE") {
    return {
      ...state,
      individualMessages: [...state.individualMessages, action.message],
    };
  }
  if (action.type === "READ_MESSAGE") {
    return {
      ...state,
      individualMessages: state.individualMessages.map((message) =>
        message.id === action.message.id ? action.message : message
      ),
    };
  }
  if (action.type === "SET_TEAM_MESSAGES") {
    return { ...state, teamMessages: action.messages };
  }
  if (action.type === "NEW_TEAM_MESSAGE") {
    return {
      ...state,
      teamMessages: [...state.teamMessages, action.message],
    };
  }
  if (action.type === "SEND_TEAM_MESSAGE") {
    return { ...state, teamMessages: [...state.teamMessages, action.message] };
  }
  if (action.type === "READ_TEAM_MESSAGE") {
    return {
      ...state,
      teamMessages: state.teamMessages.map((message) =>
        message.id === action.message.id ? action.message : message
      ),
    };
  }
  return state;
};

// These are action creators defined for different message-related operations. These action creators dispatch actions based on the responses received from the server after making the corresponding HTTP requests using `axios`.

export const fetchMessages = () => {
  return async (dispatch) => {
    const token = window.localStorage.getItem("token");
    const response = await axios.get("/api/messages", {
      headers: {
        authorization: token,
      },
    });
    dispatch({ type: "SET_MESSAGES", messages: response.data });
  };
};

export const sendMessage = (message) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem("token");
    const response = await axios.post("/api/messages", message, {
      headers: {
        authorization: token,
      },
    });
    dispatch({ type: "SEND_MESSAGE", message: response.data });
  };
};

export const readMessage = (id) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem("token");
    const response = await axios.put(
      `/api/messages/${id}/read`,
      {},
      {
        headers: {
          authorization: token,
        },
      }
    );
    dispatch({ type: "READ_MESSAGE", message: response.data });
  };
};

export const fetchTeamMessages = () => {
  return async (dispatch) => {
    const token = window.localStorage.getItem("token");
    const response = await axios.get("/api/messages/team/", {
      headers: {
        authorization: token,
      },
    });
    dispatch({ type: "SET_TEAM_MESSAGES", messages: response.data });
  };
};

export const sendTeamMessage = (message) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem("token");
    const response = await axios.post("/api/messages/team", message, {
      headers: {
        authorization: token,
      },
    });
    dispatch({ type: "SEND_TEAM_MESSAGE", message: response.data });
  };
};

export const readTeamMessage = (teamId) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem("token");
    const response = await axios.put(
      `/api/messages/team/${teamId}/read`,
      {},
      {
        headers: {
          authorization: token,
        },
      }
    );
    dispatch({ type: "READ_TEAM_MESSAGE", message: response.data });
  };
};

export default messages;

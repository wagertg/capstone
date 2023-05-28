import axios from "axios";

const messages = (state = [], action) => {
  if (action.type === "SET_MESSAGES") {
    return action.messages;
  }
  return state;
};

export const fetchMessages = () => {
  return async (dispatch, getState) => {
    const token = window.localStorage.getItem("token");
    const response = await axios.get("/api/messages", {
      headers: {
        authorization: token,
      },
    });
    dispatch({ type: "SET_MESSAGES", messages: response.data });
  };
};

export default messages;

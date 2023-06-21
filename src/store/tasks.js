import axios from "axios";

const tasks = (state = [], action) => {
  if (action.type === "SET_TASKS") {
    state = action.tasks;
  }
  if (action.type === "CREATE_TASK") {
    state = [...state, action.task];
  }
  if (action.type === "EDIT_TASK") {
    state = state.map((task) => {
      if (task.id === action.task.id) {
        return action.task;
      }
      return task;
    });
  }
  if (action.type === "DESTROY_TASK") {
    state = state.filter((task) => task.id !== action.task.id);
  }
  return state;
};

export const fetchTasks = (projectId) => {
  return (dispatch, getState) => {
    const token = window.localStorage.getItem("token");

    if (getState().auth.id) {
      axios
        .get(`/api/projects/${projectId}/tasks`, {
          headers: {
            authorization: token,
          },
        })
        .then((response) => {
          dispatch({ type: "SET_TASKS", tasks: response.data });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
};

export const createTask = (projectId, task) => {
  return async (dispatch, getState) => {
    const token = window.localStorage.getItem("token");
    if (getState().auth.id) {
      const response = await axios.post(
        `/api/projects/${projectId}/tasks`,
        task,
        {
          headers: {
            authorization: token,
          },
        }
      );
      dispatch({ type: "CREATE_TASK", task: response.data });
    }
  };
};

export const editTask = (projectId, task) => {
  return async (dispatch, getState) => {
    const token = window.localStorage.getItem("token");

    if (getState().auth.id) {
      const response = await axios.put(
        `/api/projects/${projectId}/tasks/${task.id}`,
        task,
        {
          headers: {
            authorization: token,
          },
        }
      );
      dispatch({ type: "EDIT_TASK", task: response.data });
    }
  };
};

export const destroyTask = (projectId, taskId) => {
  return async (dispatch, getState) => {
    const token = window.localStorage.getItem("token");

    if (getState().auth.id) {
      await axios.delete(`/api/projects/${projectId}/tasks/${taskId}`, {
        headers: {
          authorization: token,
        },
      });
      dispatch({ type: "DESTROY_TASK", task: { id: taskId } });
    }
  };
};

export default tasks;

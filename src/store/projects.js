import axios from "axios";

const projects = (state = [], action) => {
  if (action.type === "SET_PROJECTS") {
    state = action.projects;
  }
  if (action.type === "CREATE_PROJECT") {
    state = [...state, action.project];
  }
  if (action.type === "EDIT_PROJECT") {
    state = state.map((project) => {
      if (project.id === action.project.id) {
        return action.project;
      }
      return project;
    });
  }
  if (action.type === "DESTROY_PROJECT") {
    state = state.filter((project) => {
      return project.id !== action.project.id;
    });
  }
  return state;
};

export const fetchProjects = () => {
  return async (dispatch) => {
    const response = await axios.get("/api/projects");
    dispatch({ type: "SET_PROJECTS", projects: response.data });
  };
};

export const createProject = (project) => {
  return async (dispatch) => {
    const response = await axios.post(`api/projects`, project);
    dispatch({ type: "CREATE_PROJECT", project: response.data });
  };
};

export const editProject = (project) => {
  return async (dispatch) => {
    const response = await axios.put(`api/projects/${project.id}`, project);
    dispatch({ type: "EDIT_PROJECT", project: response.data });
  };
};

export const destroyProject = (project) => {
  return async (dispatch) => {
    await axios.delete(`api/projects/${project.id}`);
    dispatch({ type: "DESTROY_PROJECT", project });
  };
};

export default projects;

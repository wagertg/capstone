import axios from 'axios';


const tasks = (state = [], action) => {
  if (action.type === 'SET_TASKS') {
    state = action.tasks
  }
  if (action.type === 'CREATE_TASK') {
    state = [...state, action.task]    
  }
  if (action.type === 'EDIT_TASK') {
    state = state.map(task => {
      if (task.id === action.task.id){
        return action.task
      }
      return task
    })
  }           
  if (action.type === 'DETROY_TASK') {
    state = state.filter((task) => {
      return task.id !== action.task.id
    }) 
  }
  return state;
};

export const fetchTasks = ()=> {
  return async(dispatch)=> {
    const response = await axios.get('/api/tasks');
    dispatch({type: 'SET_TASKS', tasks: response.data})
  };
};
export const createTask = (task)=> {
  return async(dispatch)=> {
    const response = await axios.post(`api/tasks`, task);
    dispatch({type: 'CREATE_TASK', task: response.data})
  };
};
export const editTask = (task)=> {
  return async(dispatch)=> {
    const response = await axios.put(`api/tasks/${task.id}`, task);
    dispatch({type: 'EDIT_TASK', task: response.data})
  };
};
export const destroyTask = (task)=> {
  return async(dispatch)=> {
    await axios.delete(`api/tasks/${task.id}`);
    dispatch({type: 'DESTROY_TASK', task})
  };
};




export default tasks;

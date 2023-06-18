import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom'; 
// import { editProject } from '../store';



const Project = () => {
  const {project} = useSelector(state => state)
  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const save = async(ev) => {
    ev.preventDefault();
    try{
        await dispatch(editProject({title, startDate, deadline, priority, userStatus, notes})); 
        navigate('./admin/drinks');
      }
    catch(error){
      setErrors(error);
      console.log(error)
    }
  }

  if (!project) {
    return null
  }


  return (
    <div>
      <h2> { project.title } </h2>
      <ul>
        <li> Start Date: {project.startDate} </li>
        <li> Deadline: {project.deadline} </li>
        <li> Priority: {project.priority} </li>
        <li> Status: {project.userStatus} </li>
      </ul>

      <h6>edit project</h6>
      <form onSubmit={save}>
        <label>Title:
          <input value={title} onChange={setTitle(ev.target.value)} placeholder={'placeholder'}></input>
        </label>

      </form>
      

    </div>

    // the edit menu is how the project would be archieved **
  );
};

export default Project;
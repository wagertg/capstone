import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { createProject } from '../store/projects';


const CreateProject = () => {
  const [title, setTitle] = useState('') 
  const [startDate, setStartDate] = useState('')
  const [deadline, setDeadline] = useState('') 
  const [priority, setPriority] = useState('')  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // const {tasks} = useSelector(state => state)

  const create = async(ev) => {  
    ev.preventDefault() 
    await dispatch(createProject({title, startDate, deadline, priority})) 
    navigate('/projects')

  }

  return (
    <div>
      <h1> Creating a New Project </h1>
      <form onSubmit= { create } >
        <input placeholder='title' value= { title } onChange= { (ev) => {setTitle(ev.target.value)}} />
        <input placeholder='start date' value= { startDate } onChange= { (ev) => {setStartDate(ev.target.value)}} /> 
        <input placeholder='deadline' value= { deadline } onChange= { (ev) => {setDeadline(ev.target.value)}} />        
        <select value= { priority } onChange= {(ev) => setPriority(ev.target.value)} >
          <option hidden > Priority? </option>
          <option> Low </option>
          <option> High </option>
        </select>



        <button > Create Project </button>
      </form>
    </div>
  )
};

export default CreateProject;
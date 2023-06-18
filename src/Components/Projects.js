import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Projects = () => {
  const { projects } = useSelector(state => state) 
    
  return (
    <div>
      <h1> Project List </h1>

      <Link to={`/projects/create`} > Create a new project </Link> 
      
      {/* <ul> 
        {
          projects.map(project => {
            return (
              <ul>
              <li key= {project.id}> 
                <Link to={`/projects/${project.id}`}> {project.title} </Link>
              </li>
              </ul>
            ) 
          })    
        }      
      </ul> */}


      <Link to={`/projects/archieved`} > Click to view archieved project list </Link>

    </div>



    ) 
};  

export default Projects;
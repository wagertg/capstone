import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ProjectsArchieve = () => {
  const { projects } = useSelector(state => state) 
    
  return (
    <div>
      <h1> Archieved Projects </h1>
      
      {/* <ul> 
        { // **want to map and only show the project where isArchieved is true. 
          projects.map(project => {
            return (
              <ul>
              </ul>
            ) 
          })    
        }      
      </ul> */}


      <Link to={`/projects`} > Return to projects list </Link>

    </div>



    ) 
};  

export default ProjectsArchieve;
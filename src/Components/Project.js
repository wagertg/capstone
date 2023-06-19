import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import EditProject from "./EditProject";
import { Typography, Paper, Box } from "@mui/material";

const Project = () => {
  const { projects } = useSelector((state) => state);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Box p={4}>
      <EditProject />
      <Box mt={4}>
        {projects
          .filter((project) => project.id === id)
          .map((project) => (
            <Paper key={project.id} elevation={3} sx={{ p: 3, mt: 2 }}>
              <Typography variant="h5" gutterBottom>
                {project.title}
              </Typography>
              <Typography>
                Start Date: {new Date(project.startDate).toLocaleDateString()}
              </Typography>
              <Typography>
                Deadline: {new Date(project.deadline).toLocaleDateString()}
              </Typography>
              <Typography>Priority: {project.priority}</Typography>
            </Paper>
          ))}
      </Box>
    </Box>
  );
};

export default Project;

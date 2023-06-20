import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { destroyProject } from "../store/projects";

import EditProject from "./EditProject";
import AssignTeam from "./AssignTeam";
import { Typography, Paper, Box, Chip, Button } from "@mui/material";

const Project = () => {
  const { projects, teams, users } = useSelector((state) => state);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const destroy = (project) => {
    dispatch(destroyProject(project));
    navigate("/projects");
  };

  const project = projects.find((project) => project.id === id);
  const [selectedTeamId, setSelectedTeamId] = useState(project?.teamId || "");

  useEffect(() => {
    setSelectedTeamId(project?.teamId || "");
  }, [project]);

  const assignedTeam = teams.find((team) => team.id === selectedTeamId);

  return (
    <Box p={4}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "1%" }}>
        <EditProject />
        <AssignTeam projectId={id} currentTeam={assignedTeam} />
        <Button
          variant="contained"
          color="primary"
          onClick={() => destroy(project)}
        >
          DELETE PROJECT
        </Button>
      </Box>
      <Box mt={4}>
        {project && (
          <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
            <Typography variant="h5" gutterBottom>
              {project.title}
            </Typography>
            <Typography variant="body">Description: {project.notes}</Typography>
            {assignedTeam && <Typography>Team: {assignedTeam.name}</Typography>}
            <Typography>
              Start Date: {new Date(project.startDate).toLocaleDateString()}
            </Typography>
            <Typography>
              Deadline: {new Date(project.deadline).toLocaleDateString()}
            </Typography>
            <Chip
              label={`Priority: ${project.priority}`}
              variant="outlined"
              color="primary"
              style={{ marginTop: 10 }}
            />
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default Project;

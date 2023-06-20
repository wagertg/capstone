import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Grid, Card, CardContent, Typography, Chip } from "@mui/material";
import CreateProject from "./CreateProject";

const Projects = () => {
  const { projects, teams, users } = useSelector((state) => state);

  return (
    <Grid container spacing={2} direction="column" style={{ padding: 20 }}>
      <Grid item>
        <Typography variant="h4" style={{ marginBottom: 20 }}>
          My Projects
        </Typography>
      </Grid>
      <Grid item>
        <CreateProject />
      </Grid>
      <Grid item>
        <Grid container spacing={2}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="text.secondary">
                    <Link to={`/projects/${project.id}`}>{project.title}</Link>
                  </Typography>
                  <Typography color="text.secondary">
                    Start Date:{" "}
                    {new Date(project.startDate).toLocaleDateString()}
                  </Typography>
                  <Typography color="text.secondary">
                    Deadline: {new Date(project.deadline).toLocaleDateString()}
                  </Typography>
                  <Chip
                    label={`Priority: ${project.priority}`}
                    variant="outlined"
                    color="primary"
                    style={{ marginTop: 10 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
      {/* <Grid item>
        <Typography variant="h6" style={{ marginTop: 20 }}>
          <Link to="/projects/archieved">
            Click to view archived project list
          </Link>
        </Typography>
      </Grid> */}
    </Grid>
  );
};

export default Projects;

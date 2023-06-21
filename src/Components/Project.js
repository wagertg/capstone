import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { destroyProject } from "../store/projects";
import { destroyTask, editTask, createTask, fetchTasks } from "../store/tasks";
import EditProject from "./EditProject";
import AssignTeam from "./AssignTeam";
import {
  Typography,
  Paper,
  Box,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogActions,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BadgedAvatar from "./BadgedAvatar";

const Project = () => {
  const { projects, teams, users, tasks } = useSelector((state) => state);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (projects.length) {
      dispatch(fetchTasks(id));
    }
  }, [id, dispatch, projects]);

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

  const projectTasks = tasks.filter((task) => task.projectId === id);

  const groupTasksByUser = (tasks) => {
    return tasks.reduce((groupedTasks, task) => {
      (groupedTasks[task.userId] = groupedTasks[task.userId] || []).push(task);
      return groupedTasks;
    }, {});
  };

  const tasksByUser = groupTasksByUser(projectTasks);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    destroy(project);
    setDeleteDialogOpen(false);
  };

  return (
    <Box p={4}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "1%" }}>
        <EditProject />
        <AssignTeam projectId={id} currentTeam={assignedTeam} />
        <Tooltip title="Delete project">
          <IconButton onClick={handleDeleteClick} color="primary">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Dialog open={deleteDialogOpen} onClose={handleClose}>
          <DialogTitle>
            {"Are you sure you want to delete this project?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Box mt={4}>
        {project && (
          <Paper
            elevation={3}
            sx={{ p: 3, mt: 2, borderRadius: 5, backgroundColor: "#f5f5f5" }}
          >
            <Typography variant="h5" gutterBottom style={{ marginBottom: 15 }}>
              {project.title}
            </Typography>
            <Typography variant="body" style={{ marginBottom: 10 }}>
              Description: {project.notes}
            </Typography>
            {assignedTeam && (
              <Typography style={{ marginBottom: 10 }}>
                Team: {assignedTeam.name}
              </Typography>
            )}
            <Typography style={{ marginBottom: 10 }}>
              Start Date: {new Date(project.startDate).toLocaleDateString()}
            </Typography>
            <Typography style={{ marginBottom: 10 }}>
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
      <Grid mt={2} container spacing={1}>
        {Object.keys(tasksByUser).map((userId) => {
          const userTasks = tasksByUser[userId];
          const user = users.find((user) => user.id === userId);
          return (
            <Grid item xs={12} sm={12} md={8} lg={6} xl={4} key={userId}>
              <Card>
                <CardContent>
                  <BadgedAvatar id={user.id} size={40} />
                  <Typography variant="h6" gutterBottom>
                    {user ? user.name : "Unassigned"}
                  </Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>No.</TableCell>
                        <TableCell>Task</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>Deadline</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userTasks.map((task, index) => (
                        <TableRow key={task.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell
                            style={{
                              wordWrap: "break-word",
                              whiteSpace: "normal",
                            }}
                          >
                            {task.title}
                          </TableCell>
                          <TableCell>
                            {new Date(task.startDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {new Date(task.deadline).toLocaleDateString()}
                          </TableCell>
                          <TableCell
                            style={{
                              wordWrap: "break-word",
                              whiteSpace: "normal",
                              overflowX: "auto",
                              maxWidth: 100,
                            }}
                          >
                            {task.userStatus}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Project;

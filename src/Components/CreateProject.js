import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProject } from "../store/projects";
import {
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
} from "@mui/material/";

const CreateProject = () => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("");
  const [notes, setNotes] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const create = async (ev) => {
    ev.preventDefault();
    await dispatch(
      createProject({ title, notes, startDate, deadline, priority })
    );
    handleClose();
    navigate("/projects");
  };

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create Project
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            width: 400,
            padding: 2,
            bgcolor: "background.paper",
            margin: "auto",
            marginTop: "10%",
            outline: "none",
          }}
        >
          <Typography variant="h4" component="h2">
            Create Project
          </Typography>
          <form onSubmit={create}>
            <TextField
              fullWidth
              margin="normal"
              placeholder="Title"
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              placeholder="Description"
              value={notes}
              onChange={(ev) => setNotes(ev.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              placeholder="Start Date"
              type="date"
              value={startDate}
              onChange={(ev) => setStartDate(ev.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              placeholder="Deadline"
              type="date"
              value={deadline}
              onChange={(ev) => setDeadline(ev.target.value)}
            />
            <Select
              fullWidth
              value={priority}
              onChange={(ev) => setPriority(ev.target.value)}
              displayEmpty
            >
              <MenuItem disabled value="">
                <em>Priority?</em>
              </MenuItem>
              <MenuItem value={"Low"}>Low</MenuItem>
              <MenuItem value={"High"}>High</MenuItem>
            </Select>
            <Button variant="contained" color="primary" type="submit">
              Create
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default CreateProject;

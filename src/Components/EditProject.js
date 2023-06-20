import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { editProject } from '../store/projects';
import {
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography
} from '@mui/material/';

const EditProject = () => {
  const { projects } = useSelector(state => state);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('');
  const [notes, setNotes] = useState('');
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const project = projects.find(project => project.id === id);
    if (project) {
      setTitle(project.title);
      setNotes(project.notes);
      setStartDate(formatDate(project.startDate));
      setDeadline(formatDate(project.deadline));
      setPriority(project.priority);
    }
  }, [projects]);

  const formatDate = date => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const edit = async ev => {
    ev.preventDefault();
    await dispatch(
      editProject({ title, notes, startDate, deadline, priority, id })
    );
    handleClose();
    navigate('/projects');
  };

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <>
      <Button
        variant='contained'
        color='primary'
        onClick={handleOpen}
      >
        Edit Project
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box
          sx={{
            width: 400,
            padding: 2,
            bgcolor: 'background.paper',
            margin: 'auto',
            marginTop: '10%',
            outline: 'none'
          }}
        >
          <Typography
            variant='h4'
            component='h2'
          >
            Edit Project
          </Typography>
          <form onSubmit={edit}>
            <TextField
              fullWidth
              margin='normal'
              value={title}
              onChange={ev => setTitle(ev.target.value)}
            />
            <TextField
              fullWidth
              margin='normal'
              value={notes}
              onChange={ev => setNotes(ev.target.value)}
            />
            <TextField
              fullWidth
              margin='normal'
              type='date'
              value={startDate}
              onChange={ev => setStartDate(ev.target.value)}
            />
            <TextField
              fullWidth
              margin='normal'
              type='date'
              value={deadline}
              onChange={ev => setDeadline(ev.target.value)}
            />
            <Select
              fullWidth
              value={priority}
              onChange={ev => setPriority(ev.target.value)}
              displayEmpty
            >
              <MenuItem
                disabled
                value=''
              >
                <em>Priority?</em>
              </MenuItem>
              <MenuItem value={'Low'}>Low</MenuItem>
              <MenuItem value={'High'}>High</MenuItem>
            </Select>
            <Button
              sx={{ mt: 2 }}
              variant='contained'
              color='success'
              type='submit'
            >
              Apply
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default EditProject;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Autocomplete,
  TextField,
  Button,
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  Grid,
} from "@mui/material";
import { assignTeamToProject } from "../store/projects";
import BadgedAvatar from "./BadgedAvatar";

const AssignTeam = ({ projectId, currentTeam }) => {
  const dispatch = useDispatch();
  const { teams, users } = useSelector((state) => state);
  const [open, setOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamUsers, setTeamUsers] = useState([]);

  useEffect(() => {
    if (selectedTeam) {
      setTeamUsers(users.filter((user) => user.teamId === selectedTeam.id));
    }
  }, [selectedTeam, users]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleConfirm = () => {
    dispatch(assignTeamToProject(projectId, selectedTeam.id));
    handleClose();
  };

  const handleTeamChange = (event, newValue) => {
    setSelectedTeam(newValue);
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        {currentTeam ? "Change Team" : "Assign Team"}
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="assign-team"
        aria-describedby="select-a-team-for-project"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            width: "30%",
            mt: 2,
            p: 5,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                options={teams}
                getOptionLabel={(option) => option.name}
                value={selectedTeam || null}
                onChange={handleTeamChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={selectedTeam ? "Change team" : "Select team"}
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            {selectedTeam && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom align="center">
                  Members
                </Typography>
                <List
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {teamUsers.map((user) => (
                    <ListItem key={user.id}>
                      <BadgedAvatar id={user.id} size={40} />
                      {user.name}
                    </ListItem>
                  ))}
                </List>
              </Grid>
            )}
            <Button
              variant="contained"
              color="success"
              onClick={handleConfirm}
              sx={{ mt: 1, ml: 2 }}
            >
              Confirm
            </Button>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default AssignTeam;

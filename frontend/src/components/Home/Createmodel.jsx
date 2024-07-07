import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Box, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl, FormControlLabel, Checkbox } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxHeight: '80vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 3,
};

const BasicModal = ({ open, handleClose }) => {
  const [formdetails, setFormDetails] = useState({
    roomName: "",
    gameType: "MCQ Battle",
    numPlayers: 2,
    roomPassword: "",
    timeLimit: 60,
    difficultyLevel: "Medium",
    categories: "Data Structures",
    rulesInstructions: "",
    isPrivate: false
  });

  const [disabled, setDisabled] = useState(false);

  const handleSubmit = async () => {
    try {
      console.log(formdetails);
      axios.post("http://localhost:3000/app/rooms/create", formdetails, {
        withCredentials: true
      }).then((resp) => {
        console.log(resp);
        handleClose();
      }).catch((err) => {
        console.log(err);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    let { name, value, type, checked } = e.target;
    if(value === "Coding Battle"){
        alert("Coding Battle is still under construction...");
        alert(":)")
        value = "MCQ Battle";
    }
    console.log(name, )
    setFormDetails((prevDetails) => ({
      ...prevDetails,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Create New Room
        </Typography>
        <TextField
          fullWidth
          margin="dense"
          label="Room Name"
          variant="outlined"
          name="roomName"
          value={formdetails.roomName}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Game Type</InputLabel>
          <Select
            label="Game Type"
            name="gameType"
            value={formdetails.gameType}
            onChange={handleChange}
          >
            <MenuItem value="MCQ Battle">MCQ Battle</MenuItem>
            <MenuItem value="Coding Battle">Coding Battle</MenuItem>
            {/* Add other game types here */}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          margin="dense"
          label="Number of Players"
          variant="outlined"
          type="number"
          name="numPlayers"
          value={formdetails.numPlayers}
          onChange={handleChange}
          inputProps={{ min: 1 }}
        />
        {/* <TextField
          fullWidth
          margin="dense"
          label="Room Password (optional)"
          variant="outlined"
          type="password"
          name="roomPassword"
          value={formdetails.roomPassword}
          onChange={handleChange}
        /> */}
        <TextField 
          fullWidth
          margin="dense"
          label="Time Limit (seconds)"
          variant="outlined"
          type="number"
          name="timeLimit"
          value={formdetails.timeLimit}
          onChange={handleChange}
          inputProps={{ min: 10 }}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Difficulty Level</InputLabel>
          <Select
            label="Difficulty Level"
            name="difficultyLevel"
            value={formdetails.difficultyLevel}
            onChange={handleChange}
          >
            <MenuItem value="Easy">Easy</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Hard">Hard</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>Categories</InputLabel>
          <Select
            label="Categories"
            name="categories"
            value={formdetails.categories}
            onChange={handleChange}
          >
            <MenuItem value="Data Structures">Data Structures</MenuItem>
            <MenuItem value="Algorithms">Algorithms</MenuItem>
            <MenuItem value="Web Development">Web Development</MenuItem>
            <MenuItem value="General Knowledge">MCQ Battle</MenuItem>
            <MenuItem value="Competitive Programming">Competitive Programming</MenuItem>
            <MenuItem value="Science">Science</MenuItem>
            <MenuItem value="Mathematics">Mathematics</MenuItem>
            <MenuItem value="Networking">Networking</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          margin="dense"
          label="Rules/Instructions"
          variant="outlined"
          name="rulesInstructions"
          value={formdetails.rulesInstructions}
          onChange={handleChange}
          multiline
          rows={2}
        />
        {/* <FormControlLabel
          control={
            <Checkbox
              name="isPrivate"
              checked={formdetails.isPrivate}
              onChange={handleChange}
            />
          }
          label="Private Room"
        /> */}
        <Button variant="contained" color="primary" disabled={disabled} onClick={handleSubmit} sx={{ mt: 2 }}> Create </Button>
        
      </Box>
    </Modal>
  );
};

export default BasicModal;

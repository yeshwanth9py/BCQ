// Home/Createmodel.js
import React, { useState } from 'react';
import { Box, Button, Typography, Modal, TextField } from '@mui/material';
import FileUpload from '../FileInput';
import axios from 'axios';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const BasicModal = ({ open, handleClose }) => {
    const [roomName, setRoomName] = useState('');
    const [roomDescription, setRoomDescription] = useState('');
    const [roomImage, setRoomImage] = useState(null);
    const [formdetails, setFormDetails] = useState(
        {
            name: "",
            description: "",
            image: null
        }
    )

    const handleFileChange = (event) => {
        setRoomImage(event.target.files[0]);
    };

    const handleSubmit = async () => {
        // Handle the form submission, e.g., send data to an API
        try {
            console.log(formdetails);
            setFormDetails((formdetails) => {
                return {
                    ...formdetails,
                    image: formdetails.profilePic
                }
            })
            axios.post("http://localhost:3000/app/rooms/create", formdetails, {
                withCredentials: true
              }).then((resp)=>{
                console.log(resp);
                handleClose();
            }).catch((err)=>{
                console.log(err);
            })
        } catch (err) {
            console.log(err);
        }
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
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Please enter the details for the new room.
                </Typography>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Room Name"
                    variant="outlined"
                    value={formdetails.name}
                    onChange={(e) => setFormDetails(() => {
                        return {
                            ...formdetails,
                            name: e.target.value
                        }
                    })}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Room Description"
                    variant="outlined"
                    value={formdetails.description}
                    onChange={(e) => {
                        setFormDetails(() => {
                            return {
                                ...formdetails,
                                description: e.target.value
                            }
                        })
                    }}
                />
                <FileUpload setFormdetails={setFormDetails} />
                {roomImage && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        {roomImage.name}
                    </Typography>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{ mt: 2 }}
                >
                    Create
                </Button>
            </Box>
        </Modal>
    );
};

export default BasicModal;

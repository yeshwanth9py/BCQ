import React, { useEffect, useState } from 'react';
import { Drawer, IconButton, List, ListItem, ListItemText, ListItemAvatar, Avatar, TextField, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { IoLogoSnapchat } from "react-icons/io";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '.MuiDrawer-paper': {
    backgroundColor: '#1e293b',
    color: '#fff',
    width: '300px',
  },
}));

const SidebarChat = ({ messages, setMessages, handleSendMessage, setUnreadnotifications }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadnotifications(0);
    }
  }, [isOpen]);

  return (
    <>
      <IconButton onClick={toggleDrawer} className="fixed bottom-5 right-5 bg-blue-500 hover:bg-blue-700 text-white">
        {isOpen ? <CloseIcon /> : <IoLogoSnapchat className='absolute top-10 right-28 p-1 scale-150' color="white" />}
      </IconButton>
      <StyledDrawer anchor="right" open={isOpen} onClose={toggleDrawer}>
        <div className="flex flex-col h-full">
          <div className="flex flex-col items-center p-4 bg-gray-800">
            <h2 className="text-white font-bold text-lg">Welcome to Global Chat</h2>
          </div>
          <div className="flex-grow overflow-y-auto p-4">
            <List>
              {messages.map((msg, index) => (
                <ListItem key={index} className="text-white">
                  <ListItemAvatar>
                    <Avatar 
                      src={msg.profilepic} 
                      className='cursor-pointer' 
                      onClick={() => navigate(`/home/profile/${msg.sender === "You" ? localStorage.getItem("ccusername") : msg.sender}`)}
                    >
                      {msg.sender.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={msg.text}
                    secondary={`${msg.sender} - ${msg.timestamp}`}
                  />
                </ListItem>
              ))}
            </List>
          </div>
          <div className="p-4 bg-gray-900">
            <div className="flex">
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage(message);
                    setMessage('');
                  }
                }}
                placeholder="Send a message to everyone"
                InputProps={{
                  className: 'bg-white',
                }}
              />
              <Button
                variant="contained"
                color="primary"
                className="ml-2"
                onClick={() => {
                  if (localStorage.getItem("ccusername") == null) {
                    alert("Please Login First");
                    navigate("/login");
                  }
                  handleSendMessage(message);
                  setMessage('');
                }}
              >
                <SendIcon />
              </Button>
            </div>
          </div>
        </div>
      </StyledDrawer>
    </>
  );
};

export default SidebarChat;

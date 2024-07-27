import React, { useState } from 'react';
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

// const useStyles = makeStyles({
//   media: {
//     transition: 'transform 0.5s ease', // Smooth transition for the zoom effect
//     '&:hover': {
//       transform: 'scale(1.1)', // Zoom in effect
//     },
//   },
// });

export default function MultiActionAreaCard({ room, joinRoom }) {
  // const classes = useStyles();
  const [request, setRequest] = useState(false);

  return (
    <Card sx={{ maxWidth: 345 }} onClick={() => joinRoom(room._id)}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={"https://mui.com/static/images/cards/contemplative-reptile.jpg"}
          alt="Room Image"
          className='hover:scale-105 transition duration-300 ease-in-out'
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {room.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {room.description}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Game Type: {room.gameType}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Status: {room.status}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Max Number of Players: {room.numPlayers}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Time Limit: {room.timeLimit} seconds
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Created by: {room.createdBy}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={() => {
          if(!request){
            setRequest(true);
            joinRoom(room._id) 
          }
        }}>
          {request ? "Request Sent" : "Join Room"}
        </Button>
      </CardActions>
    </Card>
  );
}

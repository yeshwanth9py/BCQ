import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';

export default function MultiActionAreaCard({ room, joinRoom }) {
  return (
    <Card sx={{ maxWidth: 345 }} onClick={() => joinRoom(room._id)}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={"https://mui.com/static/images/cards/contemplative-reptile.jpg"}
          alt="Room Image"
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
            Status: {room.Status}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Max Number of Players: {room.numPlayers}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Time Limit: {room.timeLimit} seconds
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Created by: {room.CreatedBy}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={() => joinRoom(room._id)}>
          Join Now
        </Button>
      </CardActions>
    </Card>
  );
}

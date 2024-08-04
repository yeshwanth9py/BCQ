import React, { useState } from 'react';
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// const useStyles = makeStyles({
//   media: {
//     transition: 'transform 0.5s ease', // Smooth transition for the zoom effect
//     '&:hover': {
//       transform: 'scale(1.1)', // Zoom in effect
//     },
//   },
// });




export default function MultiActionAreaCard({ room, joinRoom, setpasswordentered }) {
  // const classes = useStyles();
  const [request, setRequest] = useState(false);
  const navigate = useNavigate();


  
function deleteRoom(roomid){
  axios.delete(`http://localhost:3000/app/rooms/${roomid}`, {
    withCredentials: true,
    headers: {
      'auth-token': sessionStorage.getItem("token"), // Replace with your actual token or header information
      'Content-Type': 'application/json' // Include other headers as needed
    }
  }).then((res) => {
    console.log(res.data);
    window.location.reload();
  }).catch((err)=>{
    console.log(err);
    alert("some error deleting the room");
  })
}
  return (
    <Card sx={{ maxWidth: 345 }} onClick={() => {
      if(!request){
        if(room.private){
          const rp = prompt("Enter Room Password");
          setpasswordentered(rp);
          axios.post("http://localhost:3000/app/rooms/canjoin", { roomid: room._id, password: rp })
          .then((resp)=>{
            setRequest(true);
            joinRoom(room._id);
          }).catch((err)=>{
            alert("wrong password");
            return
          }).finally(()=>{
            return
          })
        }else{
          setRequest(true);
          joinRoom(room._id);
        }
      }
      }}>
      <CardActionArea>
        <CardMedia
          component="img"
          width={"100%"}
          image={room.roomImg}
          alt="Room Image"
          className='overflow-hidden h-60 hover:scale-110 transition duration-1000 ease-in-out rounded-lg' 
        />
        <CardContent>
          {console.log("room:-", room)}
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
            Category: {room.categories || "ALL"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Max Number of Players: {room.numPlayers}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Time Limit: {room.timeLimit} seconds
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Created by: {room.CreatedBy}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {room.ingame==true ? (<div className='text-left cursor-pointer bg-orange-600 text-white p-1.5 rounded-lg' onClick={() => {
          alert("in game idiot");
        }}>IN GAME</div>):(
        <div className='text-left cursor-pointer bg-green-700 text-white p-1.5 rounded-lg'  onClick={() => {
          console.log("rooom", room);
          if(!request){
            if(room.private){
              const rp = prompt("Enter Room Password");
              setpasswordentered(rp);
              axios.post("http://localhost:3000/app/rooms/canjoin", { roomid: room._id, password: rp })
              .then((resp)=>{
                setRequest(true);
                joinRoom(room._id);
              }).catch((err)=>{
                alert("wrong password");
                return
              }).finally(()=>{
                return
              })
            }else{
              setRequest(true);
              joinRoom(room._id);
            }
          }
        }}>{request ? "Request Sent" : "JOIN ROOM"}</div>)}

        {room.CreatedBy === localStorage.getItem("ccusername") &&   
        <div className='text-right cursor-pointer bg-red-700 text-white p-1.5 rounded-lg' onClick={(event) => {
          event.stopPropagation();
          deleteRoom(room._id)
        }}>DELETE ROOM</div>} 
      </CardActions>
    </Card>
  );
}

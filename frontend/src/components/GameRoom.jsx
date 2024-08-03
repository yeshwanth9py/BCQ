import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Usercomponent from './Waitingroom.jsx/Usercomponent';
import { io } from 'socket.io-client';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { pink } from '@mui/material/colors';
import axios from "axios";

import logo from "../assets/exit_12.png";

const GameRoom = () => {
  const params = useParams();
  const navigate = useNavigate();

  const socket = useMemo(() => io('http://localhost:5000'), []);

  const [allusers, setAllusers] = useState({});
  const [alluserids, setUserids] = useState([]);
  const [smalltimer, setSmallTimer] = useState(4);
  const [disabletn, setDisablebtn] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [ctr, setCtr] = useState(0);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const [chatExpanded, setChatExpanded] = useState(true);
  const [maxPlayers, setMaxPlayers] = useState(2);


  const navbarStyle = {
    position: "absolute",
    width: "100%",
    height: "10vh",
    top: "0",
    backgroundColor: "rgba(25,17,16, 0.5)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    zIndex: "3",
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected');

      socket.emit('joinroom', {
        roomno: params.id,
        username: localStorage.getItem("ccusername"),
        ccuid: localStorage.getItem("ccuid"),
        avatar: localStorage.getItem("ccavatar"),
      });
      console.log("ghjhghj", localStorage.getItem("ccusername"), localStorage.getItem("ccuid"), localStorage.getItem("ccavatar"));
    });

    socket.on("request_join_room_owner", (data)=>{
      console.log(data);
      const resp = confirm(data.ccusername+" wants to join your room. Do you want to accept?");

      if(resp){
        socket.emit("request_join_room_owner_accept", data);
      }else{
        socket.emit("request_join_room_owner_reject", data);
      }

    })

    socket.on("someonejoined", (data) => {
      
      console.log(Object.keys(data));
      setUserids(Object.keys(data));
      setAllusers(data);
    });

    socket.on("readyb", (data) => {
      console.log(data);
      setAllusers(data);
      console.log("total ready:-", ctr);
      setCtr((prevCtr) => prevCtr + 1);
    });

    socket.on("cancelb", (data) => {
      setAllusers(data);
      console.log("total ready:-", ctr);
      setCtr((prevCtr) => prevCtr - 1);
    });

    socket.on('receive-msg', (data) => {
      setMessages((prevMessages) => [...prevMessages, {text:data.message, user:data.username}]);
    });

  }, [socket, params.id]);

  useEffect(() => {
    if (ctr === alluserids.length && ctr >= 2) {
      setDisablebtn(true);
      // intentionally did not used await will update the game status to in game
      console.log("http://localhost:3000/app/rooms/"+params.id);
      axios.patch("http://localhost:3000/app/rooms/"+params.id);

      const timer = setInterval(() => {
        setSmallTimer((prevSmallTimer) => {
          if (prevSmallTimer <= 0) {
            clearInterval(timer);
            navigate("/game/" + params.id);
          }
          return prevSmallTimer - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }

    return ()=>{
      console.log(window.location);
      // exitroom();
    }
  }, [ctr]);

  useEffect(()=>{
    async function getroomdata(){
      await axios.get("http://localhost:3000/app/rooms/"+params.id).then((res)=>{
        console.log("room data:",res.data);
        setMaxPlayers(res.data.room.numPlayers);
      })
      .catch((err)=>{
        console.log(err);
      })
    }

    getroomdata();
  })

  const gamedetails = ["Solo", "Duo", "Trio", "Quartet", "Quintet", "Sextet", "Septet", "Octet"];

  const startgame = (e) => {
    if (!isReady) {
      setIsReady(true);
      socket.emit("ready", { roomno: params.id, ccuid: localStorage.getItem("ccuid") });
    } else {
      setIsReady(false);
      socket.emit("cancelready", { roomno: params.id, ccuid: localStorage.getItem("ccuid") });
    }
  };

  const exitroom = () => {
    try{
      axios.post("http://localhost:3000/app/rooms/exitroom", { roomno: params.id, uid: localStorage.getItem("ccpid") }, {withCredentials: true}).then(()=>{
        socket.emit("user-disconnect", { roomno: params.id, ccuid: localStorage.getItem("ccuid") });
        navigate("/");
      })
    } catch(err){
      console.log(err);
      return res.json(err);
    }
   
    
  }

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('chat-message', { roomno: params.id, message, username: localStorage.getItem("ccusername") });
      setMessage('');
    }
  };

  return (
    <div className='animated-gradient bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 h-screen flex flex-col items-center justify-center relative'>
      <nav style={navbarStyle}>
        <p className='text-center text-slate-200 py-2'>
          {alluserids.length <= 1 ? "You Can Not Start The Game When No Other Players Are Present" : "Press Ready To Start The Game"}
          <br />
          or just Wait For Other Players To Join...
        </p>
      </nav>
      <div className="absolute top-16 left-0 right-0 z-10 bg-red-700 w-1/5 mx-auto flex justify-center items-center text-3xl p-2 rounded-lg shadow-lg cursor-pointer" style={{ height: "10vh" }}>
        {gamedetails[alluserids.length - 1]}
      </div>
      <div className='text-slate-200 text-right px-6 text-xl my-7 absolute top-24 right-0'>
        {console.log(allusers)}
        Min no of players - 2
        <br />
        Max no of players - {maxPlayers}
      </div>
      <div className='flex justify-evenly mt-20 w-full px-20'>
        {alluserids.map((userid, index) => (
          <Usercomponent ud={allusers[userid]} key={index} no={index + 1} />
        ))}
      </div>
      {disabletn ? (
        <div className='w-screen h-screen text-center mt-auto text-6xl text-slate-200'>
          {smalltimer}
        </div>
      ) : (
        <button
          className={`text-center ${isReady ? "bg-red-600" : "bg-slate-200 hover:bg-red-600"}  w-fit p-5 text-4xl rounded-lg block mx-auto relative top-30 shadow-lg transition duration-300 transform hover:scale-105 active:scale-951`}
          onClick={startgame}
        >
          {isReady ? "Cancel" : "Ready"}
        </button>
      )}

      <div className='absolute bottom-7 left-7 flex flex-col w-1/3'>
        <div className='w-full bg-indigo-950 h-5 rounded text-right cursor-pointer' onClick={()=>setChatExpanded(!chatExpanded)}>
          <ArrowDropUpIcon sx={{ color: pink[500] }} fontSize="large" className={`hover:scale-150 relative bottom-2 cursor-pointer ${chatExpanded ? 'rotate-180' : ''}`}  onClick={()=>setChatExpanded(!chatExpanded)} /> 
        </div>
        {chatExpanded && messages.length > 0 && (
          <div className='bg-gray-800 mt-2 rounded p-2 max-h-64 overflow-y-auto'>
            {messages.map((msg, index) => (
              <div key={index} className='text-white mb-2'>
                <strong>{msg.user}:</strong> {msg.text}
              </div>
            ))}
          </div>
        )}
        <div className='mt-2 flex'>
          <input
            className='flex-1 p-2 rounded-l-lg focus:outline-none'
            type='text'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Type your message...'
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            className='p-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition duration-300'
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>

      <img src={logo} width="100" height="100" className='absolute bottom-7 right-7 hover:scale-125 cursor-pointer' onClick={exitroom} />
    </div>
  );
};

export default GameRoom;

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Usercomponent from './Waitingroom.jsx/Usercomponent';
import { io } from 'socket.io-client';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { pink } from '@mui/material/colors';
import axios from "axios";
import shareIcon from "../assets/shareIcon.png";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

import logo from "../assets/exit_12.png";
import Logo from './Logo';

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
  const [category, setCategory] = useState("ALL");
  const [timeLimit, setTimeLimit] = useState(60);
  const [gameType, setGameType] = useState("MCQ BATTLE");
  const [copy, setCopy] = useState("Copy Url");
  const [showModel, setShowModel] = useState(false);

  const modalRef = useRef(null); 

  const shareOnWhatsApp = () => {

    const whatsappMessage = `Join my room on CodeCombat: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
  };


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
      setCtr(0);
      setIsReady(false);
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
        setCategory(res.data.room.categories==""?"ALL":res.data.room.categories);
        setTimeLimit(res.data.room.timeLimit);
        setGameType(res.data.room.gameType);
      })
      .catch((err)=>{
        console.log(err);
        alert("room does not exist");
        navigate("/home");
      })
    }

    getroomdata();
  }, [])

  
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) { 
      setShowModel(false);
      setCopy("Copy Url");
    }
  };

  useEffect(() => {
    console.log(showModel)
    if (showModel) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModel]);


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
    <>
    <mymodel className={`w-screen h-screen absolute z-10 flex justify-center items-center bg-[rgba(0,0,0,0.5)] ${showModel ? "block" : "hidden"}`}>
      <div className='w-1/3 h-1/3 bg-white p-5 rounded-lg text-center flex flex-col items-center' ref={modalRef}>
        <Logo />
        <hr className="bg-black my-2"/>

        <div className="bg-black text-white rounded-lg w-fit p-2 mt-4 hover:bg-red-700 cursor-pointer hover:scale-110" 
        onClick={(e)=>{
          navigator.clipboard.writeText("window.location.href").then(()=>{
            setCopy("Copied!");
            // e.target.className = "bg-red-700 rounded-lg w-fit p-2 mt-4 hover:bg-red-700 cursor-pointer hover:scale-110"
          })
        }}>{copy}</div>

        <div className='my-2 font-semibold text-xl'>or</div>
        <WhatsAppIcon className='cursor-pointer scale-150 hover:scale-[2] mt-1' onClick={shareOnWhatsApp}/>
      </div>
      
    </mymodel>
    <div className='animated-gradient bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 h-screen flex flex-col items-center justify-center relative'>
      <nav style={navbarStyle}>
        <p className='text-center text-slate-200 pt-5'>
          {alluserids.length <= 1 ? "You Can Not Start The Game When No Other Players Are Present" : "Press Ready To Start The Game"}
          <br />
        </p>
      </nav>
      <div className="absolute top-16 left-0 right-0 z-10 bg-red-700 w-1/5 mx-auto flex justify-center items-center text-3xl p-2 rounded-lg shadow-lg cursor-pointer font-semibold" style={{ height: "10vh" }}>
        {gamedetails[alluserids.length - 1]}
      </div>
      <div className='text-white px-8 text-xl my-7 absolute top-24 right-8 flex flex-col items-start cursor-pointer border-2 py-2 border-black rounded-lg font-bold bg-black hover:scale-105'>
      <span>{gameType}</span>
        <span>Category: {category}</span>
        
        <span>Total Players - {alluserids.length}</span>
        
        <span>Min no of players - 2</span>
        
        <span>Max no of players - {maxPlayers}</span>

        <span>Timelimit-{timeLimit} sec</span>
        
      </div>
      <div className='flex justify-evenly mt-20 w-full px-20'>
        {alluserids.map((userid, index) => (
          <Usercomponent ud={allusers[userid]} key={index} no={index + 1} />
        ))}
      </div>
      {disabletn ? (
        <div className='w-screen h-screen text-center mt-auto text-6xl text-slate-200 fixed z-50 bg-transparent top-[20%]'>
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

      <img src={logo} width="100" height="100" className='absolute top-20 z-20 left-12 hover:scale-125 cursor-pointer' onClick={exitroom} />
      <img src={shareIcon} className='absolute bottom-10 right-14 hover:scale-125 cursor-pointer w-20 rounded-xl' onClick={()=>setShowModel(true)}/>
    </div>
    </>
  );
};

export default GameRoom;

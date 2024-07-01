import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import img from "../assets/bg_img3.jpg";
import Usercomponent from './Waitingroom.jsx/Usercomponent';
import { io } from 'socket.io-client';

const GameRoom = () => {
  const params = useParams();
  const navigate = useNavigate();

  const socket = useMemo(() => io('http://localhost:5000'), []);

  const [allusers, setAllusers] = useState({});
  const [alluserids, setUserids] = useState([]);
  const [smalltimer, setSmallTimer] = useState(4);
  const [disabletn, setDisablebtn] = useState(false);

  const navbarStyle = {
    position: "absolute", 
    width: "100%",
    height: "10vh",
    backgroundColor: "rgba(25,17,16, 0.5)", 
    backdropFilter: "blur(10px)", 
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",  
    zIndex: "3", 
  };

  useState(()=>{
    socket.on('connect', () => {
      console.log('connected');

      socket.emit('joinroom', {
        roomno: params.id,
        username: localStorage.getItem("ccusername"),
        ccuid: localStorage.getItem("ccuid"),
        avatar: localStorage.getItem("ccavatar"),
      });

    });

    socket.on("someonejoined", (data)=>{
      // let tempdata = Object.values(data);
      let tempdata2 = Object.keys(data);
      setUserids(tempdata2);
      
      console.log(tempdata2);
      setAllusers(data);
    });

  },[]);

  const gamedetails = ["Solo", "Duo", "Trio", "Quartet", "Quintet", "Sextet", "Septet", "Octet"];

  const startgame = ()=>{
    setDisablebtn(true)
    setInterval(()=>{
      setSmallTimer((smalltimer)=>{
        if(smalltimer <= 0){
          navigate("/game/"+params.id)
        }
        return smalltimer-1;
      });
    }, 1000);
  }

  return (
    <div style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', width:"100vw", height:"100vh"}}>
        <nav style={navbarStyle} >
          <p className='text-center text-slate-200 py-2'>{alluserids.length<=1?"You Can Not Start The Game When No Other Players Are Present":"Press Start To Start The Game"} <br/> Waiting For Other Players To Join...</p>
        </nav> 
        <bar className="absolute top-0 z-10 bg-red-700 w-1/5 flex justify-center items-center text-3xl" style={{height:"10vh"}}>{gamedetails[alluserids.length-1]}</bar>
        <br/>
        <br/>
        <div className='text-slate-200 text-right px-6 text-xl my-7'>
            Min no of players - {2}
            <br/>
            Max no of players - {8}
        </div>

        {/* <Usercomponent/> */}
        <div className='flex justify-evenly'>
          {
            alluserids.map((userid, index)=>{
              return (
                  <Usercomponent ud={allusers[userid]} key={index} no={index+1}/>
              )
            })
          }
        </div>
        {disabletn && <div className='w-screen h-screen text-center mt-auto text-6xl text-slate-200'>{smalltimer}</div>}
        {!disabletn && <button className='text-center bg-sky-500 hover:bg-cyan-700 w-fit p-5 text-4xl rounded-lg block mx-auto relative top-28' onClick={startgame}>
            START
        </button>}

        

    </div>
  )
}

export default GameRoom;

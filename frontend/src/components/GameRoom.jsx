// import React, { useEffect, useMemo, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import img from "../assets/bg_img3.jpg";
// import Usercomponent from './Waitingroom.jsx/Usercomponent';
// import { io } from 'socket.io-client';

// const GameRoom = () => {
//   const params = useParams();
//   const navigate = useNavigate();

//   const socket = useMemo(() => io('http://localhost:5000'), []);

//   const [allusers, setAllusers] = useState({});
//   const [alluserids, setUserids] = useState([]);
//   const [smalltimer, setSmallTimer] = useState(4);
//   const [disabletn, setDisablebtn] = useState(false);
//   const [isReady, setIsReady] = useState(false);
//   const [ctr, setCtr] = useState(0);

//   const navbarStyle = {
//     position: "absolute",
//     width: "100%",
//     height: "10vh",
//     top: "0",
//     backgroundColor: "rgba(25,17,16, 0.5)",
//     backdropFilter: "blur(10px)",
//     borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
//     zIndex: "3",
//   };

//   useEffect(() => {
//     socket.on('connect', () => {
//       console.log('connected');
//       socket.emit('joinroom', {
//         roomno: params.id,
//         username: localStorage.getItem("ccusername"),
//         ccuid: localStorage.getItem("ccuid"),
//         avatar: localStorage.getItem("ccavatar"),
//       });
//     });

//     socket.on("someonejoined", (data) => {
//       setUserids(Object.keys(data));
//       setAllusers(data);
//     });

//     socket.on("readyb", (data) => {
//       setAllusers(data);
//       setCtr((prevCtr) => prevCtr + 1);
//     });

//     socket.on("cancelb", (data) => {
//       setAllusers(data);
//     });
//   }, [socket, params.id]);

//   useEffect(() => {
//     if (ctr === alluserids.length && ctr >= 2) {
//       setDisablebtn(true);
//       const timer = setInterval(() => {
//         setSmallTimer((prevSmallTimer) => {
//           if (prevSmallTimer <= 0) {
//             clearInterval(timer);
//             navigate("/game/" + params.id);
//           }
//           return prevSmallTimer - 1;
//         });
//       }, 1000);
//       return () => clearInterval(timer);
//     }
//   }, [ctr, alluserids.length, navigate, params.id]);

//   const gamedetails = ["Solo", "Duo", "Trio", "Quartet", "Quintet", "Sextet", "Septet", "Octet"];

//   const startgame = () => {
//     if (!isReady) {
//       setIsReady(true);
//       socket.emit("ready", { roomno: params.id, ccuid: localStorage.getItem("ccuid") });
//     } else {
//       setIsReady(false);
//       socket.emit("cancelready", { roomno: params.id, ccuid: localStorage.getItem("ccuid") });
//     }
//   };

//   return (
//     <div className='bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 h-screen flex flex-col items-center justify-center relative'>
//       <nav style={navbarStyle}>
//         <p className='text-center text-slate-200 py-2'>
//           {alluserids.length <= 1 ? "You Can Not Start The Game When No Other Players Are Present" : "Press Start To Start The Game"}
//           <br />
//           Waiting For Other Players To Join...
//         </p>
//       </nav>
//       <div className="absolute top-16 left-0 right-0 z-10 bg-red-700 w-1/5 mx-auto flex justify-center items-center text-3xl p-2 rounded-lg shadow-lg" style={{ height: "10vh" }}>
//         {gamedetails[alluserids.length - 1]}
//       </div>
//       <div className='text-slate-200 text-right px-6 text-xl my-7 absolute top-24 right-0'>
//         Min no of players - 2
//         <br />
//         Max no of players - 8
//       </div>
//       <div className='flex justify-evenly mt-20 w-full px-20'>
//         {alluserids.map((userid, index) => (
//           <Usercomponent ud={allusers[userid]} key={index} no={index + 1} />
//         ))}
//       </div>
//       {disabletn ? (
//         <div className='w-screen h-screen text-center mt-auto text-6xl text-slate-200'>
//           {smalltimer}
//         </div>
//       ) : (
//         <button
//           className='text-center bg-sky-500 hover:bg-cyan-700 w-fit p-5 text-4xl rounded-lg block mx-auto relative top-28 shadow-lg'
//           onClick={startgame}
//         >
//           {isReady ? "Cancel" : "Ready"}
//         </button>
//       )}
//     </div>
//   );
// };

// export default GameRoom;


import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Usercomponent from './Waitingroom.jsx/Usercomponent';
import { io } from 'socket.io-client';

import logo from "../assets/exit-12.png";

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
    });

    socket.on("someonejoined", (data) => {
      setUserids(Object.keys(data));
      setAllusers(data);
    });

    socket.on("readyb", (data) => {
      setAllusers(data);
      setCtr((prevCtr) => prevCtr + 1);
    });

    socket.on("cancelb", (data) => {
      setAllusers(data);
      setCtr((prevCtr) => prevCtr - 1);
    });

  }, [socket, params.id]);

  useEffect(() => {
    if (ctr === alluserids.length && ctr >= 2) {
      setDisablebtn(true);
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
  }, [ctr]);

  const gamedetails = ["Solo", "Duo", "Trio", "Quartet", "Quintet", "Sextet", "Septet", "Octet"];

  const startgame = () => {
    if (!isReady) {
      setIsReady(true);
      socket.emit("ready", { roomno: params.id, ccuid: localStorage.getItem("ccuid") });
    } else {
      setIsReady(false);
      socket.emit("cancelready", { roomno: params.id, ccuid: localStorage.getItem("ccuid") });
    }
  };

  const exitroom = () => {
    socket.emit("user-disconnect", { roomno: params.id, ccuid: localStorage.getItem("ccuid") });
    navigate("/");
  }

  return (
    <div className='animated-gradient bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 h-screen flex flex-col items-center justify-center relative'>
      <nav style={navbarStyle}>
        <p className='text-center text-slate-200 py-2'>
          {alluserids.length <= 1 ? "You Can Not Start The Game When No Other Players Are Present" : "Press Ready To Start The Game"}
          <br />
          Waiting For Other Players To Join...
        </p>
      </nav>
      <div className="absolute top-16 left-0 right-0 z-10 bg-red-700 w-1/5 mx-auto flex justify-center items-center text-3xl p-2 rounded-lg shadow-lg" style={{ height: "10vh" }}>
        {gamedetails[alluserids.length - 1]}
      </div>
      <div className='text-slate-200 text-right px-6 text-xl my-7 absolute top-24 right-0'>
        Min no of players - 2
        <br />
        Max no of players - 8
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
          className='text-center bg-sky-500 hover:bg-cyan-700 w-fit p-5 text-4xl rounded-lg block mx-auto relative top-28 shadow-lg'
          onClick={startgame}
        >
          {isReady ? "Cancel" : "Ready"}
        </button>
      )}

      <img src={logo} width="100" height="100" className='absolute bottom-7 left-7 hover:scale-150 cursor-pointer' onClick={exitroom} />
    </div>
  );
};

export default GameRoom;

// import React, { useEffect, useMemo, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import Usercomponent from './Waitingroom.jsx/Usercomponent';
// import { io } from 'socket.io-client';

// const GameRoom = () => {
//   const params = useParams();
//   const navigate = useNavigate();

//   const socket = useMemo(() => io('http://localhost:5000'), []);

//   const [allusers, setAllusers] = useState({});
//   const [alluserids, setUserids] = useState([]);
//   const [smalltimer, setSmallTimer] = useState(4);
//   const [disabletn, setDisablebtn] = useState(false);
//   const [isReady, setIsReady] = useState(false);
//   const [ctr, setCtr] = useState(0);

//   const navbarStyle = {
//     position: "absolute",
//     width: "100%",
//     height: "10vh",
//     top: "0",
//     backgroundColor: "rgba(25,17,16, 0.5)",
//     backdropFilter: "blur(10px)",
//     borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
//     zIndex: "3",
//   };

//   useEffect(() => {
//     socket.on('connect', () => {
//       console.log('connected');
//       socket.emit('joinroom', {
//         roomno: params.id,
//         username: localStorage.getItem("ccusername"),
//         ccuid: localStorage.getItem("ccuid"),
//         avatar: localStorage.getItem("ccavatar"),
//       });
//     });

//     socket.on("someonejoined", (data) => {
//       setUserids(Object.keys(data));
//       setAllusers(data);
//     });

//     socket.on("readyb", (data) => {
//       setAllusers(data);
//       setCtr((prevCtr) => prevCtr + 1);
//     });

//     socket.on("cancelb", (data) => {
//       setAllusers(data);
//     });
//   }, [socket, params.id]);

//   useEffect(() => {
//     if (ctr === alluserids.length && ctr >= 2) {
//       setDisablebtn(true);
//       const timer = setInterval(() => {
//         setSmallTimer((prevSmallTimer) => {
//           if (prevSmallTimer <= 0) {
//             clearInterval(timer);
//             navigate("/game/" + params.id);
//           }
//           return prevSmallTimer - 1;
//         });
//       }, 1000);
//       return () => clearInterval(timer);
//     }
//   }, [ctr, alluserids.length, navigate, params.id]);

//   const gamedetails = ["Solo", "Duo", "Trio", "Quartet", "Quintet", "Sextet", "Septet", "Octet"];

//   const startgame = () => {
//     if (!isReady) {
//       setIsReady(true);
//       socket.emit("ready", { roomno: params.id, ccuid: localStorage.getItem("ccuid") });
//     } else {
//       setIsReady(false);
//       socket.emit("cancelready", { roomno: params.id, ccuid: localStorage.getItem("ccuid") });
//     }
//   };

//   return (
//     <div className='bg-gradient-to-r from-red-500 via-orange-500 to-pink-500 h-screen flex flex-col items-center justify-center relative'>
//       <nav style={navbarStyle}>
//         <p className='text-center text-white py-2'>
//           {alluserids.length <= 1 ? "You Can Not Start The Game When No Other Players Are Present" : "Press Start To Start The Game"}
//           <br />
//           Waiting For Other Players To Join...
//         </p>
//       </nav>
//       <div className="absolute top-16 left-0 right-0 z-10 bg-red-700 w-1/5 mx-auto flex justify-center items-center text-3xl p-2 rounded-lg shadow-lg" style={{ height: "10vh" }}>
//         {gamedetails[alluserids.length - 1]}
//       </div>
//       <div className='text-white text-right px-6 text-xl my-7 absolute top-24 right-0'>
//         Min no of players - 2
//         <br />
//         Max no of players - 8
//       </div>
//       <div className='flex justify-evenly mt-20 w-full px-20'>
//         {alluserids.map((userid, index) => (
//           <Usercomponent ud={allusers[userid]} key={index} no={index + 1} />
//         ))}
//       </div>
//       {disabletn ? (
//         <div className='w-screen h-screen text-center mt-auto text-6xl text-white'>
//           {smalltimer}
//         </div>
//       ) : (
//         <button
//           className='text-center bg-sky-500 hover:bg-cyan-700 w-fit p-5 text-4xl rounded-lg block mx-auto relative top-28 shadow-lg'
//           onClick={startgame}
//         >
//           {isReady ? "Cancel" : "Ready"}
//         </button>
//       )}
//     </div>
//   );
// };

// export default GameRoom;


// import React, { useEffect, useMemo, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import Usercomponent from './Waitingroom.jsx/Usercomponent';
// import { io } from 'socket.io-client';

// const GameRoom = () => {
//   const params = useParams();
//   const navigate = useNavigate();

//   const socket = useMemo(() => io('http://localhost:5000'), []);

//   const [allusers, setAllusers] = useState({});
//   const [alluserids, setUserids] = useState([]);
//   const [smalltimer, setSmallTimer] = useState(4);
//   const [disabletn, setDisablebtn] = useState(false);
//   const [isReady, setIsReady] = useState(false);
//   const [ctr, setCtr] = useState(0);

//   const navbarStyle = {
//     position: "absolute",
//     width: "100%",
//     height: "10vh",
//     top: "0",
//     backgroundColor: "rgba(25,17,16, 0.5)",
//     backdropFilter: "blur(10px)",
//     borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
//     zIndex: "3",
//   };

//   useEffect(() => {
//     socket.on('connect', () => {
//       console.log('connected');
//       socket.emit('joinroom', {
//         roomno: params.id,
//         username: localStorage.getItem("ccusername"),
//         ccuid: localStorage.getItem("ccuid"),
//         avatar: localStorage.getItem("ccavatar"),
//       });
//     });

//     socket.on("someonejoined", (data) => {
//       setUserids(Object.keys(data));
//       setAllusers(data);
//     });

//     socket.on("readyb", (data) => {
//       setAllusers(data);
//       setCtr((prevCtr) => prevCtr + 1);
//     });

//     socket.on("cancelb", (data) => {
//       setAllusers(data);
//     });
//   }, [socket, params.id]);

//   useEffect(() => {
//     if (ctr === alluserids.length && ctr >= 2) {
//       setDisablebtn(true);
//       const timer = setInterval(() => {
//         setSmallTimer((prevSmallTimer) => {
//           if (prevSmallTimer <= 0) {
//             clearInterval(timer);
//             navigate("/game/" + params.id);
//           }
//           return prevSmallTimer - 1;
//         });
//       }, 1000);
//       return () => clearInterval(timer);
//     }
//   }, [ctr, alluserids.length, navigate, params.id]);

//   const gamedetails = ["Solo", "Duo", "Trio", "Quartet", "Quintet", "Sextet", "Septet", "Octet"];

//   const startgame = () => {
//     if (!isReady) {
//       setIsReady(true);
//       socket.emit("ready", { roomno: params.id, ccuid: localStorage.getItem("ccuid") });
//     } else {
//       setIsReady(false);
//       socket.emit("cancelready", { roomno: params.id, ccuid: localStorage.getItem("ccuid") });
//     }
//   };

//   return (
//     <div className='bg-gradient-to-r from-red-500 via-orange-500 to-pink-500 h-screen flex flex-col items-center justify-center relative'>
//       <nav style={navbarStyle}>
//         <p className='text-center text-white py-2'>
//           {alluserids.length <= 1 ? "You Can Not Start The Game When No Other Players Are Present" : "Press Start To Start The Game"}
//           <br />
//           Waiting For Other Players To Join...
//         </p>
//       </nav>
//       <div className="absolute top-16 left-0 right-0 z-10 bg-red-700 w-1/5 mx-auto flex justify-center items-center text-3xl p-2 rounded-lg shadow-lg" style={{ height: "10vh" }}>
//         {gamedetails[alluserids.length - 1]}
//       </div>
//       <div className='text-white text-right px-6 text-xl my-7 absolute top-24 right-0'>
//         Min no of players - 2
//         <br />
//         Max no of players - 8
//       </div>
//       <div className='flex justify-evenly mt-20 w-full px-20'>
//         {alluserids.map((userid, index) => (
//           <Usercomponent ud={allusers[userid]} key={index} no={index + 1} />
//         ))}
//       </div>
//       {disabletn ? (
//         <div className='w-screen h-screen text-center mt-auto text-6xl text-white'>
//           {smalltimer}
//         </div>
//       ) : (
//         <button
//           className='text-center bg-sky-500 hover:bg-cyan-700 w-fit p-5 text-4xl rounded-lg block mx-auto relative top-28 shadow-lg'
//           onClick={startgame}
//         >
//           {isReady ? "Cancel" : "Ready"}
//         </button>
//       )}
//     </div>
//   );
// };

// export default GameRoom;


// import React, { useEffect, useMemo, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import Usercomponent from './Waitingroom.jsx/Usercomponent';
// import { io } from 'socket.io-client';

// const GameRoom = () => {
//   const params = useParams();
//   const navigate = useNavigate();

//   const socket = useMemo(() => io('http://localhost:5000'), []);

//   const [allusers, setAllusers] = useState({});
//   const [alluserids, setUserids] = useState([]);
//   const [smalltimer, setSmallTimer] = useState(4);
//   const [disabletn, setDisablebtn] = useState(false);
//   const [isReady, setIsReady] = useState(false);
//   const [ctr, setCtr] = useState(0);

//   const navbarStyle = {
//     position: "absolute",
//     width: "100%",
//     height: "10vh",
//     top: "0",
//     backgroundColor: "rgba(25,17,16, 0.5)",
//     backdropFilter: "blur(10px)",
//     borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
//     zIndex: "3",
//   };

//   useEffect(() => {
//     socket.on('connect', () => {
//       console.log('connected');
//       socket.emit('joinroom', {
//         roomno: params.id,
//         username: localStorage.getItem("ccusername"),
//         ccuid: localStorage.getItem("ccuid"),
//         avatar: localStorage.getItem("ccavatar"),
//       });
//     });

//     socket.on("someonejoined", (data) => {
//       setUserids(Object.keys(data));
//       setAllusers(data);
//     });

//     socket.on("readyb", (data) => {
//       setAllusers(data);
//       setCtr((prevCtr) => prevCtr + 1);
//     });

//     socket.on("cancelb", (data) => {
//       setAllusers(data);
//     });
//   }, [socket, params.id]);

//   useEffect(() => {
//     if (ctr === alluserids.length && ctr >= 2) {
//       setDisablebtn(true);
//       const timer = setInterval(() => {
//         setSmallTimer((prevSmallTimer) => {
//           if (prevSmallTimer <= 0) {
//             clearInterval(timer);
//             navigate("/game/" + params.id);
//           }
//           return prevSmallTimer - 1;
//         });
//       }, 1000);
//       return () => clearInterval(timer);
//     }
//   }, [ctr, alluserids.length, navigate, params.id]);

//   const gamedetails = ["Solo", "Duo", "Trio", "Quartet", "Quintet", "Sextet", "Septet", "Octet"];

//   const startgame = () => {
//     if (!isReady) {
//       setIsReady(true);
//       socket.emit("ready", { roomno: params.id, ccuid: localStorage.getItem("ccuid") });
//     } else {
//       setIsReady(false);
//       socket.emit("cancelready", { roomno: params.id, ccuid: localStorage.getItem("ccuid") });
//     }
//   };

//   return (
//     <div className='bg-gradient-to-r from-red-500 via-orange-500 to-pink-500 h-screen flex flex-col items-center justify-center relative'>
//       <nav style={navbarStyle}>
//         <p className='text-center text-white py-2'>
//           {alluserids.length <= 1 ? "You Can Not Start The Game When No Other Players Are Present" : "Press Start To Start The Game"}
//           <br />
//           Waiting For Other Players To Join...
//         </p>
//       </nav>
//       <div className="absolute top-16 left-0 right-0 z-10 bg-red-700 w-1/5 mx-auto flex justify-center items-center text-3xl p-2 rounded-lg shadow-lg transition-all duration-500" style={{ height: "10vh" }}>
//         {gamedetails[alluserids.length - 1]}
//       </div>
//       <div className='text-white text-right px-6 text-xl my-7 absolute top-24 right-0'>
//         Min no of players - 2
//         <br />
//         Max no of players - 8
//       </div>
//       <div className='flex justify-evenly mt-20 w-full px-20'>
//         {alluserids.map((userid, index) => (
//           <Usercomponent ud={allusers[userid]} key={index} no={index + 1} />
//         ))}
//       </div>
//       {disabletn ? (
//         <div className='w-screen h-screen text-center mt-auto text-6xl text-white'>
//           {smalltimer}
//         </div>
//       ) : (
//         <button
//           className='text-center bg-sky-500 hover:bg-cyan-700 w-fit p-5 text-4xl rounded-lg block mx-auto relative top-28 shadow-lg transition-all duration-300'
//           onClick={startgame}
//         >
//           {isReady ? "Cancel" : "Ready"}
//         </button>
//       )}
//     </div>
//   );
// };

// export default GameRoom;





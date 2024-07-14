// import React, { useEffect, useMemo, useState } from 'react';
// import SearchAppBar from './Searchbar';
// import MultiActionAreaCard from './CardRoom';
// import Sidebar from './Sidebar';

// import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
// import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useMemo, useState } from 'react';
import SearchAppBar from './Searchbar';
import MultiActionAreaCard from './CardRoom';
import Sidebar from './Sidebar';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';


import BasicModal from './Home/Createmodel';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import SidebarChat from './Globalchat';
import { useSocket } from '../SocketContext/SocketContext';


// const socket =  io('http://localhost:5000');




const Home = () => {

  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('');
  // const socket = useMemo(() => io('http://localhost:5000'), []);
  const socket = useSocket();

  const [searchOptions, setSearchOptions] = useState({
    CreatedBy: true,
    name: true,
    description: true,
  });

  const [searchsubmit, setSearchSubmit] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);


  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = async () => {
    // console.log("fghjk")
    getrooms();
    setShowModal(!showModal);
  }

  const [unreadnotifications, setUnreadnotifications] = useState(0);


  const [challengeNotifications, setChallengeNotifications] = useState([]);
  const [unreadchallenges, setUnreadchallenges] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  // const [notifications, searchNotifications] = useState([]);

  const navigate = useNavigate();



  const handleSendMessage = (message) => {
    console.log(message)
    if (message.trim()) {
      console.log(localStorage.getItem("ccusername"), localStorage.getItem("ccavatar"))
      socket.emit('sglobal', { text: message, sender: localStorage.getItem("ccusername"), timestamp: new Date().toLocaleTimeString(), profilepic: localStorage.getItem("ccavatar") });
      setMessages([...messages, { text: message, sender: 'You', timestamp: new Date().toLocaleTimeString(), profilepic: localStorage.getItem("ccavatar") }]);
    }
  };



  async function getrooms(filter = "") {
    try {
      console.log(filter.trim())
      if (filter.trim() != "") {
        const filteredrooms = await axios.get(`http://localhost:3000/app/rooms/filter/${filter}`);
        console.log("filtered rooms", filteredrooms.data);
        setRooms(filteredrooms.data.rooms);
      } else {
        console.log("all rooms fetching...");
        const allrooms = await axios.get("http://localhost:3000/app/rooms/all");
        console.log(allrooms.data.rooms);
        setRooms(allrooms.data.rooms);
      }
    } catch (err) {
      alert("please login")
    }
  }

  const fetchprofile = async function () {
    const response = await axios.get(`http://localhost:3000/app/profile/${localStorage.getItem("ccusername")}`);
    const data = await response.data;
    console.log("profile", data[0]);
    // localStorage.setItem("ccprofilepic", data[0].profilePic);
    // setMessages(data[0].messages);
    setChallengeNotifications([...data[0].notifications]);
    setUnreadchallenges(data[0].countunread);
  }


  // useEffect(()=>{
  //   // fetchprofile();
  //   for(let i=0; i<challengeNotifications.length; i++){
  //     if(!challengeNotifications[i].hasSeen){
  //       setUnreadchallenges((unreadchallenges)=>unreadchallenges+1);
  //     }
  //   }
  // }, [challengeNotifications])


  useEffect(() => {
    if(localStorage.getItem("ccusername")==null){
      navigate("/login");
    }
    fetchprofile();
  }, [])

  useEffect(() => {
    getrooms(filter);
  }, [searchsubmit]);


  useEffect(() => {

    socket.emit("online", ({ uid: localStorage.getItem("ccpid") }));


    socket.on('rglobal', (data) => {
      console.log("msg:-", data);

      setUnreadnotifications((unreadnotifications) => {
        // console.log(unreadnotifications+1);
        return unreadnotifications + 1
      });

      setMessages((messages) => {
        return [...messages, { text: data.text, sender: data.sender, timestamp: data.timestamp, profilepic: data.profilepic, username: data.sender }];
      })

    });

    socket.on("gotnotification", (data) => {

      // alert("got notification");
      setUnreadchallenges((unreadchallenges) => {
        return unreadchallenges + 1
      });
      fetchprofile();
      console.log(data);
    });

    return () => {
      socket.emit("offline", ({ uid: localStorage.getItem("ccpid") }));
    }

  }, [])


  function joinRoom(roomno) {
    console.log(roomno);

    navigate(`/home/room/${roomno}`, { state: { roomno } });

  }

  async function removenotification() {
    setUnreadchallenges(0);
    setShowNotifications(!showNotifications);
    // if(unreadchallenges>0){
    console.log(localStorage.getItem("ccusername"));
    const updatedp = await axios.patch("http://localhost:3000/app/profile/notifications", { username: localStorage.getItem("ccusername") });
    console.log("updated ", updatedp);
    // }

  }


  return (
    <>
      <BasicModal open={showModal} handleClose={handleCloseModal} />
      <div className='flex'>
        <div>
          <Sidebar />
        </div>
        <div className='w-full'>
          <div>
            <SearchAppBar searchOptions={searchOptions} searchfilter={setFilter} filter={filter} setSearchOptions={setSearchOptions} unreadnotifications={unreadnotifications} unreadchallenges={unreadchallenges} setUnreadchallenges={setUnreadchallenges} removenotification={removenotification} challengeNotifications={challengeNotifications} showNotifications={showNotifications} setShowNotifications={setShowNotifications} setSearchSubmit={setSearchSubmit} />
            <Button
              variant="contained"
              color="success"
              style={{ position: 'absolute', right: '10px', top: '80px' }}
              startIcon={<AddIcon />}
              onClick={handleOpenModal}
            >
              Create room
            </Button>
            <div className='m-10'>
              <h1>Join A Room</h1>
              <div className="max-h-[80vh] overflow-y-auto">
                {rooms.map((room, ind) => (
                  <MultiActionAreaCard key={ind} room={room} joinRoom={joinRoom} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <SidebarChat messages={messages} setMessages={setMessages} handleSendMessage={handleSendMessage} setUnreadnotifications={setUnreadnotifications} />

      </div>
    </>
  );
}

export default Home;
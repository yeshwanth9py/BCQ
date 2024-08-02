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
import { FaBolt } from 'react-icons/fa';

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
  const [filterrooms, setfilterrooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [passwordentered, setpasswordentered] = useState("");
  const [chats, setChats] = useState(false)


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



  async function getrooms() {
    try {
      console.log(filter.trim())
      console.log("all rooms fetching...");
      const allrooms = await axios.get("http://localhost:3000/app/rooms/all");
      console.log(allrooms.data.rooms);
      setRooms(allrooms.data.rooms);
    } catch (err) {
      alert("please login");
      navigate("/login");
    }
  }

  const fetchprofile = async function () {
    const response = await axios.get(`http://localhost:3000/app/profile/${localStorage.getItem("ccusername")}`);
    const data = await response.data;
    console.log("profile", data[0]);
    // localStorage.setItem("ccprofilepic", data[0].profilePic);
    // setMessages(data[0].messages);
    localStorage.setItem("ccavatar", data[0].profilePic);
    setChallengeNotifications([...data[0].notifications]);
    setUnreadchallenges(data[0].countunread);
  }

  useEffect(() => {
    axios.get("http://localhost:3000/app/user/isLoggedIn", { withCredentials: true }).then((res) => {
      console.log("profile:-", res.data);
    }).catch((err)=>{
      if(!err?.response?.success){
        alert("please login");
        navigate("/login");
      }
    })
  }, [])



  useEffect(() => {
    if (localStorage.getItem("ccusername") == null || localStorage.getItem("ccusername") == undefined) {
      alert("please login");
      navigate("/login");
    }
    getrooms()
    fetchprofile();
    
  }, [])

  useEffect(() => {
    console.log("searchoptions",searchOptions, "filter", filter);
    const tempfilter = rooms.filter((room) => {
      if (filter.trim() == "") {
        return room
      }
      else if (searchOptions.CreatedBy && room.CreatedBy.toLowerCase().includes(filter.toLowerCase())) {
        return room
      }
      else if (searchOptions.name && room.name.toLowerCase().includes(filter.toLowerCase())) {
        return room
      }
      else if (searchOptions.description && room.description.toLowerCase().includes(filter.toLowerCase())) {
        return room
      }
      else {
        return null
      }
    })

    setfilterrooms(tempfilter);
  }, [searchsubmit, filter, rooms]);


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
      });



    });

    socket.on("gotnotification", (data) => {

      // alert("got notification");
      setUnreadchallenges((unreadchallenges) => {
        return unreadchallenges + 1
      });
      fetchprofile();
      console.log(data);
    });

    socket.on("response_join_room", (data) => {

      console.log("data",data);
      // console.log(roomno);
      try {
        axios.post("http://localhost:3000/app/rooms/join", { roomno: data.roomno, uid: localStorage.getItem("ccpid"), passwordentered:{passwordentered} }, { withCredentials: true }).then((res) => {
          navigate(`/home/room/${data.roomno}`, { state: { roomno: data.roomno } });
        });
        
      } catch (err) {
        console.log(err)
        navigate("/login");
      }
    })

    return () => {
      socket.emit("offline", ({ uid: localStorage.getItem("ccpid") }));
    }

  }, [])


  function joinRoom(roomno) {
    
    
    // first get the socket id of the room owner and send the join request
    //if successfull send the room no as well to join
    socket.emit("request_join_room", { roomno: roomno, ccuid: localStorage.getItem("ccuid"), ccusername: localStorage.getItem("ccusername") });
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

  function createQuickMatch() {
    axios.get("http://localhost:3000/app/rooms/quickmatch", { withCredentials: true }).then((res) => {
      console.log("kkk", res.data);
      navigate(`/home/room/${res.data.roomid}`, { state: { roomno: res.data.roomid } });
    })
      .catch((err) => {
        if(err?.response?.status == 401){
          alert("please login");
          navigate("/login");
        }
        console.log(err);
        // navigate("/login");
      })
  }


  return (
    <>
      <BasicModal open={showModal} handleClose={handleCloseModal} />
      <div className='flex'>
        <div>
          <Sidebar setChats={setChats} />
        </div>
        <div className='w-full'>
          <div>
            <SearchAppBar searchOptions={searchOptions} searchfilter={setFilter} filter={filter} setSearchOptions={setSearchOptions} unreadnotifications={unreadnotifications} unreadchallenges={unreadchallenges} setUnreadchallenges={setUnreadchallenges} removenotification={removenotification} challengeNotifications={challengeNotifications} showNotifications={showNotifications} setShowNotifications={setShowNotifications} setSearchSubmit={setSearchSubmit} />
            <div className='flex justify-around pt-10'>
              <Button variant="contained"
                color="success"
                onClick={createQuickMatch}
                className='hover:scale-110'
              >
                <FaBolt className="mr-2" />
                Quick Match
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
                onClick={handleOpenModal}
                className='hover:scale-110'
              >
                Create A room
              </Button>
            </div>
            <div className='m-10'>
              <h1 className='text-2xl font-bold underline-offset-4 mb-2'>Join An Existing Room:-</h1>
              <div className="max-h-[80vh] overflow-y-auto grid grid-cols-2 gap-4">
                {rooms.length == 0 && <p className='text-center mt-10'>No rooms available currently, no worries you can create one :)</p>}
                {filterrooms && filterrooms.map((room, ind) => (
                  <MultiActionAreaCard key={ind} room={room} joinRoom={joinRoom} setpasswordentered={setpasswordentered} />
                ))}
                
              </div>
            </div>
          </div>
        </div>

        <SidebarChat messages={messages} setMessages={setMessages} handleSendMessage={handleSendMessage} setUnreadnotifications={setUnreadnotifications} setChats={setChats} chats={chats}/>

      </div>
    </>
  );
}

export default Home;
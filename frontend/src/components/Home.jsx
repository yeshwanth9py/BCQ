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

const Home = () => {

  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('');
  const socket = useMemo(() => io('http://localhost:5000'), []);

  const [searchOptions, setSearchOptions] = useState({
    CreatedBy: true,
    name: true,
    description: true,
  });

  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);


  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const [unreadnotifications, setUnreadnotifications] = useState(0);

  const navigate = useNavigate();

  const handleSendMessage = (message) => {
    console.log(message)
    if (message.trim()) {
      console.log()
      socket.emit('sglobal',  {text:message, sender: localStorage.getItem("ccusername"), timestamp: new Date().toLocaleTimeString() });
      setMessages([...messages, { text: message, sender: 'You', timestamp: new Date().toLocaleTimeString() }]);
    }
  };

  

  async function getrooms(filter) {
    console.log(filter.trim())
    if(filter.trim()!=""){
      const filteredrooms = await axios.get(`http://localhost:3000/app/rooms/filter/${filter}`);
      setRooms(filteredrooms.data.rooms);
    }else{
      console.log("all rooms fetching...");
      const allrooms = await axios.get("http://localhost:3000/app/rooms/all");
      console.log(allrooms.data.rooms);
      setRooms(allrooms.data.rooms);
    }
  }

  useEffect(() => {
    getrooms(filter);
  }, [filter]);


  useEffect(()=>{
    socket.on('rglobal', (data) => {
      console.log(data);

      setUnreadnotifications((unreadnotifications)=>{
        // console.log(unreadnotifications+1);
        return unreadnotifications+1
      });
      setMessages((messages)=>{
        return [...messages, { text: data.text, sender: data.sender, timestamp: data.timestamp }];
      })
    })
  },[])


  function joinRoom(roomno){
    console.log(roomno);

    navigate(`/home/room/${roomno}`, { state: { roomno } });
    
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
            <SearchAppBar searchfilter={setFilter} filter={filter} setSearchOptions={setSearchOptions} unreadnotifications={unreadnotifications}/>
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
              {rooms.map((room, ind) => (
                <MultiActionAreaCard key={ind} room={room} joinRoom={joinRoom}/>
              ))}
            </div>
          </div>
        </div>
        
        <SidebarChat messages={messages} setMessages={setMessages} handleSendMessage={handleSendMessage} setUnreadnotifications={setUnreadnotifications}/>
        
      </div>
    </>
  );
}

export default Home;

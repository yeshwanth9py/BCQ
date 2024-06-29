import React, { useEffect, useState } from 'react';
import SearchAppBar from './Searchbar';
import MultiActionAreaCard from './CardRoom';
import Sidebar from './Sidebar';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import BasicModal from './Home/Createmodel';
import axios from 'axios';

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [rooms, setRooms] = useState([]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);


  async function getrooms() {
    const allrooms = await axios.get("http://localhost:3000/app/rooms/all");
    console.log(allrooms.data.rooms);
    setRooms(allrooms.data.rooms);
  }

  useEffect(() => {
    getrooms();
  }, []);

  return (
    <>
      <BasicModal open={showModal} handleClose={handleCloseModal} />
      <div className='flex'>
        <div>
          <Sidebar />
        </div>

        <div className='w-full'>
          <div>
            <SearchAppBar />
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
              {rooms.map((room) => (
                <MultiActionAreaCard room={room} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;

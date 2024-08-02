import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaCrown } from 'react-icons/fa';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

// Sample data for demonstration


export default function Leaderboard() {
  const [page, setPage] = useState(1);
  const profilesPerPage = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [currentProfiles, setCurrentProfiles] = useState([]);
  const navigate = useNavigate();
  // const currentProfiles = ([] || profiles.slice((page - 1) * profilesPerPage, page * profilesPerPage));

  useEffect(() => {
    async function fetchData() {
      const profdata = await axios.get("http://localhost:3000/app/profile/");
      console.log(profdata);
      setProfiles(profdata.data);
      
    }

    fetchData();
  },[])

  useEffect(()=>{
    setTotalPages(Math.ceil(profiles.length / profilesPerPage));
    setCurrentProfiles(profiles.slice((page - 1) * profilesPerPage, page * profilesPerPage));
  }, [profiles])

  return (
    <div className="bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 min-h-screen p-10 flex flex-col items-center">
      <h1 className="text-6xl font-extrabold text-black mb-12 shadow-lg cursor-pointer hover:scale-110 hover:text-red-200">Leaderboard</h1>
      <div className="w-full max-w-screen-lg">
        <FaArrowLeft className='text-black fixed lg:top-[50%] left-1 text-xl cursor-pointer bg-white rounded-full lg:w-28 lg:h-16 hover:scale-105 sm:top-1 sm:w-10 sm:h-8' onClick={()=>{navigate("/")}}/>
            
        <h2 className="text-3xl font-bold text-white mb-8">Top Players</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentProfiles && currentProfiles.map((pro, index) => (
            <div
              key={index}
              className={`bg-white bg-opacity-20 backdrop-blur-lg p-6 rounded-lg shadow-xl transition-transform transform ${
                index === 0 ? 'scale-105' : 'hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center cursor-pointer">
                <img
                  src={pro.profilePic}
                  alt={`${pro.username}'s profile`}
                  className="w-36 h-36 rounded-full border-4 border-white shadow-lg mb-4"
                />
                {index === 0 && <FaCrown className="text-yellow-400 text-4xl mb-2 animate-bounce" />}
                <h2 className="text-3xl font-bold text-white">{pro.username}</h2>
                <p className="text-lg text-white text-opacity-80">Rank: {"pro.rank"}</p>
                <p className="text-lg text-white text-opacity-80">Points: {pro.totalpoints}</p>
                <p className="text-lg text-white text-opacity-80">Win/Loss Ratio: {pro.winlossratio}</p>
                <p className="text-lg text-white text-opacity-80">Games Played: {pro.totalGamesPlayed}</p>
                <p className="text-lg text-white text-opacity-80">Games Won: {pro.totalGamesWon}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50"
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-white font-semibold">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((old) => (!currentProfiles.length ? old : old + 1))}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

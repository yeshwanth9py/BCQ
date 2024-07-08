import { Button } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AiFillLike } from "react-icons/ai";

const Profile2 = () => {
  const [user, setUser] = useState({});
  const [profile, setProfile] = useState(null);
  const { id } = useParams();

  const fetchUserStats = async () => {
    const response = await axios.get(`http://localhost:3000/app/gamestats/${id}`);
    const data = await response.data;
    setUser(data);
    console.log("data", data);
  };

  const fetchProfile = async () => {
    const response = await axios.get(`http://localhost:3000/app/profile/${id}`);
    const data = await response.data;
    setProfile(data[0]);
    console.log("data", data[0]);
  };

  useEffect(() => {
    fetchProfile();
    fetchUserStats();
  }, []);

  return (
    <>
    { profile &&
    <div className="max-w-6xl mx-auto p-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex items-center p-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
          <img
            src={profile.profilePic || "https://via.placeholder.com/200"}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white"
          />
          <div className="ml-6">
            <h1 className="text-3xl font-bold">{profile.username || "Username"}</h1>
            <div className="flex items-center mt-2">
              <p className="mr-4">Rank: {user.profile || "Guardian"}</p>
              <p className="px-2 flex gap-1 items-center">{profile.likes.length || 0} <AiFillLike /> </p>
            </div>
            <div className='flex items-center justify-between relative top-2 gap-10'>
              <Button variant="contained" color="secondary">
                Follow
              </Button>
              <Button variant="contained" color="error">Challenge</Button>
            </div> 
          </div>
        </div>
        <div className="p-6 bg-gray-100">
          <div className="flex justify-between mb-4">
            <p>{profile.followers.length || 0} followers  </p>
            <p>{profile.following.length || 0} following</p>
          </div>
          <p className="mb-4">{profile.bio || "hi it's me"}</p>
        </div>
      </div>

      <h1 className="text-center text-4xl mt-10 mb-6 font-semibold">Previous Game Stats</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-8 flex justify-around text-lg">
        <h1>Win/Loss ratio: {user.winLossRatio || 0}</h1>
        <h1>Total Games Played: {user.totalGamesPlayed || 0}</h1>
        <h1>Total Games Lost: {user.totalGamesLost || 0}</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-4 py-2">Game Id</th>
              <th className="px-4 py-2">Room name</th>
              <th className="px-4 py-2">Total participants</th>
              <th className="px-4 py-2">Winner</th>
              <th className="px-4 py-2">Winner Score</th>
              <th className="px-4 py-2">User Score</th>
            </tr>
          </thead>
          <tbody>
            {user.gameStats && user.gameStats.map((game, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="px-4 py-2 text-center">{game.gameId}</td>
                <td className="px-4 py-2 text-center">{game.roomName}</td>
                <td className="px-4 py-2 text-center">{game.totalParticipants}</td>
                <td className="px-4 py-2 text-center">{game.winner}</td>
                <td className="px-4 py-2 text-center">{game.winnerScore}</td>
                <td className="px-4 py-2 text-center">{game.userScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div> }
    </>
  );
};

export default Profile2;

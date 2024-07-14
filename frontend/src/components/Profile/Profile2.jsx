import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { useSocket } from '../../SocketContext/SocketContext';

const Profile2 = () => {
  const [user, setUser] = useState({});
  const [profile, setProfile] = useState(null);
  const { id } = useParams();
  const [liked, setLiked] = useState(() => {
    return localStorage.getItem(`${id}.liked`) === "true";
  });

  const [follow, setFollow] = useState(() => {
    return localStorage.getItem(`${id}.follow`) === "true";
  });

  const socket = useSocket();

  const [likeCount, setLikeCount] = useState(0);
  const [followCount, setFollowCount] = useState(0);
  const [animate, setAnimate] = useState(false);

  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [rulesInstructions, setRulesInstructions] = useState('');
  const [gameType, setGameType] = useState('');
  const [numPlayers, setNumPlayers] = useState(2);
  const [timeLimit, setTimeLimit] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [categories, setCategories] = useState('');


  const [timer, setTimer] = useState();
  const navigate = useNavigate();

  const fetchUserStats = async () => {
    const response = await axios.get(`http://localhost:3000/app/gamestats/${id}`);
    const data = await response.data;
    console.log("data", data);
    setUser(data);
  };

  const fetchProfile = async () => {
    const response = await axios.get(`http://localhost:3000/app/profile/${id}`);
    const data = await response.data;
    console.log("profile", data);
    setProfile(data[0]);
  };

  useEffect(() => {
    fetchProfile();
    fetchUserStats();
  }, []);

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [animate]);

  useEffect(() => {
    if (profile) {
      setLikeCount(profile.likes.length);   
      setFollowCount(profile.followers.length);
    }
  }, [profile]);

  const sendLike = async () => {
    if (liked) {
      setLiked(false);
      setLikeCount(prevCount => prevCount - 1);
      localStorage.removeItem(`${id}.liked`);
    } else {
      setLiked(true);
      setLikeCount(prevCount => prevCount + 1);
      localStorage.setItem(`${id}.liked`, "true");
    }
    try {
      const { data } = await axios.post("http://localhost:3000/app/profile/like", {
        by: localStorage.getItem("ccpid"),
        toname: id
      });

      if (data.liked) {
        setLiked(true);
        setLikeCount(data.likesCount);
        localStorage.setItem(`${id}.liked`, "true");
      } else {
        setLiked(false);
        setLikeCount(data.likesCount);
        localStorage.removeItem(`${id}.liked`);
      }

      // Trigger animation
      setAnimate(true);
    } catch (err) {
      console.error(err);
    }
  };

  const sendFollow = async () => {
    try {
      const { data } = await axios.post("http://localhost:3000/app/profile/follow", {
        by: localStorage.getItem("ccpid"),
        toname: id
      });
      if (data.followed) {
        setFollow(true);
        setFollowCount(data.followersCount);
        localStorage.setItem(`${id}.follow`, "true");
      } else {
        setFollow(false);
        setFollowCount(data.followersCount);
        localStorage.removeItem(`${id}.follow`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChallenge = async (topid) => {
    console.log("challenge", topid);
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleCreateRoom = async () => {
    console.log("cme1")
    try{
    const challengeData = {
      roomName,
      rulesInstructions,
      gameType,
      numPlayers,
      timeLimit,
      difficultyLevel,
      categories,
      createdBy: localStorage.getItem("ccusername")
    }; 
    const savedroom = await axios.post("http://localhost:3000/app/rooms/create", challengeData, {withCredentials: true});
    console.log(savedroom.data.room);
    const res = await axios.post("http://localhost:3000/app/profile/challenge", {bypid: localStorage.getItem("ccpid"), byname: localStorage.getItem("ccusername"), topid: profile._id, date:Date.now(), profilepic: profile.profilePic,savedroom: savedroom.data.room});
    console.log("res for challenge", res);
    socket.emit("notification", ({bypid: localStorage.getItem("ccpid"), byname: localStorage.getItem("ccusername"),topid:profile._id, date:Date.now(), profilepic: profile.profilePic}));
    setTimer(4);
    setInterval(() => {
      setTimer((prevTimer) => {
        if(prevTimer === 0){
          navigate("/home/room/" + savedroom.data.room._id);
        }
        return prevTimer - 1
      });
    }, 1000);
    // const res = await axios.post("http://localhost:3000/app/profile/challenge", challengeData);
    // console.log("res for challenge", res);
    // socket.emit("notification", ({ ...challengeData, profilepic: profile.profilePic }));
    setOpen(false);
  }catch(err){
    console.error(err);
    setOpen(false);
  }
}

  return (
    <>
      {profile &&
        <div className="max-w-6xl mx-auto p-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="flex items-center p-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              <img
                src={profile.profilePic || "https://via.placeholder.com/200"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white"
              />
              <div className="ml-6">
                <h1 className="text-3xl font-bold">{profile.username}{localStorage.getItem("ccusername") == profile.username ? " (You)" : ""}</h1>
                <div className="flex items-center mt-2">
                  <p className="mr-4">Rank: {user.profile || "Guardian"}</p>
                  <p className="px-2 flex gap-1 items-center">
                    {likeCount || 0} 
                    {!liked ? (
                      <AiOutlineLike 
                        className={`cursor-pointer ${animate ? 'unlike-animation' : ''}`} 
                        onClick={sendLike} 
                      />
                    ) : (
                      <AiFillLike 
                        className={`cursor-pointer ${animate ? 'like-animation' : ''}`} 
                        onClick={sendLike} 
                      />
                    )}
                  </p>
                </div>
                <div className='flex items-center justify-between relative top-2 gap-10'>
                  <Button variant="contained" color="secondary" onClick={sendFollow}>
                    {follow ? "Unfollow" : "Follow"}
                  </Button>
                  <Button variant="contained" color="error" onClick={() => handleChallenge(profile._id)}>Challenge</Button>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-100">
              <div className="flex justify-between mb-4">
                <p>{followCount || 0} followers</p>
                <p>{profile.following.length || 0} following</p>
              </div>
              <p className="mb-4">{profile.bio || "hi it's me"}</p>
            </div>
          </div>
          {timer && <h1 className='text-center text-3xl text-cyan-500'>You will be redirected in {timer} sec</h1>}
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
        </div>}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a New Challenge</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Room Name"
            fullWidth
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Rules & Instructions"
            fullWidth
            multiline
            rows={3}
            value={rulesInstructions}
            onChange={(e) => setRulesInstructions(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Game Type"
            fullWidth
            value={gameType}
            onChange={(e) => setGameType(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Number of Players"
            fullWidth
            type="number"
            value={numPlayers}
            onChange={(e) => setNumPlayers(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Time Limit (minutes)"
            fullWidth
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Difficulty Level"
            fullWidth
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Categories"
            fullWidth
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateRoom} color="primary">
            Create Challenge
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Profile2;

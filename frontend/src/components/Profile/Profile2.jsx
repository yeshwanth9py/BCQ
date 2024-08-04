import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaArrowLeft } from 'react-icons/fa';
import { useSocket } from '../../SocketContext/SocketContext';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Loader from '../Loader';

const Profile2 = () => {
  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState(null);
  const { id } = useParams();
  const [liked, setLiked] = useState(() => {
    return localStorage.getItem(`${id}.liked`) === "true";
  });

  const [follow, setFollow] = useState(() => {
    return localStorage.getItem(`${id}.follow`) === "true";
  });

  const socket = useSocket();

  const [status, setStatus] = useState("loading");

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

  const [curruid, setCuid] = useState("");
  const [display, setDisplay] = useState(false);

  const [searchResults, setSearchResults] = useState("");


  const [timer, setTimer] = useState();
  const [expanded, setExpanded] = useState(false);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchUserStats = async () => {
    const response = await axios.get(`http://localhost:3000/app/gamestats/${id}?page=${page}`);
    const data = response.data.gamed;
    setCuid(response.data.uid);
    console.log("user stats", data);
    setUser(data);
  };

  const fetchProfile = async () => {
    const response = await axios.get(`http://localhost:3000/app/profile/${id}`);
    const data = await response.data;
    console.log("profile", data);
    setProfile(data[0]);
    setTotalPages(Math.ceil(data[0].previousGames.length/10));
    setStatus("success");
  };

  useEffect(() => {
    fetchProfile();
    // fetchUserStats();
    setTimeout(() => {
      setExpanded(true)
    }, 1000);
  }, []);

  useEffect(() => {
    fetchUserStats();
  },[page]);

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
    try {
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
      const savedroom = await axios.post("http://localhost:3000/app/rooms/create", challengeData, {
        withCredentials: true,
        headers: {
          'auth-token': sessionStorage.getItem("token"), // Replace with your actual token or header information
          'Content-Type': 'application/json' // Include other headers as needed
        }
      });
      console.log(savedroom.data.room);
      console.log("room created")
      const res = await axios.post("http://localhost:3000/app/profile/challenge", { bypid: localStorage.getItem("ccpid"), byname: localStorage.getItem("ccusername"), topid: profile._id, date: Date.now(), profilepic: profile.profilePic, savedroom: savedroom.data.room }, {
        withCredentials: true,
        headers: {
          'auth-token': sessionStorage.getItem("token"), // Replace with your actual token or header information
          'Content-Type': 'application/json' // Include other headers as needed
        }
      });
      console.log("res for challenge", res);
      socket.emit("notification", ({ bypid: localStorage.getItem("ccpid"), byname: localStorage.getItem("ccusername"), topid: profile._id, date: Date.now(), profilepic: profile.profilePic }));
      setTimer(4);
      setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 0) {
            navigate("/home/room/" + savedroom.data.room._id);
          }
          return prevTimer - 1
        });
      }, 1000);
      // const res = await axios.post("http://localhost:3000/app/profile/challenge", challengeData);
      // console.log("res for challenge", res);
      // socket.emit("notification", ({ ...challengeData, profilepic: profile.profilePic }));
      setOpen(false);
    } catch (err) {
      console.error(err);
      setOpen(false);
      alert("An error occurred. Please try again later.");
    }
  }

  function convertToTime(ms) {
    let tobj = new Date(Number(ms));

    return tobj.toLocaleString();
  }

  if (status == "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    )
  }


  async function searchUsers(searchTerm) {
    try {
      console.log("inside search")
      const response = await axios.get(`http://localhost:3000/app/profile/search/${searchTerm}`);
      console.log("response", response);
      return response.data
    } catch (err) {
      console.log(err);
      return []
    }

  }

  // const [searchTerm, setSearchTerm] = useState("");
  async function handleSearch(e) {
    e.preventDefault();
    console.log(e.target.value);

    if (e.target.value.trim().length > 1) {
      setDisplay(true);

      const results = await searchUsers(e.target.value);
      setSearchResults(results);

    } else {
      setDisplay(false)
    }



    // navigate(`/profile/${searchTerm}`);
  }

  return (
    <>
      {profile &&
        <div className="max-w-7xl mx-auto p-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className='relative'>
              <input
                className='absolute top-16 right-44 rounded-lg outline-none px-2 py-1 border-2 border-gray-300 shadow-slate-900 shadow-md'
                placeholder='&#128269;Search for other user...'
                onInput={e => handleSearch(e)}
              />

              {display && (
                <div className='absolute top-24 right-44 rounded-lg outline-none px-2 py-1 border-2 border-gray-300 shadow-slate-900 shadow-md bg-slate-400 w-[12.6rem] overflow-y-auto'>
                  {searchResults?.length > 0 ? (
                    searchResults?.map((result, index) => (
                      <div key={index} className='py-1 px-2 border-b border-gray-300'>
                        <div className='flex cursor-pointer gap-2' onClick={() => {
                          setDisplay(false);
                          console.log(result.username);
                          navigate(`/home/profile/` + result.username);
                          window.location.reload();
                        }}
                        ><img src={result.profilePic} className='w-8 h-8 rounded-full border-2 border-gray-300 hover:scale-110 cursor-pointer' /> {result.username}</div>
                      </div>
                    ))
                  ) : (
                    <div className='py-1 px-2'>No results found</div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center p-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              <img
                src={profile.profilePic || "https://via.placeholder.com/200"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white hover:scale-110 cursor-pointer"
              />
              <div className="ml-6">
                <h1 className="text-3xl font-bold">{profile.username}{localStorage.getItem("ccusername") == profile.username ? " (You)" : ""}</h1>
                <div className="flex items-center mt-2">
                  <p className="mr-4">Rank: {profile.rank || "Noob"}</p>
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
              <FaArrowLeft className='fixed top-[50%] left-1 text-xl cursor-pointer bg-black rounded-full w-28 h-16 hover:scale-105' onClick={()=>{navigate(-1)}}/>
            </div>
            <div className="p-6 bg-gray-100"> 
              <div className="flex justify-between mb-4 mx-2">
                <p className='font-semibold'>{followCount || 0} followers</p>
                <p className='font-semibold'>{profile.following.length || 0} following</p>
              </div>
              <div className='mx-2'>
                Bio:
                <p className="mb-4">{profile.bio || "hi it's me"}</p>
              </div>
            </div>
          </div>

          {timer && <h1 className='text-center text-3xl text-cyan-500'>You will be redirected to the room in {timer} sec</h1>}

          <h1 className="text-center text-4xl mt-10 mb-6 font-semibold">Previous Game Stats</h1>

          <div className="bg-white p-6 rounded-lg shadow-lg mb-8 flex justify-around text-lg">
            <h1>Win/Loss ratio: {profile.winlossratio || 0}</h1>
            <h1>Total Games Played: {profile.totalGamesPlayed || 0}</h1>
            <h1>Total Games Won: {profile.totalGamesWon || 0}</h1>
          </div>


          <Accordion expanded={expanded} style={{ padding: "0px", margin: "0px" }}>
            <AccordionSummary

              style={{ padding: "0px", margin: "0px" }}
              aria-controls="panel1-content"
              id="panel1-header"

            >
              <div className="grid grid-cols-7 w-full">

                <div className="bg-gray-800 text-white text-center px-6 py-4 flex justify-center items-center">Game Type</div>
                <div className="bg-gray-800 text-white text-center px-6 py-4 flex justify-center items-center">Room Name</div>
                <div className="bg-gray-800 text-white text-center px-6 py-2 flex justify-center items-center">Total participants</div>
                <div className="bg-gray-800 text-white text-center px-6 py-4 flex justify-center items-center">Winner</div>
                <div className="bg-gray-800 text-white text-center px-6 py-4 flex justify-center items-center">Winner Score</div>
                <div className="bg-gray-800 text-white text-center px-6 py-4 flex justify-center items-center">{(localStorage.getItem("ccusername") == id) ? "Your" : "User"} Score</div>
                <div className="bg-gray-800 text-white text-center px-6 py-4 flex justify-center items-center">Date</div>
              </div>
            </AccordionSummary>
            <AccordionDetails style={{ padding: "0px", margin: "0px" }}>

              {user && user.length > 0 && user.map((game, index) => {

                return (
                  <Accordion style={{ padding: "0px", margin: "0px" }}>
                    <AccordionSummary
                      aria-controls="panel1-content"
                      style={{ padding: "0px", margin: "0px" }}
                      id="panel1-header"
                    >
                      <div className="grid grid-cols-7 w-full hover:bg-gray-700 hover:text-rose-50" onClick={(e) => {
                        if (e.target.parentElement.classList.contains("bg-gray-700")) {
                          e.target.parentElement.classList.remove("bg-gray-700")
                          e.target.parentElement.classList.remove("text-rose-50")
                        } else {
                          e.target.parentElement.classList.add("bg-gray-700")
                          e.target.parentElement.classList.add("text-rose-50")
                        }
                      }}>
                        <div className="text-center px-6 py-4 flex justify-center items-center">{game.gametype || "MCQ Type"}</div>
                        <div className="text-center px-6 py-4 flex justify-center items-center">{game.roomno || "not found"}</div>
                        <div className="text-center px-6 py-2 flex justify-center items-center">{Object.keys(game.data).length || 0}</div>
                        <div className="text-center px-6 py-4 flex justify-center items-center">{game.winner || "None"}</div>
                        <div className="text-center px-6 py-4 flex justify-center items-center">{game.maxsc || 0}</div>
                        {console.log("curruid", curruid)}
                        <div className="text-center px-6 py-4 flex justify-center items-center">{curruid ? game.data[curruid].score : 0}</div>
                        <div className="text-center px-6 py-4 flex justify-center items-center">
                          {convertToTime(game.toi)}
                        </div>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails style={{ padding: "0px", margin: "0px" }} className='bg-gray-700 text-rose-50'>
                      <div className="grid grid-cols-6" style={{ marginRight: "-29px" }}>
                        <div className="text-center px-9 py-4 flex justify-center items-center" style={{ marginRight: "-10px" }}>Game Id</div>
                        <div className="text-center px-6 py-4 flex justify-center items-center">Username</div>
                        <div className="text-center px-6 py-4 flex justify-center items-center">Score</div>
                        <div className="text-center px-6 py-4 flex justify-center items-center">Attempted</div>
                        <div className="text-center px-6 py-4 flex justify-center items-center">Correct</div>
                        <div className="text-center px-6 py-4 flex justify-center items-center">Date</div>
                      </div>
                      {Object.keys(game.data).map((key, index) => {
                        return (
                          <div className="grid grid-cols-6" style={{ marginRight: "-29px" }}>
                            <div className="text-center px-16 py-4 flex justify-center items-center" style={{ marginRight: "-10px" }}>{key}</div>
                            <div className="text-center px-6 py-4 flex justify-center items-center">{game.data[key].username || "not found"}</div>
                            <div className="text-center px-6 py-4 flex justify-center items-center">{game.data[key].score || "0"}</div>
                            <div className="text-center px-6 py-4 flex justify-center items-center">{game.data[key].attempted || "0"}</div>
                            <div className="text-center px-6 py-4 flex justify-center items-center">{game.data[key].correct || "0"}</div>
                            <div className="text-center px-10 py-4 flex justify-center items-center">{convertToTime(game.toi)}</div>
                          </div>
                        )
                      })}
                    </AccordionDetails>
                  </Accordion>
                );
              })}
              {!user || user.length == 0 && <div className="text-center px-6 py-4 flex justify-center items-center">No Games Found</div>}

            </AccordionDetails>

          </Accordion>
        </div>}
      <div className='flex justify-center items-center my-5'>
        <button
          className={`mx-2 px-4 py-2 rounded-lg transition duration-300 ${page === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          onClick={()=>{
            setPage(page - 1);
          }}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className='mx-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-700'>
          Page {page} of {totalPages}
        </span>
        <button
          className={`mx-2 px-4 py-2 rounded-lg transition duration-300 ${page === totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          onClick={()=>{
            setPage(page + 1);
          }}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
     
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

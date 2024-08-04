import React, { useEffect, useState, useRef, useMemo } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import 'react-clock/dist/Clock.css';
import io from 'socket.io-client';
import { Grid, Card, CardContent, Typography, Avatar } from '@mui/material';

export default function MyClock() {

  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);

  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState({});
  const [attempted, setAttempted] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [exptimer, setExptimer] = useState(-1);
  const [otherScores, setOtherScores] = useState([]);


  const [prevdata, setprevdata] = useState([]);
  const [category, setCategory] =useState("");

  const choiceRefs = useRef([]);

  const [disableOptions, setDisableOptions] = useState(false);



  const params = useParams();
  // const location = useLocation();
  // const { roomno } = location.state || {};
  const roomno = params.id;
  const navigate = useNavigate();

  const socket = useMemo(() => io('http://localhost:5000'), []);

  // console.log(params)

  let id;
  useEffect(() => {


    socket.on('connect', () => {
      console.log('connected');

      socket.emit('join', {
        roomno: roomno,
        username: localStorage.getItem("ccusername"),
        ccuid: localStorage.getItem("ccuid"),
        avatar: localStorage.getItem("ccavatar"),
      });

    });

    socket.on('disconnect', () => {
      socket.emit("user-disconnect", {
        roomno: roomno,
        username: localStorage.getItem("ccusername"),
        ccuid: localStorage.getItem("ccuid"),
      });
      console.log('disconnected');
    });

    console.log('Connected to socket game server', socket.id);

    socket.on("readscore", (data) => {
      console.log("someone scored:", data);
      // for(let user of data){

      // }


      let temp = [];
      for (let user of Object.keys(data)) {
        temp.push({
          user: data[user]
        })
      }
      console.log("temp", temp)

      temp.sort((a, b) => {

        return -a.user.score + b.user.score;
      });
      console.log("temp after sorting", temp);

      setOtherScores(temp);
    });

    socket.on("user-disc", (data) => {
      console.log(data);
      console.log(data.ccuid, "has disconnected", data.roomno);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    getmcqs();
  }, []);

  useEffect(() => {
    async function getroomdata() {
      try {
        const res = await axios.get("http://localhost:3000/app/rooms/" + roomno);
        console.log("roomdata", res.data);
        //must set timer
        const timer = res.data.room.timeLimit;

        const mins = Math.floor(timer / 60);
        const secs = timer % 60;
        setMinutes(mins);
        setSeconds(secs);
        console.log("got a room",res.data.room.categories);
        if(res.data.room.categories){
          setCategory(res.data.room.categories=="All"?"":res.data.room.categories);
        }


      } catch (err) {
        console.log(err);
        alert("room does not exist");
        // navigate("/home");
      }
    }

    getroomdata();
  }, [])

  useEffect(() => {
    setInterval(decrementTime, 1000);
    return () => clearInterval(id);
  }, []);

// is currently in test
  useEffect(() => {
    sessionStorage.setItem("prevdata", JSON.stringify(prevdata));
  }, [prevdata]);

  async function getmcqs() {
    try{

    if(!category){

      const allmcqs = await axios.get("http://localhost:3000/app/mcqs/getrandom");
      setDisableOptions(false)
      setQuestions(allmcqs.data);
      setExplanation("");
      resetChoiceColors();
    }else{
      console.log("fetching the cat one only of ",category);
      const allmcqs = await axios.get("http://localhost:3000/app/mcqs/category?category="+category);
      setDisableOptions(false)
      setQuestions(allmcqs.data);
      setExplanation("");
      resetChoiceColors();
    }
  } catch(err){
    console.log(err);
    alert("dsome error occured");
  }
}

  function resetChoiceColors() {
    choiceRefs.current.forEach(ref => {
      if (ref) {
        ref.className = "bg-cyan-300 rounded-lg m-4 cursor-pointer hover:bg-blue-500 p-4";
      }
    });
  }

  function updatescore() {
    setScore(prevScore => {
      const newScore = prevScore + 1;
      setAttempted((prevAttempted) => {
        socket.emit("updatescore", { score: newScore, ccuid: localStorage.getItem("ccuid"), roomno, attempted: prevAttempted + 1, correct: correct + 1 });
        return prevAttempted + 1
      });
      return newScore;
    });

    setCorrect(correct + 1);
  }

  function updatescore2(){

    setAttempted((prevAttempted) => {
      socket.emit("updatescore", { score: score, ccuid: localStorage.getItem("ccuid"), roomno, attempted: prevAttempted+1, correct: correct });
      return prevAttempted + 1
    });

  }

  function decrementTime() {
    setSeconds(seconds => {
      if (seconds === 0) {
        setMinutes(minutes => {
          if (minutes === 0) {
            console.log("game ended");
            console.log("prevdata", prevdata);
            axios.patch("http://localhost:3000/app/rooms/finish/" + roomno, { roomno: roomno, username: localStorage.getItem("ccusername") });
            navigate("/gameover/" + roomno, { state: { prevdata: prevdata } });
            clearInterval(id);
            setMinutes(0);
            setSeconds(0);
            return;
          } else {
            return minutes - 1;
          }
        });
        return 59;

      } else {
        return seconds - 1;
      }
    });
  }

  const check = async (e) => {

    if(!disableOptions){
      let ans = e.target.textContent.slice(3);
      console.log(ans, questions.id);

      console.log("questions", questions);

      //error sending id
      // const res = await axios.post("http://localhost:3000/app/mcqs/checkans", { id: questions.id, ans });
      const res = await axios.post("http://localhost:3000/app/mcqs/checkans", { id: questions.id, question: questions.question, ans });
      console.log("res.data", res.data)

      if (res.data.correct) {
        // bg-cyan-300 rounded-lg m-4 cursor-pointer hover:bg-blue-500 p-4 
        console.log("ghjkl",e.target);
        e.target.className = "bg-green-500 rounded-lg m-4 cursor-pointer p-4 w-full mx-auto";
        updatescore();
      } else {
        e.target.className = "bg-red-500 rounded-lg m-4 cursor-pointer p-4";
        updatescore2()
      }

      

      runexptimer();

      setExplanation(res.data.explanation);


      setprevdata((prevdata) => {
        return { ...prevdata, [questions.id]: { ...questions, user_ans: ans, explanation: res.data.explanation, correct: res.data.correct } };
      });
      setDisableOptions(true)

      setTimeout(() => {
        console.log("prevdata", prevdata, "minutes", minutes);
        getmcqs()
        setDisableOptions(false);
      }, 4000);
    }else{
      return
    }
  };

  function runexptimer() {
    setExptimer(3);
    const id2 = setInterval(() => setExptimer(prev => prev - 1), 1000);
    setTimeout(() => {
      setExptimer(-1);
      clearInterval(id2);
    }, 4000);
  }

  if (Object.keys(questions).length === 0) return <div>Loading...</div>;

  return (
    <Grid container spacing={3}>
      {/* User Score */}
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent>
            <Typography variant="h4" color="primary">
              Your Score: {score}
            </Typography>
          </CardContent>
        </Card>
      </Grid>



      {/* Timer */}
      <Grid item xs={12} sm={4} className="flex justify-center">
        <Typography variant="h4">
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </Typography>
      </Grid>

      {/* Question and Options */}
      <Grid item xs={12}>
        <Card className='border-2'>
          <CardContent>
            <Typography variant="h5" className="font-bold text-4xl text-center">{questions.question}</Typography>
          
              <div className='w-[50%] mx-auto'>
                {questions.options.map((option, index) => (
                  <div
                    key={index}
                    ref={el => choiceRefs.current[index] = el}
                    className={`bg-cyan-300 rounded-lg m-4 cursor-pointer hover:bg-blue-500 p-4 w-full mx-auto`}
                    onClick={check}
                  >
                    {String.fromCharCode(97 + index)}) {option}
                  </div>
                ))}
              </div>
            <div className='text-center'>{explanation}</div>
            {exptimer >= 0 && <div className='text-center text-xl mt-2'><span className='w-fit rounded-[50%] px-3 py-1 border bg-sky-200'>{exptimer}</span></div>}
          </CardContent>
        </Card>
      </Grid>

      {/* Other Users' Scores */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h5" className='mx-auto text-center '>Live Leaderboard</Typography>
            {otherScores.map((use, index) => {
              let temp3 = Object.keys(use)
              for (let user of temp3) {
                return (
                  <div key={index} className="flex items-center space-x-4 hover:space-x-8 cursor-pointer my-2 w-[50%] mx-auto">
                    <span className="text-2xl text-primary hover:scale-125">{index + 1}.</span>
                    <div>
                      <img src={use[user].avatar} alt={use[user].username} className="w-10 h-10 rounded-full border-solid border-stone-950 border-t-2 hover:scale-110" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-lg">{use[user].username}</p>
                    </div>
                    <div>
                      <p className="text-2xl text-secondary hover:scale-125">{use[user].score}</p>
                    </div>
                  </div>
                )
              }
            })}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}



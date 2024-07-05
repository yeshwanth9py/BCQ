import React, { useEffect, useState, useRef, useMemo } from 'react';
import axios from 'axios';
import Clock from 'react-clock';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import 'react-clock/dist/Clock.css';
import io from 'socket.io-client';
import { Grid, Card, CardContent, Typography, Avatar } from '@mui/material';

export default function MyClock() {

  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState({});
  const [explanation, setExplanation] = useState("");
  const [exptimer, setExptimer] = useState(-1);
  const [otherScores, setOtherScores] = useState([]); // For other users' scores

  const choiceRefs = useRef([]);



  const params = useParams();
  // const location = useLocation();
  // const { roomno } = location.state || {};
  const roomno = params.id;
  const navigate = useNavigate();

  const socket = useMemo(() => io('http://localhost:5000'), []);

  // console.log(params)


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
      console.log("someone scored:",data);
      // for(let user of data){

      // }


      let temp = []
      for (let user of Object.keys(data)) {
        temp.push({
          user: data[user]
        })
      }

      setOtherScores([...otherScores, ...temp]);
    });

    socket.on("user-disc", (data)=>{
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
    const id = setInterval(decrementTime, 100);
    return () => clearInterval(id);
  }, []);

  async function getmcqs() {
    const allmcqs = await axios.get("http://localhost:3000/app/mcqs/getrandom");
    setQuestions(allmcqs.data);
    setExplanation("");
    resetChoiceColors();
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
      socket.emit("updatescore", { score: newScore, ccuid: localStorage.getItem("ccuid"), roomno });
      return newScore;
    });
  }

  function decrementTime() {
    setSeconds(seconds => {
      if (seconds === 0) {
        setMinutes(minutes => {
          if (minutes === 0) {
            console.log("game ended");
            navigate("/gameover/" + roomno);
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
    let ans = e.target.textContent.slice(3);
    console.log(ans, questions.id);
    const res = await axios.post("http://localhost:3000/app/mcqs/checkans", { id: questions.id, ans });
    console.log(res.data)
    if (res.data.correct) {
      e.target.className = "bg-green-500 rounded-lg m-4 cursor-pointer p-4";
      updatescore();
    } else {
      e.target.className = "bg-red-500 rounded-lg m-4 cursor-pointer p-4";
    }
    setExplanation(res.data.explanation);
    runexptimer();
    setTimeout(() => {
      getmcqs();
    }, 4000);
  };

  function runexptimer() {
    setExptimer(3);
    const id = setInterval(() => setExptimer(prev => prev - 1), 1000);
    setTimeout(() => {
      setExptimer(-1);
      clearInterval(id);
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
        <Card>
          <CardContent>
            <Typography variant="h5" className="font-bold text-4xl text-center">{questions.question}</Typography>
            <div>
              {questions.options.map((option, index) => (
                <div
                  key={index}
                  ref={el => choiceRefs.current[index] = el}
                  className="bg-cyan-300 rounded-lg m-4 cursor-pointer hover:bg-blue-500 p-4"
                  onClick={check}
                >
                  {String.fromCharCode(97 + index)}) {option}
                </div>
              ))}
            </div>
            <Typography variant="body1">{explanation}</Typography>
            {exptimer >= 0 && <Typography variant="h6">{exptimer}</Typography>}
          </CardContent>
        </Card>
      </Grid>

      {/* Other Users' Scores */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h5">Leaderboard</Typography>
            {otherScores.map((use, index) => {
              let temp3 = Object.keys(use)
              for(let user of temp3){
                return (
                    <Grid container alignItems="center" key={index} spacing={2}>
                      <Grid item>
                        <Avatar src={use[user].avatar} alt={use[user].username} />
                      </Grid>
                      <Grid item xs>  
                        <Typography variant="body1">{use[user].username}</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" color="secondary">
                          {use[user].score}
                        </Typography>
                      </Grid>
                    </Grid>
                      )
                    }
                  })}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}



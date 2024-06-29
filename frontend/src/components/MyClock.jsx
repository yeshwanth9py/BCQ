import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';

export default function MyClock() {
  const [value, setValue] = useState(new Date());
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState({});
  const [explanation, setExplanation] = useState("");
  const [exptimer, setExptimer] = useState(-1);

  
  
  const choiceRefs = useRef([]);

  function decrementTime() {
    setSeconds((seconds) => {
      if (seconds === 0) {
        setMinutes((minutes) => {
          if (minutes === 0) {
            console.log("game ended");
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

  async function getmcqs() {
    const allmcqs = await axios.get("http://localhost:3000/app/mcqs/getrandom");
    setQuestions(allmcqs.data);
    setExplanation("");
    resetChoiceColors();
  }

  function resetChoiceColors() {
    choiceRefs.current.forEach(ref => {
      if (ref) {
        console.log(ref.style.backgroundColor);
        ref.className = "bg-cyan-300 rounded-lg m-4 cursor-pointer hover:bg-blue-500 p-4";
      }
    });
  }

  useEffect(() => {
    getmcqs();
  }, []);

  useEffect(() => {
    const id = setInterval(decrementTime, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setValue(new Date()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const check = async (e) => {
    let ans = e.target.textContent.slice(3);
    const res = await axios.post("http://localhost:3000/app/mcqs/checkans", { id: questions.id, ans: ans });
    console.log(e.target.style.backgroundColor);
    if (res.data.correct) {
      e.target.className = "bg-green-500 rounded-lg m-4 cursor-pointer p-4";
      setScore(score + 1);
    } else {
      e.target.className = "bg-red-500 rounded-lg m-4 cursor-pointer p-4";
    }

    setExplanation(res.data.explanation);
    runexptimer()
    setTimeout(() => {
      getmcqs();
    }, 4000);
  };

  function runexptimer() {
    setExptimer(3);
    const id = setInterval(() => {
      setExptimer((prev) => prev - 1);
    }, 1000);
    setTimeout(() => {
      setExptimer(-1);
      clearInterval(id);
    }, 4000);
  }

  if (Object.keys(questions).length === 0) return <div>Loading...</div>;

  return (
    <>
      <div className="flex items-end flex-col mx-10 my-2 relative">
        <Clock value={value} />
      </div>
      <p className='text-3xl text-center'>{minutes}:{seconds}</p>
      <div className='flex justify-center flex-col items-center'>
        {(Object.keys(questions).length > 0) && (
          <>
            <div className='font-bold text-4xl'>{questions.question}</div>
            <div>
              {questions.options.map((option, index) => (
                <div
                  key={index}
                  ref={el => choiceRefs.current[index] = el}
                  className='bg-cyan-300 rounded-lg m-4 cursor-pointer hover:bg-blue-500 p-4'
                  onClick={check}
                >
                  {String.fromCharCode(97 + index)}) {option}
                </div>
              ))}
            </div>
            <p>{explanation}</p>
            {exptimer >= 0 && <p>{exptimer}</p>}
          </>
        )}
      </div>
    </>
  );
}

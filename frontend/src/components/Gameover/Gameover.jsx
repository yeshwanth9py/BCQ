import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import back from '../../assets/exit_12.png';
import { Button } from '@mui/material';
import { FaArrowLeft } from 'react-icons/fa';

const Gameover = () => {
    const params = useParams();
    const [data, setData] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;

    useEffect(() => {
        axios.get(`http://localhost:5000/app/gameover/${params.id}`).then((res) => {
            const temparr = Object.values(res.data);
            temparr.sort((a, b) => b.score - a.score);
            setData(temparr);
        }).catch((err) => {
            console.log('error', err);
        });
    }, [params.id]);

    return (
        <div className='bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 min-h-screen flex flex-col items-center'>
            <div className="text-5xl font-extrabold text-white mt-16 cursor-pointer hover:scale-110">
                Game Over
            </div>
            <div className="w-full max-w-6xl mt-10 bg-white rounded-lg shadow-2xl text-gray-800 overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-200 border-b-2 border-gray-300">
                            {['Rank', 'Username', 'Score', 'Attempted Questions', 'Correct Answers', 'Wrong Answers', 'Time Taken', 'Date'].map(header => (
                                <th key={header} className="px-4 py-2 text-lg font-semibold text-gray-700">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-50'}>
                                <td className="px-4 py-2 text-center">{index + 1}</td>
                                <td className="px-4 py-2 text-center">{item.username}</td>
                                <td className="px-4 py-2 text-center">{item.score}</td>
                                <td className="px-4 py-2 text-center">{item.attempted}</td>
                                <td className="px-4 py-2 text-center">{item.score}</td>
                                <td className="px-4 py-2 text-center">{item.attempted - item.score}</td>
                                <td className="px-4 py-2 text-center">{item.timeTaken}</td>
                                <td className="px-4 py-2 text-center">{new Date(item.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-10 flex space-x-4">
                <div
                    onClick={() => navigate(`/home/room/${params.id}`)}
                    className="text-white font-bold bg-[rgb(52,172,219)] py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
                >
                    Back to Lobby
                </div>
                
                <div
                    onClick={() => navigate(`/home`)}
                    className="text-white font-bold bg-[rgb(55,65,81)] py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
                >
                    Back to Home
                </div>
            </div>
            <FaArrowLeft className='fixed top-[50%] left-1 text-xl cursor-pointer bg-white rounded-full w-28 h-16 hover:scale-105' onClick={()=>{navigate("/")}}/>
            <div className='w-full max-w-6xl bg-gray-800 text-white mt-8 rounded-lg shadow-lg cursor-pointer'>
                <div className='p-4'>
                    {state.prevdata && Object.keys(state.prevdata).map((key, ind) => (
                        <div key={key} className='my-4 p-4 bg-gray-700 rounded-lg'>
                            <p className='font-bold text-xl mb-2'>{ind + 1}. {state.prevdata[key].question}</p>
                            {state.prevdata[key].options.map((opt, optInd) => (
                                <p key={optInd} className={`rounded p-2 my-1 ${state.prevdata[key].user_ans === opt ? (state.prevdata[key].correct ? 'bg-green-600' : 'bg-red-600') : 'bg-cyan-500'} text-white`}>
                                    {optInd + 1}. {opt}
                                </p>
                            ))}
                            <p className='mt-2'>Your choice: <span className={`${state.prevdata[key].correct ? 'text-green-400' : 'text-red-400'} font-bold`}>{state.prevdata[key].user_ans} ({state.prevdata[key].correct ? 'Correct' : 'Wrong'})</span></p>
                            <p className='mt-2'>Explanation: {state.prevdata[key].explanation}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Gameover;

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import back from '../../assets/exit_12.png';

const Gameover = () => {
    const params = useParams();
    const [data, setData] = useState([]);
    const navigate = useNavigate();

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
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 text-white">
            <div className="text-5xl font-bold mt-16">Game Over</div>
            <table className="w-11/12 mt-10 bg-white rounded-lg shadow-lg text-gray-800">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2 text-xl">Rank</th>
                        <th className="px-4 py-2 text-xl">Username</th>
                        <th className="px-4 py-2 text-xl">Score</th>
                        <th className="px-4 py-2 text-xl">Attempted Questions</th>
                        <th className="px-4 py-2 text-xl">Correct Answers</th>
                        <th className="px-4 py-2 text-xl">Wrong Answers</th>
                        <th className="px-4 py-2 text-xl">Time Taken</th>
                        <th className="px-4 py-2 text-xl">Date</th>
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
            <div className="mt-10 flex space-x-4">
                <button 
                    onClick={() => navigate(`/home/room/${params.id}`)} 
                    className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                >
                    Back to Lobby
                </button>
                <button 
                    onClick={() => navigate(`/home`)} 
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default Gameover;

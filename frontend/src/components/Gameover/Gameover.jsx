import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router-dom'
import back from "../../assets/exit_12.png";

const Gameover = () => {
    const params = useParams();
    const [data, setData] = useState();
    const navigate = useNavigate();
    
    
    useEffect(()=>{
        axios.get("http://localhost:5000/app/gameover/"+params.id).then((res)=>{
            // setData(res);
            const temparr = Object.values(res.data);
            temparr.sort((a, b)=>{
              return b.score-a.score;
            });
            setData(temparr);
            console.log(temparr);
        }).catch((err)=>{
            console.log("error", err);
        });
    }, [])

  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <div className='text-3xl text-center -mt-28'>Gameover</div>
      <table className='text-center mx-auto mt-10'>
        <tr>
          <th className='px-4 py-2 text-xl'>Rank</th>
          <th className='px-4 py-2 text-xl'>Username</th>
          <th className='px-4 py-2 text-xl'>Score</th>
          <th className='px-4 py-2 text-xl'>Attempted questions</th>
          <th className='px-4 py-2 text-xl'>No of right's</th>
          <th className='px-4 py-2 text-xl'>No of wrong's</th>
        </tr>
        {data && data.map((item, index) => (
          <tr key={index}>
            <td className='px-4 py-2'>{index + 1}</td>
            <td className='px-4 py-2'>{item.username}</td>
            <td className='px-4 py-2'>{item.score}</td>
            <td className='px-4 py-2'>{0}</td>
            <td className='px-4 py-2'>{0}</td>
            <td className='px-4 py-2'>{0}</td>
          </tr>
        ))}
      </table>
      <img src={back} className='mx-auto mt-10 cursor-pointer transition-scale-125 hover:scale-125' width="50px" height="50px" onClick={() => navigate(`/home/room/${params.id}`)}/>
      
    </div>
  )

}

export default Gameover
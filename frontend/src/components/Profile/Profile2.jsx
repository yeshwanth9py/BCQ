import axios from 'axios';
import React, { useEffect, useState } from 'react'


const Profile2 = ()=>{
    const [user, setUser] = useState({});
    // const fetchUser = async () => {
    //     const response = await axios.get('http://localhost:3000/app/user', { withCredentials: true });
    //     const data = await response.data;
    //     setUser(data);
    //     console.log("data",data);
    // }
    // useEffect(() => {
    //     // fetchUser()
    // },[]);



    return (
        <>
            <div>
                <div className='flex flex-col w-fit border-black px-8'>
                    <div className='border-2 border-neutral-700 w-fit'>
                        <img src="" width="200" height="200" />
                        <h1>username</h1>
                        <div className='flex justify-between'>
                            <p>Rank: Guardian</p> 
                            <p className='px-2'>10 likes</p> 
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <p>10 followers</p>
                        <p>10 following</p>
                    </div>
                    <p>bio...</p>
                </div>

                <h1 className='text-center text-4xl'>Previous Game Stats</h1>
                <br/>
                <div className='py-4 text-justify flex justify-evenly'>
                    <h1>Win/Loss ratio: </h1>
                    <h1>Total Games Played: </h1>
                    <h1>Total Games Lost: </h1>
                </div>
                <br/>
                <table className='mx-auto'>
                    <tr>
                        <th className='px-4'>Game Id</th>
                        <th className='px-4'>Room name</th>
                        <th className='px-4'>Total participants</th>
                        <th className='px-4'>Winner</th>
                        <th className='px-4'>Winner Score</th>
                        <th className='px-4'>User Score</th>
                    </tr>
                    <tr>
                        <td className='text-center'>1</td>
                        <td className='text-center'>Game 1</td>
                        <td className='text-center'>10</td>
                        <td className='text-center'>User 1</td>
                        <td className='text-center'>10</td>
                        <td className='text-center'>10</td>
                    </tr>
                </table>
            </div>
        </>
    )
}


export default Profile2
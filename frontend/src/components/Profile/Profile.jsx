import axios from 'axios';
import React, { useEffect, useState } from 'react'

const Profile = () => {
    const [user, setUser] = useState({});
    const fetchUser = async () => {
        const response = await axios.get('http://localhost:3000/app/user', { withCredentials: true });
        const data = await response.data;
        setUser(data);
        console.log("data",data);
    }
    useEffect(() => {
        fetchUser()
    },[]);

    return (
        <div className="profile-section">
            <div className="profile-header">
                <img src={user.profilePic} alt={`${user.username}'s profile`} className="profile-pic" />
                <h2>{user.username}</h2>
                <p>{user.bio}</p>
            </div>
            <div className="profile-stats">
                <div className="stat-item">
                    <h3>Followers</h3>
                    <p>{user.followers}</p>
                </div>
                <div className="stat-item">
                    <h3>Following</h3>
                    <p>{user.following}</p>
                </div>
                <div className="stat-item">
                    <h3>Likes</h3>
                    <p>{user.likes}</p>
                </div>
                <div className="stat-item">
                    <h3>Rank</h3>
                    <p>{user.rank}</p>
                </div>
            </div>
            <div className="previous-games">
                <h3>Previous Games Played</h3>
                <ul>
                    {/* {user.previousGames.map((game, index) => (
                        <li key={index}>{game}</li>
                    ))} */}
                </ul>
            </div>
            <div className="chats">
                <h3>Chats</h3>
                <ul>
                    {/* {user.chats.map((chat, index) => (
                        <li key={index}>{chat}</li>
                    ))} */}
                </ul>
            </div>
            <div className="achievements">
                <h3>Achievements</h3>
                {/* <ul>
                    {user.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                    ))}
                </ul> */}
            </div>
            <div className="settings">
                <h3>Settings</h3>
                <button>Account Settings</button>
                <button>Privacy Settings</button>
            </div>
        </div>
    );
}

export default Profile
import { useState } from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import './App.css'
import Home from './components/Home.jsx'
import Login from './components/Login'
import Signup from './components/Signup'
import ErrorComponent from './components/ErrorComponent'
import Gamepage from './components/Gamepage'
import GameRoom from './components/GameRoom'
import Profile2 from './components/Profile/Profile2.jsx'
import Gameover from './components/Gameover/Gameover.jsx'
import Codepage from './components/Codepage.jsx'
import AdminControls from './components/AdminControls/AdminControls.jsx'
import LeaderBoard from './components/Leaderboard.jsx'
import Forgotpassword from './components/Forgotpassword.jsx'


function App() {
  
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<Forgotpassword/>}/>
        <Route path="/home/room/:id" element={<GameRoom/>}/>
        <Route path="/home/profile/:id" element = {<Profile2/>}/>
        <Route path="/game/:id" element={<Gamepage />} />
        <Route path="/gameover/:id" element={<Gameover />} />
        <Route path="/codecombat/:id" element={<Codepage />} />
        <Route path="/admincontrols" element= {<AdminControls />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
        <Route path="*" element={<ErrorComponent />} />
      </Routes>
    </BrowserRouter>
    
  )
}

export default App

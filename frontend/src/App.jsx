import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import ErrorComponent from './components/ErrorComponent'
import Gamepage from './components/Gamepage'
import GameRoom from './components/GameRoom'

function App() {
  

  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="home/room/:id" element={<GameRoom/>}/>
        <Route path="/game/:id" element={<Gamepage />} />
        <Route path="*" element={<ErrorComponent />} />
      </Routes>
    </BrowserRouter>
    
  )
}

export default App

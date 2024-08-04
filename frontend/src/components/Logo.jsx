import React, { useEffect } from 'react'
import { useState } from 'react';

const Logo = () => {

    const [isClicked, setIsClicked] = useState(false);

    useEffect(()=>{
        setTimeout(()=>{
            setIsClicked(true)
        }, 2000)
    },[])
    
  return (
    <div>
        <div
            className="text-3xl font-semibold cursor-pointer relative"
            onClick={() => setIsClicked(true)}
            onAnimationEnd={() => setIsClicked(false)}
          >
            <span className={`text-red-500 inline-block transition-transform ${isClicked ? 'animate-touch-c-left' : ''}`}>C</span>
            <span className={`transition-opacity ${isClicked ? 'animate-fade' : 'opacity-100'}`}>ode</span>
            <span className={`text-red-500 inline-block transition-transform ${isClicked ? 'animate-touch-c-right' : ''}`}>C</span>
            <span className={`transition-opacity ${isClicked ? 'animate-fade' : 'opacity-100'}`}>ombat</span>
          </div>
    </div>
  )
}

export default Logo
import React from 'react'
import pp from "../../assets/dummy_pp.jpeg";

const Usercomponent = ({ud, no}) => {
  return (
    <div className='w-40 m-5'>
      <div className='flex flex-col'>
        <p className="text-gray-200 text-3xl">P{no}</p>
        <img src={pp} className='rounded-full w-40'/>
        <p className='text-center text-gray-300 text-2xl relative right-1'>{ud.username}</p>
      </div>
    </div>
  )
}

export default Usercomponent
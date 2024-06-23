import React from 'react'
import SearchAppBar from './Searchbar'
import MultiActionAreaCard from './CardRoom'
import Sidebar from './Sidebar'



const Home = () => {
  return (
    <div className='flex'>
      <div> 
        <Sidebar/>
      </div>

      
      <div className='w-full'>
        <div>

          <SearchAppBar />
          <div className='m-10'>
            <h1>Join A Room</h1>
            <MultiActionAreaCard />
          </div>

        </div>
      </div>
    </div>
  )
}

export default Home
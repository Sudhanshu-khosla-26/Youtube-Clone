import React from 'react'
import RightSide from './RightSide'
import LeftSide from "./LeftSide"
import Playlist from "./PlaylistSTRC"
import { useParams } from "react-router-dom"
import Search from "./Search"
import { setBoolean } from '../features/Sidebar'
import { useDispatch, useSelector } from "react-redux"

const HomePage = (props) => {
  const { query } = useParams();
  const { listquery } = useParams();
  console.log(listquery); 
  const dispatch = useDispatch();
  console.log("render hompage");
  const Minimize = useSelector((state) => state.MinimizeState);

  const handleToggle = () => {
    dispatch(setBoolean(false));
  };

  return (
    <>
      {/* Converting the Container styled component to a div with Tailwind classes */}
      <div className="flex gap-3.5 h-auto">
        {/* Converting the .sidebar styled class to Tailwind */}
        <div 
          className={`
            sidebar
            ${Minimize ? 'left-0' : '-left-[100vw]'}
            md:block
            md:relative
            md:left-0
            max-md:min-w-[100vw]
            max-md:h-screen
            max-md:bg-black/60
            max-md:z-[99999]
            max-md:fixed
            max-md:top-0
            max-md:transition-all
            max-md:duration-250
            max-md:ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
          `}
          onClick={handleToggle}
        >
          <LeftSide />
        </div>
          
        {/* Converting the .rightside styled class to Tailwind */}
        <div className="rightside max-md:w-[100vw] max-md:h-screen">
          {query ? (
            <Search />
          ) : listquery ? (
            <Playlist />
          ) : (
            <RightSide />
          )}
        </div>
      </div>
    </>
  )
}

export default HomePage

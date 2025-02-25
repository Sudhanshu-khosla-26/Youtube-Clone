import styled from "styled-components";
import React from 'react'
import RightSide from './RightSide'
import LeftSide from "./LeftSide";
// import MoodBox from "./MoodBox";
import Playlist from "./PlaylistSTRC";
import { useParams } from "react-router-dom";
import Search from "./Search";
// import SplashCursor from './SplashCursor'

import { useSelector } from "react-redux";



const HomePage = (props) => {
  const { query } = useParams();
  const { listquery } = useParams();
  console.log(listquery); 
  console.log("render hompage");
  const Minimize = useSelector((state) => state.MinimizeState);

  return (
    <>
      <Container>
        <div className="sidebar" Minimize={Minimize}>
          <LeftSide className="" />
        </div>
          
        <div className="rightside">
          {/* <ParticlesBackground /> */}
          {query ?
            <Search />
            :
            listquery ?
              <Playlist />
              :
              <RightSide />
          }
        </div>
      </Container>

      {/* <ParticlesBackground /> */}

      {/* <MoodBox /> */}
    </>
  )
}

// const ParticlesBackground = styled(Particles)`
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   z-index: -1;
// `

const Container = styled.div`
  display: flex;
  gap: 14px;
  height: unset;

  @media only screen and (max-width: 768px){
    .sidebar{
            z-index: 9999;
            position: fixed;
            top: 0px !important;
            left: -300px !important;
            transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;   

          ${props => props.Minimize && `
            top: 0px;
            left: 0px !important;
    `}
    }

    .rightside{
      width: 100vw;
      height: 100vh;
    }
    }

   @media (min-width: 768px) and (max-width: 1024px){
    .sidebar{
      // display: none; 
    } 
    }
`;


export default HomePage

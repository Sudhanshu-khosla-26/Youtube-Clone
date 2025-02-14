import styled from "styled-components";
import React from 'react'
import RightSide from './RightSide'
import LeftSide from "./LeftSide";
// import MoodBox from "./MoodBox";
import Playlist from "./PlaylistSTRC";
import { useParams } from "react-router-dom";
import Search from "./Search";
import SplashCursor from './SplashCursor'
import Particles from './Particles';
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
          <LeftSide  />
        </div>
          
        <div className="rightside">

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
      {/* <MoodBox /> */}
    </>
  )
}

const Container = styled.div`
  display: flex;
  gap: 14px;
  height: unset;

  @media only screen and (max-width: 768px){
    .sidebar{
      display: none;
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

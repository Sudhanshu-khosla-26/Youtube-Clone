import styled from "styled-components";
import React from 'react'
import RightSide from './RightSide'
import LeftSide from "./LeftSide";
// import MoodBox from "./MoodBox";
import Playlist from "./Playlist";
import { useParams } from "react-router-dom";
import Search from "./Search";

const HomePage = (props) => {
  const { query }
    = useParams();
  const { listquery } = useParams();
  return (
    <>
      <Container>
        <LeftSide />
        <div className="rightside">
          {query ?
            <Search />
            :
            listquery ?
              <Playlist /> :
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
/* 
  .rightside{
    top: 0;
    position: absolute;
    left: 230px;
  } */

  /* ${props => props.Minimize && `
    .rightside{
      left: 72px !important;
    }
  `} */

`;

export default HomePage

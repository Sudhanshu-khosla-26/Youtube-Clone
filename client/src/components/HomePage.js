import styled from "styled-components";
import React from 'react'
import RightSide from './RightSide'
import LeftSide from "./LeftSide";

const HomePage = (props) => {
  return (
    <Container>
      <LeftSide/>
      <div className="rightside">
        <RightSide/>
      </div>
    </Container>
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

import styled from 'styled-components';
import React, { useEffect }  from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useState } from 'react';

const RightSide = (props) => {
  const [AllVideos, setAllVideos] = useState([]);
  const Minimize = useSelector((state) => state.MinimizeState);

  const User = JSON.parse(localStorage.getItem('USER'));


  useEffect(() => {
    const AccessToken = (JSON.parse(localStorage.getItem('USER')))?.accessToken;
    console.log(AccessToken);
    const headers = {
      'Authorization':AccessToken,
      'Accept': 'application/json'
    };
    axios.get("http://localhost:8000/api/v1/videos/", {headers})
    .then((videodata)=>{
      setAllVideos(videodata.data.data)
      console.log(videodata);
    })
    .catch((err)=>{
      console.log(err);
    })
  }, [])
  

    // useEffect(() => {
  //   const AccessToken = (JSON.parse(localStorage.getItem('USER')))?.accessToken;
  //   console.log(AccessToken);
  //   const headers = {
  //     'Authorization':AccessToken,
  //     'Accept': 'application/json'
  //   };
  //   axios.get("http://localhost:8000/api/v1/dashboard/videos", {headers})
  //   .then((videodata)=>{
  //     setAllVideos(videodata.data.data)
  //     // console.log(videodata);
  //   })
  //   .catch((err)=>{
  //     console.log(err);
  //   })
  // }, [])
  
  
  return (
      <Container Minimize={Minimize}>
      {User ? 
      <>
      <div className="tags">
        <button className='active'>
          All
        </button>
        <button>
          Music
        </button>
        <button>
          Disha Vakani
        </button>
        <button>
          Mixes
        </button>
        <button>
          Indian pop music
        </button>
        <button>
        Sketch comedy 
        </button>
        <button>
         Roasts
        </button>
        <button>
          Gaming
        </button>
        <button>
         Podcasts
        </button>
        <button>
         T-Series
        </button>
        <button>
          Live
        </button>
        <button>
          Movie musicals
        </button>
        <button>
          Telenovelas
        </button>
        <button>
          Thrillers
        </button>
        <button>
          Cars
        </button>
        <button>
          Presentations
        </button>
        <button>
          Motorcycles
        </button>
        <button>
          Action-adventure games
          </button>
            <button>
            Recently uploaded
            </button>
              <button>
                Watched
              </button>
              <button>
                New to you
              </button>
      </div>
      
      <ul>
        {AllVideos.length > 0 && AllVideos.map((Data) => (
        <a href={`/watch/${Data._id}`}>
        <li>
          <img src={Data.thumbnail} alt="" />
          <div className="videoInfo">
            <img src={Data.details.avatar} alt="" />
            <div className="Info">
            <div className="title">
              <span>{Data.title.length > 74 ? Data.title.slice(0, 72) + "..." : Data.title}</span>
              <img src="/images/tripledot.svg" alt="" />
            </div>
            <div className="channelname">
              <span>
                {Data.details.username}
                <img src="/images/tick.svg" alt="" />
              </span>
            </div>
            <span className='viewAndTime'> 
              7.5M views • 22 hours ago  
            </span>
          </div>
            </div>
        </li>
        </a>
        ))}

      </ul>
      </>

: 

    <>
        <div className="MessageBox">
            <h2>Try searching to get started</h2>
            <h4>Start watching videos to help us build a feed of videos you'll love.</h4>
        </div>    
    </>

}
</Container>
  )
}

const Container = styled.div`
  margin-top: 56px;
  display: flex;
  /* max-width: 92vw; */
  width: 81vw;
  height: 91vh;
  top: 0;
  /* left: 73px; */
  left: 230px;
  overflow-y: scroll;
  /* background-color: blueviolet; */
  position: absolute;

  .tags{
    margin-top: 4px;
     display: flex;
     scroll-behavior: smooth;
     overflow-x: scroll;
      margin-left: 24px;
      white-space: nowrap;
    
    & > button{
      width: max-content;
      cursor: pointer;
      text-align: center;
      padding: 0 12px;
      line-height: 20px;
      font-size: 14px;
      background-color: #272727;
      font-weight: 500;
      font-family: "Gill Sans Extrabold", sans-serif;
      border: none;
      height: 32px;
      border-radius: 8px;
      margin: 12px 12px 12px 0;
      &:hover{
        background-color: #3F3F3F;
      }

    }
  }

  .active{
        background-color: #F1F1F1 !important;
        color: rgb(15,15,15);
        &:hover{
          background-color: #FFFFFF !important;
        }
      }

  ul{
    display: flex;
    position: absolute;
    flex-wrap: wrap;
    top: 90px;
    left: 17px;
    /* left: 30px; */
    a{
      text-decoration: none;
      margin: 0 7.3px 40px 7.3px !important;
      li{
        list-style : none ;

        img{
          width: 343px;
          height: 193px;
          border-radius: 8px;
        }

        .videoInfo{
          display: flex;
          margin-top: 6px;
          img{
            margin-top: 4px;
            border-radius: 50%;
            width: 36px;
            height: 36px;
          }
          .Info{
            width: 100%;
            margin-left: 14px;
            max-width: 298px;
            /* display: flex;
            align-items: start;
            justify-content: center;
            flex-direction: column; */
            .title{
              display: flex;
              align-items: center;
              justify-content: space-between;
              span{
                cursor: pointer;
                line-height: 22px;
                font-weight: 500;
                font-size: 16px;
              }

              img{
                width: 24px;
                cursor: pointer;
                height: 24px;
                margin-left: 2px;
                filter: invert(1);
              }
            }

            .channelname{
              display: flex;
              align-items: center;
              span{
                display: flex;
                align-items: center;
                font-weight: 400;
                color: #949494;
                cursor: pointer;
                font-size: 14px;
                line-height: 20px;
              
              img{
                width: 14px;
                margin-left: 4px;
                height: 14px;
                filter: invert(0.6);
              }
            }
              &:hover{
                span{
                  color: white;
                }
              }
            }

            .viewAndTime{
                color: #949494;
                cursor: pointer;
                font-weight: 400;
                font-size: 14px;
                line-height: 20px;
            }

          }
        }
      }
    }
  }

  .MessageBox{
    display: flex;
    border-radius: 18px;
    margin: 20px auto;
    width: 440px;
    background-color: #272727;
    height: 100px;
    padding: 0 30px;
    flex-direction: column;
    /* justify-content: center; */
    align-items: center;
    
    h2{
        width: 440px;
        font-family: "Roboto", "Arial", sans-serif;
        font-size: 20px;
        text-align: center;
    line-height: 22px ;
    margin: 26px 0 12px 0 !important;
    font-weight: 900;
    }
    
    h4{
        width: 440px;
        font-family: "Roboto", "Arial", sans-serif;
         font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    text-align: center;
    color: darkgray;

    }
}


  ${props => props.Minimize===false && `
      left: 72px !important;
      width: 92vw !important;
      ul > a{
            margin: 0 7px 40px 7px !important;
      }
      ul> a > li > img {
              width: 398.984px !important;
              height: 224.422px !important;
      }
      ul > a > li >.videoInfo >.Info{
              max-width: 348px !important;
      }
  `}

`;

export default RightSide

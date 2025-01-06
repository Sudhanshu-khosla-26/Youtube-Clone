import styled from 'styled-components';
import React, { useEffect } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import moment from 'moment';

const RightSide = (props) => {
  const [AllVideos, setAllVideos] = useState([]);
  const [YTAPIVIDEOS, setYTAPIVIDEOS] = useState([]);
  const Minimize = useSelector((state) => state.MinimizeState);
  const [channelImages, setChannelImages] = useState({});

  const User = JSON.parse(localStorage.getItem('USER'));


  useEffect(() => {
    const AccessToken = (JSON.parse(localStorage.getItem('USER')))?.accessToken;
    console.log(AccessToken);
    const headers = {
      'Authorization': AccessToken,
      'Accept': 'application/json'
    };
    axios.get("http://localhost:8000/api/v1/videos/", { headers })
      .then((videodata) => {
        setAllVideos(videodata.data.data)
        // console.log(videodata);
      })
      .catch((err) => {
        // console.log(err);
      })

    axios.get("https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=300&regionCode=IN&key=AIzaSyDpicnbroQi7p8Sp0zbeQv91n-elyXVeD8")
      .then((videos) => {
        setYTAPIVIDEOS(videos.data.items)
        // console.log(videos.data.items);
      })
      .catch((err) => {
        console.log(err);
      })

  }, [])


  const getYTchannelInfo = async (channelId) => {
    try {
      const response = await axios.get(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channelId}&key=AIzaSyDpicnbroQi7p8Sp0zbeQv91n-elyXVeD8`);
      const url = response?.data?.items[0]?.snippet?.thumbnails?.high?.url;
      console.log(url);
      return url;
    } catch (error) {
      console.error('Error fetching channel info:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchChannelImages = async () => {
      const images = {};
      for (const data of YTAPIVIDEOS) {
        if (data?.snippet?.channelId) {
          try {
            const url = await getYTchannelInfo(data.snippet.channelId);
            images[data.snippet.channelId] = url;
          } catch (error) {
            console.error('Error fetching channel image:', error);
          }
        }
      }
      setChannelImages(images);
      // console.log(channelImages);
    };

    if (YTAPIVIDEOS.length > 0) {
      fetchChannelImages();
    }

  }, [YTAPIVIDEOS]);

  const formatViewCount = (count) => {
    if (count < 1000) return count;
    if (count <= 1000000) return (count / 1000).toFixed(1) + ' K';
    if (count <= 1000000000) return (count / 1000000).toFixed(1) + ' M';
    return (count / 1000000000).toFixed(1) + ' B';
  };

  const timeAgo = (date) => {
    const now = moment();
    const inputDate = moment(date);
    const diffInSeconds = now.diff(inputDate, 'seconds');

    if (diffInSeconds < 60) {
      return 'now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(diffInSeconds / 31536000);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  };

  const videoViewUpdate = (VideoId) => {
    const AccessToken = (JSON.parse(localStorage.getItem('USER'))).accessToken;
    const headers = {
      'Authorization': AccessToken,
      'Accept': 'application/json'
    };
    console.log(VideoId);
    axios.patch(`http://localhost:8000/api/v1/videos/view/${VideoId}`, {}, { headers })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }

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
              <a href={`/watch/${Data._id}`} key={Data._id}
                onClick={() => { videoViewUpdate(Data._id) }}
              >
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
                        {formatViewCount(Data.views)} views • {timeAgo(Data.createdAt)}
                      </span>
                    </div>
                  </div>
                </li>
              </a>
            ))}


            {YTAPIVIDEOS.length > 0 && YTAPIVIDEOS.map((Data, index) => (
              <a href={`/watch/${Data.id}`} key={index}>
                <li className=' '>
                  <img src={Data?.snippet?.thumbnails?.maxres?.url || Data?.snippet?.thumbnails?.standard?.url} alt="" />
                  <div className="videoInfo">
                    <img src={channelImages[Data.snippet.channelId]} alt="Channel" />
                    <div className="Info">
                      <div className="title">
                        <span>{Data.snippet.title.length > 74 ? Data.snippet.title.slice(0, 72) + "..." : Data.snippet.title}</span>
                        <img src="/images/tripledot.svg" alt="" />
                      </div>
                      <div className="channelname">
                        <span>
                          {Data?.snippet?.channelTitle}
                          <img src="/images/tick.svg" alt="" />
                        </span>
                      </div>
                      <span className='viewAndTime'>
                        {formatViewCount(Data?.statistics?.viewCount)} views • {timeAgo(Data?.snippet?.publishedAt)}                      </span>
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
    </Container >
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
                font-weight: 400;
                cursor: pointer;
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


  ${props => props.Minimize === false && `
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

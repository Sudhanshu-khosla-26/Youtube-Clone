import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useSelector } from 'react-redux';
import moment from 'moment';

const RightSide = () => {
  const [allVideos, setAllVideos] = useState([]);
  const [ytApiVideos, setYtApiVideos] = useState([]);
  const [categoryId, setCategoryId] = useState(0);
  const [tagList, setTagList] = useState([]);
  const [activetag, setactivetag] = useState("All");
  const [channelImages, setChannelImages] = useState({});
  const [isOpen, setIsOpen] = useState(true);
  const minimize = useSelector((state) => state.MinimizeState);
  const user = JSON.parse(localStorage.getItem('USER'));

  useEffect(() => {
    fetchAllVideos();
    fetchTagList();
  }, []);

  useEffect(() => {
    if (categoryId === 0) {
      fetchAllVideos();
    }
    fetchCategoryVideos(categoryId);
  }, [categoryId]);

  useEffect(() => {
    if (ytApiVideos.length > 0) {
      fetchChannelImages();
    }
  }, [ytApiVideos]);

  const fetchAllVideos = async () => {
    try {
      const accessToken = user?.accessToken;
      const headers = {
        'Authorization': accessToken,
        'Accept': 'application/json'
      };
      const response = await axios.get("http://localhost:8000/api/v1/videos/", { headers });
      setAllVideos(response.data.data);
    } catch (error) {
      console.error('Error fetching all videos:', error);
    }
  };

  const fetchCategoryVideos = async (categoryId) => {
    try {
      const response = await axios.get(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=20000&regionCode=IN&videoCategoryId=${categoryId}&key=AIzaSyDlhskfkjE7kLtNtHFCWJf2mpaTOV6Wbno`);
      setYtApiVideos(response.data.items);
    } catch (error) {
      console.error('Error fetching category videos:', error);
    }
  };

  const fetchTagList = async () => {
    try {
      const response = await axios.get(`https://youtube.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=IN&key=AIzaSyDlhskfkjE7kLtNtHFCWJf2mpaTOV6Wbno`);
      setTagList(response.data.items);
    } catch (error) {
      console.error('Error fetching tag list:', error);
    }
  };

  const getYTchannelInfo = async (channelId) => {
    try {
      const response = await axios.get(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channelId}&key=AIzaSyDlhskfkjE7kLtNtHFCWJf2mpaTOV6Wbno`);
      return response?.data?.items[0]?.snippet?.thumbnails?.high?.url;
    } catch (error) {
      console.error('Error fetching channel info:', error);
      return null;
    }
  };

  const fetchChannelImages = async () => {
    const images = {};
    for (const data of ytApiVideos) {
      if (data?.snippet?.channelId) {
        const url = await getYTchannelInfo(data.snippet.channelId);
        if (url) {
          images[data.snippet.channelId] = url;
        }
      }
    }
    setChannelImages(images);
  };

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

    if (diffInSeconds < 60) return 'now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minute${Math.floor(diffInSeconds / 60) > 1 ? 's' : ''} ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour${Math.floor(diffInSeconds / 3600) > 1 ? 's' : ''} ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''} ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} month${Math.floor(diffInSeconds / 2592000) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInSeconds / 31536000)} year${Math.floor(diffInSeconds / 31536000) > 1 ? 's' : ''} ago`;
  };

  const videoViewUpdate = async (videoId) => {
    try {
      const accessToken = user?.accessToken;
      const headers = {
        'Authorization': accessToken,
        'Accept': 'application/json'
      };
      await axios.patch(`http://localhost:8000/api/v1/videos/view/${videoId}`, {}, { headers });
    } catch (error) {
      console.error('Error updating video view:', error);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setactivetag("All");
  };

  const fetchMoodResult = async (mood) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/ai/get-result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: mood })
      });
      const result = await response.json();
      localStorage.setItem('mood', mood);
      console.log(result);
      const resultArray = (result);
      setYtApiVideos(resultArray);
    } catch (error) {
      console.error('Error fetching mood result:', error);
    }
  };

  const logMood = (mood) => {
    setYtApiVideos([]);
    setAllVideos([]);
    setactivetag("AI");
    setIsOpen(false);
    console.log(mood);
    fetchMoodResult(mood);
  };

  console.log(isOpen, "modalbox");

  return (
    <Container minimize={minimize}>
      {user ? (
        <>
          <div className="tags">
            <button className={`${"AI" === activetag ? "bg-white text-black hover:bg-[FFFFFFF]" : "text-white bg-[#272727] hover:bg-[#3F3F3F]"}`} onClick={() => { setactivetag("AI"); setCategoryId(0); setIsOpen(true) }}>AI✦</button>
            <button className={`${"All" === activetag ? "bg-white text-black hover:bg-[FFFFFFF]" : "text-white bg-[#272727] hover:bg-[#3F3F3F]"}`} onClick={() => { setactivetag("All"); setCategoryId(0) }}>All</button>
            {tagList.map((tag) => (
              <button className={`${tag.snippet.title === activetag ? "bg-white text-black" : "text-white bg-[#272727] hover:bg-[#3F3F3F]"}`} key={tag.id} onClick={() => { setactivetag(tag.snippet.title); setCategoryId(tag.id); setAllVideos([]); }} >
                {tag.snippet.title}
              </button>
            ))}
            <button>New to you</button>
          </div>

          <ul>
            {allVideos.map((data) => (
              <a href={`/watch/${data._id}`} key={data._id} onClick={() => videoViewUpdate(data._id)}>
                <li>
                  <img className='object-cover' src={data.thumbnail} alt="" />
                  <div className="videoInfo">
                    <img src={data.details.avatar} alt="" />
                    <div className="Info">
                      <div className="title">
                        <span>{data.title.length > 74 ? `${data.title.slice(0, 72)}...` : data.title}</span>
                        <img src="/images/tripledot.svg" alt="" />
                      </div>
                      <div className="channelname">
                        <span>
                          {data.details.username}
                          <img src="/images/tick.svg" alt="" />
                        </span>
                      </div>
                      <span className='viewAndTime'>
                        {formatViewCount(data.views)} views • {timeAgo(data.createdAt)}
                      </span>
                    </div>
                  </div>
                </li>
              </a>
            ))}


            {Array.isArray(ytApiVideos) ?
              ytApiVideos.length > 0 && ytApiVideos.map((data) => (
                <a href={`/watch/${data.id}`} key={data.id}>
                  <li>
                    <img className='object-cover' src={data?.snippet?.thumbnails?.maxres?.url || data?.snippet?.thumbnails?.standard?.url || data?.snippet?.thumbnails?.high?.url} alt="" />
                    <div className="videoInfo">
                      <img src={channelImages[data?.snippet?.channelId]} alt="Channel" />
                      <div className="Info">
                        <div className="title">
                          <span>{data?.snippet?.title.length > 74 ? `${data?.snippet?.title.slice(0, 72)}...` : data?.snippet?.title}</span>
                          <img src="/images/tripledot.svg" alt="" />
                        </div>
                        <div className="channelname">
                          <span>
                            {data?.snippet?.channelTitle}
                            <img src="/images/tick.svg" alt="" />
                          </span>
                        </div>
                        <span className='viewAndTime'>
                          {formatViewCount(data?.statistics?.viewCount)} views • {timeAgo(data?.snippet?.publishedAt)}
                        </span>
                      </div>
                    </div>
                  </li>
                </a>
              ))
              :
              Object.entries(ytApiVideos).map(([category, videos]) => (
                <div className='flex flex-col' key={category}>
                  <h1 className="text-white ml-2">{category}</h1>
                  {videos.length > 0 && videos.map((data) => (
                    <a href={`/watch/${data?.id?.videoId}`} key={data?.id?.videoId} className="no-underline mx-[7.3px] my-[40px] transition-transform duration-300 hover:scale-105">
                      <li className={`list-none ${minimize === true ? "w-[250px]" : "w-[290px]"}`}>
                        <img className="object-cover w-full h-[193px] rounded-lg " src={data?.snippet?.thumbnails?.maxres?.url || data?.snippet?.thumbnails?.standard?.url || data?.snippet?.thumbnails?.high?.url} alt="" />
                        <div className="videoInfo flex mt-1.5">
                          <img className="rounded-full w-9 h-9 mt-1" src={channelImages[data?.snippet?.channelId]} alt="Channel" />
                          <div className="Info ml-3.5 max-w-[298px] w-full">
                            <div className="title flex justify-between items-center">
                              <span className="cursor-pointer leading-[22px] font-medium text-lg">{data?.snippet?.title.length > 56 ? `${data?.snippet?.title.slice(0, 56)}...` : data?.snippet?.title}</span>
                              <img className="w-6 h-6 ml-0.5 cursor-pointer invert" src="/images/tripledot.svg" alt="" />
                            </div>
                            <div className="channelname flex items-center mt-1">
                              <span className="flex items-center font-normal text-[#949494] cursor-pointer text-sm leading-[20px]">
                                {data?.snippet?.channelTitle}
                                <img className="w-3.5 h-3.5 ml-1 invert-[0.6]" src="/images/tick.svg" alt="" />
                              </span>
                            </div>
                            <span className="viewAndTime text-[#949494] font-normal cursor-pointer text-sm leading-[20px]">
                              {timeAgo(data?.snippet?.publishedAt)}
                            </span>
                          </div>
                        </div>
                      </li>
                    </a>
                  ))}
                </div>
              ))
            }
          </ul>

          {isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-black p-10 rounded-lg text-center relative transform transition-transform scale-100">
                <button onClick={closeModal} className="absolute top-2 right-4  bg-none border-none text-2xl cursor-pointer">X</button>
                <h1 className='text-2xl mb-6'>What's your mood?</h1>
                <div className="flex gap-2 mt-2">
                  <span role="img" aria-label="happy" title="Happy" onClick={() => logMood('Happy')} className="text-3xl cursor-pointer transition-transform transform hover:scale-125">😊</span>
                  <span role="img" aria-label="sad" title="Sad" onClick={() => logMood('Sad')} className="text-3xl cursor-pointer transition-transform transform hover:scale-125">😢</span>
                  <span role="img" aria-label="angry" title="Angry" onClick={() => logMood('Angry')} className="text-3xl cursor-pointer transition-transform transform hover:scale-125">😠</span>
                  <span role="img" aria-label="surprised" title="Surprised" onClick={() => logMood('Surprised')} className="text-3xl cursor-pointer transition-transform transform hover:scale-125">😲</span>
                  <span role="img" aria-label="neutral" title="Neutral" onClick={() => logMood('Neutral')} className="text-3xl cursor-pointer transition-transform transform hover:scale-125">😐</span>
                </div>
              </div>
            </div>
          )}

        </>
      ) : (
        <div className="MessageBox">
          <h2>Try searching to get started</h2>
          <h4>Start watching videos to help us build a feed of videos you'll love.</h4>
        </div>
      )}
    </Container>
  );
};

const Container = styled.div`
  margin-top: 56px;
  display: flex;
  width: 81vw;
  height: 91vh;
  top: 0;
  left: 230px;
  overflow-y: scroll;
  position: absolute;
  transition: all 0.3s ease-in-out;

  .tags {
    margin-top: 16px;
    display: flex;
    scroll-behavior: smooth;
    overflow-x: scroll;
    margin-left: 24px;
    white-space: nowrap;
    gap: 10px;


    & > button {
      width: max-content;
      cursor: pointer;
      text-align: center;
      padding: 0 12px;
      line-height: 20px;
      font-size: 14px;
      /* background-color: #272727; */
      font-weight: 500;
      font-family: "Gill Sans Extrabold", sans-serif;
      border: none;
      height: 32px;
      border-radius: 8px;
      transition: background-color 0.3s ease;
      /* &:hover {
        background-color: #3F3F3F;
      } */
    }
  }

  /* .active {
    background-color: #F1F1F1 !important;
    color: rgb(15,15,15);
    &:hover {
      background-color: #FFFFFF !important;
    }
  } */

  ul {
    display: flex;
    position: absolute;
    flex-wrap: wrap;
    top: 90px;
    left: 17px;

    a {
      text-decoration: none;
      margin: 0 7.3px 40px 7.3px !important;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }

      li {
        list-style: none;
        /* transition: transform 0.3s ease; */
/* 
        &:hover {
          transform: scale(1.05);
        } */

        img {
          width: 343px;
          height: 193px;
          border-radius: 8px;
          /* transition: transform 0.3s ease; */

          /* &:hover {
            transform: scale(1.05);
          } */
        }

        .videoInfo {
          display: flex;
          margin-top: 6px;

          img {
            margin-top: 4px;
            border-radius: 50%;
            width: 36px;
            height: 36px;
          }

          .Info {
            width: 100%;
            margin-left: 14px;
            max-width: 298px;

            .title {
              display: flex;
              align-items: center;
              justify-content: space-between;

              span {
                cursor: pointer;
                line-height: 22px;
                font-weight: 500;
                font-size: 16px;
              }

              img {
                width: 24px;
                cursor: pointer;
                height: 24px;
                margin-left: 2px;
                filter: invert(1);
              }
            }

            .channelname {
              display: flex;
              align-items: center;

              span {
                display: flex;
                align-items: center;
                font-weight: 400;
                color: #949494;
                cursor: pointer;
                font-size: 14px;
                line-height: 20px;

                img {
                  width: 14px;
                  margin-left: 4px;
                  height: 14px;
                  filter: invert(0.6);
                }
              }

              &:hover {
                span {
                  color: white;
                }
              }
            }

            .viewAndTime {
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

  .MessageBox {
    display: flex;
    border-radius: 18px;
    margin: 20px auto;
    width: 440px;
    background-color: #272727;
    height: 100px;
    padding: 0 30px;
    flex-direction: column;
    align-items: center;

    h2 {
      width: 440px;
      font-family: "Roboto", "Arial", sans-serif;
      font-size: 20px;
      text-align: center;
      line-height: 22px;
      margin: 26px 0 12px 0 !important;
      font-weight: 900;
    }

    h4 {
      width: 440px;
      font-family: "Roboto", "Arial", sans-serif;
      font-size: 14px;
      line-height: 20px;
      font-weight: 400;
      text-align: center;
      color: darkgray;
    }
  }

  .modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    opacity: ${props => (props.isOpen ? 1 : 0)};
    pointer-events: ${props => (props.isOpen ? 'auto' : 'none')};
    transition: opacity 0.3s ease;

    .modal-content {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      position: relative;
      transform: ${props => (props.isOpen ? 'scale(1)' : 'scale(0.9)')};
      transition: transform 0.3s ease;

      .close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
      }

      .mood-icons {
        display: flex;
        gap: 10px;
        margin-top: 10px;

        span {
          font-size: 30px;
          cursor: pointer;
          transition: transform 0.3s ease;

          &:hover {
            transform: scale(1.2);
          }
        }
      }
    }
  }

  ${props => props.minimize === false && `
    left: 72px !important;
    width: 92vw !important;

    ul > a {
      margin: 0 7px 40px 7px !important;
    }

    ul > a > li > img {
      width: 398.984px !important;
      height: 224.422px !important;
    }

    ul > a > li > .videoInfo > .Info {
      max-width: 348px !important;
    }
  `}
`;

export default RightSide;

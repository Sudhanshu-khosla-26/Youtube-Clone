import styled from 'styled-components';
import React, { useEffect, useState } from 'react'
import LeftSide from './LeftSide';
import { useSelector } from 'react-redux';
import ReactPlayer from 'react-player/lazy'
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VideoPlay = (props) => {
  const Minimize = useSelector((state) => state.MinimizeState);
  const { VideoId } = useParams();
  const [VideoDetail, setVideoDetail] = useState([]);
  const [ShowDescription, setShowDescription] = useState(false);
  const [AllVideos, setAllVideos] = useState([]);

  const User = JSON.parse(localStorage.getItem('USER'));




  useEffect(() => {
    const AccessToken = (JSON.parse(localStorage.getItem('USER'))).accessToken;
    const headers = {
      'Authorization': AccessToken,
      'Accept': 'application/json'
    };
    axios.get(`http://localhost:8000/api/v1/videos/${VideoId}`, { headers })
      .then((Data) => {
        console.log(Data);
        setVideoDetail(Data.data.data)
      })
  }, [VideoId])


  useEffect(() => {
    const AccessToken = (JSON.parse(localStorage.getItem('USER')))?.accessToken;
    console.log(AccessToken);
    const headers = {
      'Authorization': AccessToken,
      'Accept': 'application/json'
    };
    axios.get("http://localhost:8000/api/v1/videos/", { headers })
      .then((videodata) => {
        const data = videodata?.data?.data.filter((video) => {
          return video._id !== VideoDetail?._id
        });
        console.log(data, "data");
        setAllVideos(data)
        // console.log(videodata);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [VideoId])


  return (
    <>
      <Sidebar Minimize={Minimize}>
        <LeftSide />
      </Sidebar>
      <Container>
        <VideoSection>
          {/* <video width="853px" height="480px"
            autoPlay={true} loop={true} poster={`${VideoDetail?.thumbnail}`}
            controls>
            <source src={`${VideoDetail?.videoFile}`} type="video/mp4" />
            </video> */}

          <ReactPlayer className="max-h-[480px] min-h-[365px]" style={{ backgroundColor: "black", borderRadius: "8px" }} loop={true} width="853px"
            height="100%" controls={true}
            light={<img style={{ borderRadius: "8px" }} width="853px" height="480px"
              src={`${VideoDetail?.thumbnail}`} alt='thumnail' />}
            playing={true}
            playbackRate={1} pip={true} stopOnUnmount={true}
            url={`${VideoDetail?.videoFile}`}
          />

          <div className="VideoInfo">
            <div className="videotitle">
              <h1>{
                VideoDetail?.title
                // VideoDetail?.title.length > 74 ? VideoDetail?.title.slice(0, 72) + "..." : VideoDetail?.title
              }</h1>
            </div>

            <div className="videoCredentials">
              <div className="channel_info">
                <a>
                  <img src={VideoDetail?.owner?.avatar} alt="" />
                </a>
                <a>
                  <div className="channel_name_and_subscribers">
                    <span>
                      {VideoDetail?.owner?.username}
                      <img src="/images/tick.svg" alt="" />
                    </span>
                    <span>
                      1.19M subscribers
                    </span>
                  </div>
                </a>
                <div className="subscribebutton">
                  <img src="/images/notifications.svg" alt="" />
                  Subscribed
                  <img src="/images/arrow-down.svg" alt="" />
                </div>
              </div>
              <div className="funtionbuttons">
                <div className="likeanddislike">
                  <button className="likebutton pr-2">
                    <img src="/images/Liked.svg" alt="" />
                    <span>
                      3.9M
                    </span>
                  </button>
                  <div className="h-5 bg-white w-[1px]"></div>
                  <div className="dislikebutton">
                    <img className='invert ' src="/images/DisLike.svg" alt="" />
                  </div>
                </div>

                <button className="sharebutton">
                  <img className='invert' src="/images/Share.svg" alt="" />
                  Share
                </button>

                <button className="Downloadbutton">
                  <img className='invert' src="/images/Download.svg" alt="" />
                  Download
                </button>

                <button className="more">
                  <img className='invert rotate-90' src="/images/tripledot.svg" alt="" />
                </button>
              </div>
            </div>

            <div className="DescriptionBox">
              <div className="px-[16px] pt-[16px] flex info">
                <span className=" leading-[20px] font-bold text-[14px] text-[#f1f1f1] views">
                  116,567,794 views
                </span>
                <span className="date pl-[12px] leading-[20px] font-bold text-[14px] text-[#f1f1f1]">
                  10 Jul 2024
                </span>
              </div>
              {ShowDescription ?
                <>
                  <pre>{VideoDetail?.description}</pre>
                  <span onClick={() => ShowDescription === true ? setShowDescription(false) : null} className="px-[16px] pb-[12px] cursor-pointer leading-[20px] text-[14px] font-bold ">Show less</span>
                </>
                :
                <pre>{(VideoDetail?.description)?.slice(0, 92)}
                  <span onClick={() => ShowDescription === false ? setShowDescription(true) : null} className="span cursor-pointer leading-[20px] text-[14px] font-bold ">   ...more</span>
                </pre>
              }
            </div>

            <div className="CommentSection">
              <div className="commentheader flex items-center py-4">
                <h3 className='leading-[28px] font-bold text-[20px] text-[#f1f1f1]'>
                  262 Comments
                </h3>
                <div className="sortby cursor-pointer ml-6 flex items-center font-[500] text-[14px] leading-[22px] text-[#f1f1f1]">
                  <img className='invert mr-2' src="/images/Sortby.svg" alt="" />
                  Sort by
                </div>
              </div>
              <div className="commentinputsection relative h-fit flex items-center h-fit">
                {/* <div className="userimage flex h-[100%]  justify-center  pr-4"> */}
                <img className='rounded-full absolute top-1 w-[40px] h-[40px] mr-4' src={User?.user?.avatar} alt="" />
                {/* </div> */}
                <div className="textarea ml-[50px] w-full mb-4">
                  <textarea className='w-[99%] bg-transparent outline-none ' placeholder="Add a comment..." />
                  <div className="commentfuntionbuttons flex items-center justify-between">
                    <button className="emoji">
                      <img className='invert' src="/images/Emoji.svg" alt="" />
                    </button>
                    <div className="">
                      <button className="cancle hover:bg-[#282828] px-[10px] rounded-[18px] mr-6 leading-[36px] font-[600] text-[14px] text-[#f1f1f1]">
                        Cancle
                      </button>
                      <button className="commentpost mr-[10px] leading-[36px] text-[14px] font-[600] text-[#0f0f0f] 
                            hover:bg-[#65B8FF] bg-[#3ea6ff]  w-[93px] h-[36px] rounded-[18px]">
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <ul className="comments">
                <li className='comment'>
                  <div className="profileimg">
                    <img src="" alt="" />
                  </div>
                  <div className="commentdata">
                    <pre>

                    </pre>
                  </div>
                  <div className="reportoption">

                  </div>
                </li>
              </ul>
            </div>

          </div>
        </VideoSection>
        <SuggestedVideosSection>

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
          <div className="suggestedvideos">
            <ul>
              {AllVideos?.length > 0 && AllVideos.map((Data) => (
                <a href={`/watch/${Data._id}`}>
                  <li>
                    <img src={Data.thumbnail} alt="" />
                    <div className="videoInfo">
                      {/* <img src={Data.details.avatar} alt="" /> */}
                      <div className="Info">
                        <div className="title">
                          <span>
                            {/* {Data?.title} */}
                            {Data?.title?.length > 54 ? Data.title.slice(0, 54) + "..." : Data.title}
                          </span>
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
          </div>

        </SuggestedVideosSection>
      </Container>
    </>
  )
}

const Sidebar = styled.div`
     .gjmNGo{
        left: -300px !important;
        transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;   
    }

    ${props => props.Minimize && `
        .jgzJSO{
            left: 0px !important;
        }
    `}
`;

const Container = styled.div`
    position: absolute;
    top: 58px;
    left: 0px;
    display: flex;

`;

const VideoSection = styled.div`
    margin-left: 36px;
    padding: 24px 24px 0 0;
    
    video{
        border-radius: 8px;
    }

    .VideoInfo{
        width: 850px;
        .videotitle{
            margin: 8px 0;
            h1{
                line-height: 28px;
                font-size: 20px;
                font-weight: 700;
            }
        }
    
        .videoCredentials{
            display: flex;
            align-items: center;
            justify-content: space-between;

            .channel_info{
                display: flex;
                align-items: center;
                a{

                    img{
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                    }
                }
                 
                a{

                    .channel_name_and_subscribers{
                        margin-left: 18px;
                    width: 103.1px;
                            height: 43px;
                    margin-right: 24px;
                    display: flex;
                    flex-direction: column;
                    line-height: 22px;
                    white-space: nowrap;
                    :first-child{
                        display: flex;
                        align-items: center;
                        font-size: 16px;
                        font-weight: 500;
                    img{
                        width: 14px;
                        height: 14px;
                        filter: invert(0.4);
                        margin-left: 4px;
                    }
                    }
                :last-child{
                        line-height: 18px;
                        font-size: 12px;
                        font-weight: 400;
                        color: rgb(170,170,170);
                    }
                }
            }

                .subscribebutton{
                    background-color: #272727;
                    line-height: 36px;
                    width: 150px;
                    padding: 0 18px;
                    border-radius: 18px;
                    height: 36px;
                    font-size: 14px;
                    font-weight: 500px;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    justify-content: center;
                    img{
                        width: 24px;
                        height: 24px;
                        filter: invert(1);
                    }
                    &:hover{
          background-color: #3F3F3F;
        }

                }

            }

            .funtionbuttons{
                display: flex;
                /* width: 314px; */
                height: 36px;
                gap: 12px;

                & > div{
                        & > img{
                            width: 24px;
                            height: 24px;
                        }
                       
                & > button{
                            & > img {
                                width: 62px;
                                height: 62px;
                                background-blend-mode: lighten;
                            }
                }
            }

                .likeanddislike{
                    display: flex;
                    width: 140px;
                    align-items: center;
                    background-color: #272727;
                    border-radius: 18px;
                    
                    
                    .likebutton{
                        border-radius: 18px;
                        border-top-right-radius: 0px;
                        border-bottom-right-radius: 0px;
                        display: flex;
                        align-items: center;
                        line-height: 36px;
                        font-size: 14px;
                        font-weight: 500;
                        img{
                            position: absolute;
                        }
                        span{
                            margin-left: 48px;
                        }

                        &:hover{
                            background-color: #3F3F3F;
                        }
                    }

                    .dislikebutton{
                        border-radius: 18px;
                        border-top-left-radius: 0px;
                        border-bottom-left-radius: 0px;
                        padding: 6px;
                        padding-left: 14px ;
                        /* width: 40px; */
                        img{
                          padding-right: 8px;
                        }
                        &:hover{
                            background-color: #3F3F3F;
                        }
                    }
                }

                .Downloadbutton{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #272727;
                    border-radius: 18px;
                    width: 118px;
                    height: 36px;
                    line-height: 36px;
                        font-size: 14px;
                        font-weight: 500;
                    img{
                        margin:0 4px 0 0;
                    }

                    &:hover{
                        background-color: #3F3F3F;
                    }
                }

                .sharebutton{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #272727;
                    border-radius: 18px;
                    width: 92px;
                    height: 36px;
                    line-height: 36px;
                        font-size: 14px;
                        font-weight: 500;
                    img{
                        margin:0 4px 0 0;
                    }
                    &:hover{
                            background-color: #3F3F3F;
                        }
                }

                .more{
                    width: 36px;
                    height: 36px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #272727;
                    border-radius: 50%;
                    &:hover{
                            background-color: #3F3F3F;
                        }
                }
                

        }

        }

        .DescriptionBox{
            background-color: #282828;
            color: #f1f1f1;
            height: unset;
            min-height: 104px;
            width: 853.33px;
            margin: 12px 12px 0 0;
            border-radius: 14px;

            pre{
                max-width: 853.33px;
                white-space: pre-wrap;
                padding: 0px 16px 16px 16px;
                line-height: 20px;
                font-size: 14px;
                font-weight: 400;
                font-family: Roboto, Arial, sans-serif;
            }
        }
      
        .CommentSection{
          
          .commentinputsection{
              .textarea{
                height: unset;
                textarea{
                  height: unset;
                  resize: none;
                  field-sizing: content !important;
                }
              }
          }
        }
    }


`;

const SuggestedVideosSection = styled.div`
   padding: 24px 24px 0 0;

  .tags{
     width: 408px;
     height: 48px;
     margin-top: 4px;
     display: flex;
     scroll-behavior: smooth;
     overflow-x: scroll;
     /* margin-left: 24px; */
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
      margin: 2px 12px 12px 0;
      &:hover{
        background-color: #3F3F3F;
      }

    }
  }

  ul{
    display: flex;
    /* position: absolute; */
    flex-wrap: wrap;
    /* top: 90px; */
    /* left: 17px; */
    /* left: 30px; */
    margin-top:14px ;
    a{
      text-decoration: none;
      margin: 0 7.3px 8px 0px !important;
      li{
        list-style : none ;
        display: flex;
        /* align-items: center; */
        img{
            /* margin-top: 8px; */
          width: 168px;
          height: 94px;
          border-radius: 8px;
        }

        .videoInfo{
          display: flex;
          /* margin-top: 4px; */
          vertical-align: top;
          img{
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
                line-height: 20px;
                font-weight: 500;
                font-size: 14px;
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
                font-size: 12px;
                line-height: 18px;
              
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
                font-size: 12px;
                line-height: 18px;
            }

          }
        }
      }
    }
  }

`;


export default VideoPlay;

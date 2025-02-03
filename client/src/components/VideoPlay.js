import styled from 'styled-components';
import React, { useEffect, useState } from 'react'
import LeftSide from './LeftSide';
import { useSelector } from 'react-redux';
import ReactPlayer from 'react-player/lazy'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import moment from 'moment';
import PYPopupBox from './PYPopupBox';

const VideoPlay = (props) => {
  const Minimize = useSelector((state) => state.MinimizeState);
  const [isLoading, setIsLoading] = useState(true);
  const { VideoId } = useParams();
  const [VideoDetail, setVideoDetail] = useState([]);
  const [ShowDescription, setShowDescription] = useState(false);
  const [YTAPIVIDEOS, setYTAPIVIDEOS] = useState([]);
  const [AllVideos, setAllVideos] = useState([]);
  const [channeldata, setchanneldata] = useState('');
  const [commentsbuttons, setcommentsbuttons] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const User = JSON.parse(localStorage.getItem('USER'));
  const [isSaveBoxVisible, setIsSaveBoxVisible] = useState(false);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const toggleSaveBox = () => {
    setIsSaveBoxVisible(!isSaveBoxVisible);
  };

  useEffect(() => {
    const AccessToken = (JSON.parse(localStorage.getItem('USER'))).accessToken;
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





    axios.get(`http://localhost:8000/api/v1/videos/${VideoId}`, { headers })
      .then((Data) => {
        try {
          if (Data?.data?.data?._id === VideoId) {
            setVideoDetail(Data.data.data);
            setIsLoading(false);
            console.log(VideoDetail);
          }
          else {
            setVideoDetail(Data?.data?.data?.items[0]);
            setIsLoading(false);
            console.log(VideoDetail);
          }
        } catch (error) {
          console.log("Error", error);

        }
      })

    axios.get(`http://localhost:8000/api/v1/comments/${VideoId}`, { headers })
      .then((response) => {
        if (response.data.success) {
          setComments(response.data.data);
        } else {
          console.error('Error: Response data indicates failure', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
      });

  }, [VideoId])

  useEffect(() => {
    const fetchChannelData = async () => {
      if (VideoDetail?.id) {
        try {
          const data = await getYTchannelInfo(VideoDetail.snippet.channelId);
          console.log(data);
          setchanneldata(data);
        } catch (error) {
          console.error('Error fetching channel image:', error);
        }
      }
    };


    if (VideoDetail.id) {
      let catergoryid = VideoDetail?.snippet?.categoryId;
      axios.get(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=20000&regionCode=IN&videoCategoryId=${catergoryid}&key=AIzaSyDlhskfkjE7kLtNtHFCWJf2mpaTOV6Wbno`)
        .then((videos) => {
          const filteredVideos = videos.data.items.filter(video => video.id !== VideoDetail.id);
          setYTAPIVIDEOS(filteredVideos);
          // console.log(videos.data.items);
        })
        .catch((err) => {
          console.log(err);
        })
    }
    else {
      let catergoryid = 0;
      axios.get(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=20000&regionCode=IN&videoCategoryId=${catergoryid}&key=AIzaSyDlhskfkjE7kLtNtHFCWJf2mpaTOV6Wbno`)
        .then((videos) => {
          setYTAPIVIDEOS(videos.data.items)
          // console.log(videos.data.items);
        })
        .catch((err) => {
          console.log(err);
        })
    }

    fetchChannelData();
  }, [VideoDetail]);


  const getYTchannelInfo = async (channelId) => {
    try {
      const response = await axios.get(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channelId}&key=AIzaSyDlhskfkjE7kLtNtHFCWJf2mpaTOV6Wbno`);
      const url = response?.data?.items[0]?.snippet?.thumbnails?.high?.url;
      const subscribers = response?.data?.items[0]?.statistics?.subscriberCount;
      console.log(url);
      return {
        "url": url,
        "subscribers": subscribers
      };
    } catch (error) {
      console.error('Error fetching channel info:', error);
      return null;
    }
  };

  const formatCount = (count) => {
    if (count < 1000) return count;
    if (count <= 1000000) return (count / 1000).toFixed(0) + ' K';
    if (count <= 1000000000) return (count / 1000000).toFixed(0) + ' M';
    return (count / 1000000000).toFixed(1) + ' B';
  };

  const formatSubscriberCount = (count) => {
    if (count < 1000) return count;
    if (count <= 1000000) return (count / 1000).toFixed(1) + 'K';
    if (count <= 1000000000) return (count / 1000000).toFixed(1) + 'M';
    return (count / 1000000000).toFixed(1) + ' B';
  };

  const handleLike = async () => {
    try {
      const AccessToken = (JSON.parse(localStorage.getItem('USER'))).accessToken;
      const headers = {
        'Authorization': AccessToken,
        'Accept': 'application/json'
      };
      const response = await axios.patch(`http://localhost:8000/api/v1/likes/toggle/v/${VideoId}`, {}, { headers });
      if (response.data.success) {
        setVideoDetail((prevDetail) => ({
          ...prevDetail,
          isLiked: !prevDetail.isLiked,
          totalLikes: prevDetail.isLiked ? prevDetail.totalLikes - 1 : prevDetail.totalLikes + 1,
        }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async (commentText) => {
    try {
      const AccessToken = (JSON.parse(localStorage.getItem('USER'))).accessToken;
      const headers = {
        'Authorization': AccessToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      const response = await axios.post(
        `http://localhost:8000/api/v1/comments/${VideoDetail?._id}`,
        { "content": commentText },
        { headers }
      );
      if (response.data.success) {
        setComments((prevComments) => [response.data.data, ...prevComments]);
        setCommentInput('');
      } else {
        console.error('Error: Response data indicates failure', response.data);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
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
          {VideoDetail?.id ?
            <div className="relative w-[853px] max-h-[480px] min-h-[365px] h-full">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="loader"></div>
                </div>
              )}
              <ReactPlayer
                className="max-h-[480px] min-h-[365px] object-cover"
                style={{ backgroundColor: "black", borderRadius: "8px" }}
                loop={true}
                width="853px"
                height="100%"
                controls={true}
                light={<img className='max-h-[480px] min-h-[365px]  h-full' style={{ borderRadius: "8px" }} width="853px" src={`${VideoDetail?.snippet?.thumbnails?.maxres?.url || VideoDetail?.snippet?.thumbnails?.standard?.url}`} alt='thumbnail' />}
                playing={true}
                playbackRate={1}
                pip={true}
                stopOnUnmount={true}
                url={`https://www.youtube.com/embed/${VideoDetail?.id}?autoplay=0&mute=0&showinfo=0`}
                onReady={() => setIsLoading(false)}
              />
            </div>
            :
            <div className="relative w-[853px] max-h-[480px] min-h-[365px] h-full">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="loader"></div>
                </div>
              )}
              <ReactPlayer
                className="max-h-[480px] min-h-[365px] object-cover"
                style={{ backgroundColor: "black", borderRadius: "8px" }}
                loop={true}
                width="853px"
                height="100%"
                controls={true}
                light={<img style={{ borderRadius: "8px" }} width="853px" height="480px" src={`${VideoDetail?.thumbnail}`} alt='thumbnail' />}
                playing={true}
                playbackRate={1}
                pip={true}
                stopOnUnmount={true}
                url={`${VideoDetail?.videoFile}`}
                onReady={() => setIsLoading(false)}
              />
            </div>
          }

          <div className="VideoInfo">
            <div className="videotitle">
              <h1>{
                VideoDetail?.snippet ? VideoDetail?.snippet?.title : VideoDetail?.title
                // VideoDetail?.title.length > 74 ? VideoDetail?.title.slice(0, 72) + "..." : VideoDetail?.title
              }</h1>
            </div>

            <div className="videoCredentials">
              <div className="channel_info">
                <a>
                  <img
                    src={VideoDetail?.id ? channeldata.url : VideoDetail?.owner?.avatar}
                    alt=""
                  />
                </a>
                <a>
                  <div className="channel_name_and_subscribers">
                    <span>
                      {VideoDetail?.owner?.username ? VideoDetail?.owner?.username : VideoDetail?.snippet?.channelTitle}
                      <img src="/images/tick.svg" alt="" />
                    </span>
                    <span>
                      {formatSubscriberCount(channeldata.subscribers)} subscribers
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
                  <button className="likebutton pr-2 flex flex-grow"
                    onClick={handleLike}>

                    {VideoDetail?.isLiked ?
                      <img src="/images/Liked.svg" alt="" />
                      :
                      <img src="/images/unlike.svg" alt="" />
                    }
                    <span>
                      {VideoDetail?.id ?
                        (VideoDetail?.statistics.likeCount && formatCount((VideoDetail?.statistics.likeCount)) || 0)
                        :
                        ((VideoDetail?.totalLikes && formatCount(VideoDetail?.totalLikes)) || 0)
                      }
                    </span>
                  </button>
                  <div className="h-5 bg-white w-[1px]"></div>
                  <div className="dislikebutton flex flex-grow">
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
                <div className="relative">
                  <button className="more" onClick={togglePopup}>
                    <img className='invert rotate-90' src="/images/tripledot.svg" alt="" />
                  </button>
                  {isPopupVisible && (
                    <div className="popup-box w-[120px] py-2 absolute bottom-12 bg-[#282828]  shadow-lg rounded-lg">
                      <button className="flex items-center justify-evenly  w-full text-start text-[14px] leading-[20px] font-normal  py-1 hover:bg-[#535353]">
                        <img className="invert" src="/images/Clip.svg" alt="" />
                        Clip
                      </button>
                      <button className="flex items-center justify-evenly  w-full text-start text-[14px] leading-[20px] font-normal  py-1 hover:bg-[#535353]" onClick={toggleSaveBox}>
                        <img className="invert" src="/images/Save.svg" alt="" />
                        Save
                      </button>
                      <button className="flex items-center justify-evenly  w-full  text-start text-[14px] leading-[20px] font-normal py-1 hover:bg-[#535353]">
                        <img className="ml-1 invert" src="/images/Report-history.svg" alt="" />
                        Report
                      </button>
                    </div>
                  )}
                  {isSaveBoxVisible && (
                    <PYPopupBox />
                  )}
                </div>
              </div>
            </div>

            <div className="DescriptionBox">
              <div className="px-[16px] pt-[16px] flex info">
                <span className=" leading-[20px] font-bold text-[14px] text-[#f1f1f1] views">
                  {VideoDetail.id ? VideoDetail?.statistics?.viewCount : VideoDetail.views} views
                </span>
                <span className="date pl-[12px] leading-[20px] font-bold text-[14px] text-[#f1f1f1]">
                  {moment(VideoDetail.id ? VideoDetail?.snippet?.publishedAt : VideoDetail.createdAt).format('DD MMM YYYY')}
                </span>
              </div>
              {ShowDescription ?
                <>
                  <pre>{VideoDetail?.description ? VideoDetail?.description : VideoDetail?.snippet?.description}</pre>
                  <span onClick={() => ShowDescription === true ? setShowDescription(false) : null} className="px-[16px] pt-[12px] cursor-pointer leading-[20px] text-[14px] font-bold ">Show less
                    <br />
                    <br />
                  </span>
                </>
                :
                <pre>{(VideoDetail?.description ? VideoDetail?.description : VideoDetail?.snippet?.description)?.slice(0, 92)}
                  <span onClick={() => ShowDescription === false ? setShowDescription(true) : null} className="span cursor-pointer leading-[20px] text-[14px] font-bold ">   ...more</span>
                </pre>
              }
            </div>

            <div className="CommentSection">
              <div className="commentheader flex items-center py-4">
                <h3 className='leading-[28px] font-bold text-[20px] text-[#f1f1f1]'>
                  {VideoDetail.id ? (VideoDetail.statistics.commentCount) : comments.length} Comments
                </h3>
                <div className="sortby cursor-pointer ml-6 flex items-center font-[500] text-[14px] leading-[22px] text-[#f1f1f1]">
                  <img className='invert mr-2' src="/images/Sortby.svg" alt="" />
                  Sort by
                </div>
              </div>
              <div className="commentinputsection relative h-fit flex items-center">
                {/* <div className="userimage flex h-[100%]  justify-center  pr-4"> */}
                <img className='rounded-full absolute top-1 w-[40px] h-[40px] mr-4' src={User?.user?.avatar} alt="" />
                {/* </div> */}
                <div className="textarea ml-[50px] w-full mb-4">
                  <textarea onChange={(e) => {
                    setCommentInput(e.target.value);
                    console.log(e.target.value);
                  }} onClick={() => setcommentsbuttons(true)} value={commentInput} className='w-[99%] bg-transparent outline-none ' placeholder="Add a comment..." />
                  {commentsbuttons ?
                    <div className="commentfuntionbuttons flex items-center justify-between">
                      <button className="emoji">
                        <img className='invert' src="/images/Emoji.svg" alt="" />
                      </button>
                      <div className="">
                        <button onClick={() => {
                          setCommentInput("");
                          setcommentsbuttons(false);
                        }} className="cancle hover:bg-[#282828] px-[10px] rounded-[18px] mr-6 leading-[36px] font-[600] text-[14px] text-[#f1f1f1]">
                          Cancle
                        </button>
                        <button onClick={() => { handleComment(commentInput); }} className="commentpost mr-[10px] leading-[36px] text-[14px] font-[600] text-[#0f0f0f] 
                            hover:bg-[#65B8FF] bg-[#3ea6ff]  w-[93px] h-[36px] rounded-[18px]">
                          Comment
                        </button>
                      </div>
                    </div>
                    :
                    <></>
                  }
                </div>
              </div>
              <ul className="comments">
                {comments.map((comment) => (
                  <li className='comment flex mt-4 '>
                    <div className="profileimg ">
                      <img className='rounded-full top-1 w-[40px] h-[40px] mr-4' src={comment?.owner?.avatar} alt="" />
                    </div>
                    <div className="commentdata">
                      <span>
                        <span className="">
                          commenter name
                          <span className="">
                            posted this ago
                          </span>
                        </span>
                      </span>
                      <pre className='text-[14px] font-[400] text-[#f1f1f1] leading-[20px]'>
                        {comment?.content}
                      </pre>
                    </div>
                    <div className="reportoption">
                      <img src="" alt="" />
                    </div>
                  </li>
                ))}
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
                    <img className='object-cover' src={Data.thumbnail} alt="" />
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
                          {formatCount(Data.views)} views • {timeAgo(Data.createdAt)}
                        </span>
                      </div>
                    </div>
                  </li>
                </a>
              ))}
              {YTAPIVIDEOS?.length > 0 && YTAPIVIDEOS.map((Data) => (
                <a href={`/watch/${Data.id}`}>
                  <li >
                    <img className='object-cover' src={Data?.snippet?.thumbnails?.high?.url} alt="" />
                    <div className="videoInfo max-w-[254px]">
                      {/* <img src={Data.details.avatar} alt="" /> */}
                      <div className="Info">
                        <div className="title">
                          <span>
                            {/* {Data?.title} */}
                            {Data?.snippet?.title?.length > 54 ? Data.snippet.title.slice(0, 54) + "..." : Data.snippet.title}
                          </span>
                          <img src="/images/tripledot.svg" alt="" />
                        </div>
                        <div className="channelname">
                          <span>
                            {Data?.snippet?.channelTitle}
                            <img src="/images/tick.svg" alt="" />
                          </span>
                        </div>
                        <span className='viewAndTime'>
                          {formatCount(Data?.statistics?.viewCount)} views • {timeAgo(Data?.snippet?.publishedAt)}
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
          .dSfYty{
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
          width: 146px;
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

          .comments{
              * {
              font-family: Roboto, Arial, sans-serif;
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
            width: 168px ;
          height: 94px ;
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

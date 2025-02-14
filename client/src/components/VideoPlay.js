import styled from 'styled-components';
import React, { useEffect, useState, useMemo, useCallback, memo } from 'react'
import LeftSide from './LeftSide';
import { useSelector } from 'react-redux';
import ReactPlayer from 'react-player/lazy'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import moment from 'moment';
import PYPopupBox from './PYPopupBox';
import api from "../services/api.service";


const CustomButton = memo(({ onClick, children }) => (
  <button
    onClick={onClick}
    className="p-2 w-[40px] h-[40px] rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800"
  >
    {children}
  </button>
));

const IconX = memo(() => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
));

const IconShuffle = memo(() => (
  <img className='invert w-[24px] h-[24px]1' src='/images/Shuffle.svg' alt='Shuffle' />
));

const IconLoop = memo(() => (
  <img className='invert w-[24px] h-[24px]' src='/images/Loop.svg' alt='Loop' />
));


const VideoPlaylist = memo(({videoId, playlistId, index}) => {
  const [activeVideo, setActiveVideo] = useState(parseInt(index));
  const [isOpen, setIsOpen] = useState(true);
  const [playlistData, setPlaylistData] = useState([]);
  const [playlistVideo, setplaylistVideo] = useState([]);
  const user = useMemo(() => JSON.parse(localStorage.getItem('USER')), []);
  const [showRemovePopup, setshowRemovePopup] = useState(false);


  const fetchplaylist = useCallback(async () => {
    try {
      const response = await api.get(`/playlist/${playlistId}`);
      const playlistDetails = response.data.data;
      setPlaylistData(playlistDetails);
      
      const videoslist = playlistDetails.videos;
      const videoDataPromises = videoslist.map(videoId => api.get(`/videos/${videoId}`));

      const responses = await Promise.all(videoDataPromises);
      const videoData = responses.map(response => response.data.data);
      
      setplaylistVideo(videoData);
    } catch (error) {
      console.error('Error fetching playlist:', error);
    }
  }, [playlistId]);

  const formatDuration = useCallback((second) => {
    const totalSeconds = Math.round(second);
    const hours = Math.floor(totalSeconds / 3600);
    const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return seconds >= 3600
      ? `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      : `${remainingMinutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);


const removePlaylistFromLibrary = async () => {
  try {
    await api.delete(`/playlist/${playlistId}`).then((response) => {
      console.log(response.data);
    })
    console.log();
  } catch (error) {
    console.log(error);
  }
};

  useEffect(() => {
    fetchplaylist();
  },[])
  // fetchplaylist();


  return (
    !isOpen ?
      <div className='w-[420px] mb-4 font-roboto bg-[#150A33] border-[0.1px] border-zinc-700 text-white rounded-lg overflow-hidden' onClick={() => setIsOpen(true)}>
        <div className="flex items-center gap-2 px-4 py-3 ">
          <div className='flex flex-col'>
          <p className="text-[14px] line-clamp-1 leading-[20px] font-normal">
            <span className='text-[14px] pr-1  leading-[20px] font-semibold'>
              Next:
            </span>
              {playlistVideo.length > parseInt(index) ? playlistVideo[parseInt(index)]?.title : playlistVideo[0].title}
            </p>
          <span className='text-[12px] mt-1 line-clamp-1 text-zinc-400 hover:text-white leading-[18px] font-normal'>{user.user.fullName} - {parseInt(index)}/{playlistVideo.length}</span>
          </div>
          <div onClick={() => setIsOpen(false)} className="rounded-full min-w-[40px] flex items-center justify-center h-[40px] hover:bg-zinc-600">
            <img className='invert ' src='/images/arrow-down.svg' alt='' />
          </div>
        </div>
      </div>
      :
    <div className="w-[420px] mb-4 font-roboto  bg-zinc-900 border-[0.1px] border-zinc-700 text-white rounded-lg overflow-hidden">
      <div className="flex items-start justify-between pt-4 pb-1 ">
        <div>
          <h2 className="text-[20px] px-4 line-clamp-1 leading-[28px] font-bold">{playlistData.name}</h2>
          <p className="text-[12px] mt-1 px-4 leading-[15px]  font-normal text-zinc-400">
            <span className='text-white pr-1 '>
              {user.user.fullName}
            </span>
             - {parseInt(index)}/{playlistVideo.length}</p>
          <div className='flex items-center gap-2 ml-2 mt-1'>
          <CustomButton>
            <IconLoop />
          </CustomButton>
          <CustomButton>
            <IconShuffle />
          </CustomButton>
          </div>
        </div>
        <div className="flex flex-col relative justify-between items-center mr-2">
    
          <CustomButton onClick={() => setIsOpen(false)}>
            <IconX />
          </CustomButton> 

          <CustomButton onClick={() => setshowRemovePopup(!showRemovePopup)}>
            <img className='invert w-[24px] h-[24px]' src="/images/tripledot.svg" alt="" />
          </CustomButton>
          {showRemovePopup && (
            <div className="absolute right-8 w-max top-16  bg-[#272727] p-2 rounded-lg">
              <button
                onClick={() => {removePlaylistFromLibrary(); setshowRemovePopup(!showRemovePopup) }}
                className="text-white text-[14px] font-semibold leading-[20px]"
              >
                Remove playlist from library
              </button>
            </div>
          )}
          


        </div>
      </div>

      <div className="h-fit max-h-[380px]  overflow-y-auto">
        {playlistVideo.map((video , Index) => (
          <a 
            href={`/watch/${video._id}/${playlistData._id}/${parseInt(Index)+1}`}
            key={video._id}
            className={`flex items-center gap-2 pt-[8px] pr-[8px] pb-[4px] pl-[0px]  cursor-pointer ${
              activeVideo === parseInt(Index)+1 ? "bg-[#130831]" : "bg-[#0f0f0f] hover:bg-zinc-800"
            }`}
            onClick={() => setActiveVideo(parseInt(Index)+1)}
          >
            <span className="text-[12px] leading-[15px]  font-normal text-zinc-400 mt-1 w-2 h-[60px] flex items-center justify-center mx-2">{Index+1}</span>
            <div className="relative flex-shrink-0">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-[100px] h-[50px] object-cover rounded"
              />
              <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                {formatDuration(video.duration)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[14px] w-10/12 leading-[20px]  font-medium line-clamp-2">{video.title}</h3>
              <p className="text-[12px] leading-[18px]  font-normal text-zinc-400 mt-1">{video.owner.fullName}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
    
  );
});



const VideoPlay = (props) => {
  const Minimize = useSelector((state) => state.MinimizeState);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { VideoId, playlistId, index } = useParams();
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
  const [showloginalertbox, setshowloginalertbox] = useState("");

  console.log(VideoId, playlistId, index);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const toggleSaveBox = () => {
    setIsPopupVisible(false);
    setIsSaveBoxVisible(!isSaveBoxVisible);
  };

  useEffect(() => {

    api.get("/videos/")
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





    api.get(`/videos/${VideoId}`)
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

    api.get(`/comments/${VideoId}`)
      .then((response) => {
        if (response.data.success) {
          console.log(response.data.data);
          setComments(response.data.data);
        } else {
          console.error('Error: Response data indicates failure', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
      });

    axios.get(`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${VideoId}&key=AIzaSyDlhskfkjE7kLtNtHFCWJf2mpaTOV6Wbno`)
      .then((response) => {
        if (response.data.items) {
          console.log(response.data.items);
          setComments(response.data.items);
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
      const response = await api.patch(`/likes/toggle/v/${VideoId}`, {});
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
      const response = await api.post(
        `/comments/${VideoDetail?._id}`,
        { "content": commentText }
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
         
            <div className="relative h-full w-screen md:w-[853px] md:max-h-[480px] md:min-h-[365px]">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="loader"></div>
                </div>
              )}
              <ReactPlayer
                className="h-full w-screen rounded-lg md:w-[853px] md:max-h-[480px] md:min-h-[365px]"
                style={{ backgroundColor: "black" }}
                loop={true}
                width="100%"
                height="100%"
                controls={true}
                light={<img className='h-[202px] w-screen md:max-h-[480px] md:min-h-[365px]  md:h-full object-cover rounded-lg' src={`${VideoDetail?.snippet?.thumbnails?.maxres?.url || VideoDetail?.snippet?.thumbnails?.standard?.url}`}  />}
                playing={true}
                playbackRate={1}
                pip={true}
                stopOnUnmount={true}
                url={`https://www.youtube.com/embed/${VideoDetail?.id}?autoplay=0&mute=0&showinfo=0`}
                onReady={() => setIsLoading(false)}
              />
            </div>
            :
    
            <div className="relative h-full w-screen md:w-[853px] md:max-h-[480px] md:min-h-[365px]">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="loader"></div>
                </div>
              )}
              <ReactPlayer
                className="h-full w-screen rounded-lg md:w-[853px] md:max-h-[480px] md:min-h-[365px]"
                style={{ backgroundColor: "black" }}
                loop={true}
                width="100%"
                height="100%"
                controls={true}
                light={<img className='h-[202px] object-cover md:max-h-[480px] md:min-h-[365px]  md:h-full w-screen rounded-lg' src={`${VideoDetail?.thumbnail}`} alt='thumbnail' />}
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
                <div className="likeanddislike  relative ">
                  <button className="likebutton pr-2 flex flex-grow"
                    onClick={() => {
                      User ? 
                      handleLike()
                      :
                      showloginalertbox === "" ?  setshowloginalertbox("Like") : setshowloginalertbox("")
                    }}>

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

                  {showloginalertbox === "Like" &&
                              <div className="w-[300px] p-4 z-10 absolute bg-zinc-900 text-white border-zinc-800  bottom-14">
                              <div>
                                <span className="text-lg font-medium">Like this video?</span>
                              </div>
                              <div className="space-y-4">
                                <p className="text-sm text-zinc-400">Sign in to make your opinion count.</p>
                                <button variant="link" onClick={() => navigate("/v3/Signin")} className="text-blue-400 hover:text-blue-300 p-0 h-auto font-medium">
                                  Sign in
                                </button>
                              </div>
                            </div>
                      }
                </div>

                <button className="sharebutton">
                  <img className='invert' src="/images/Share.svg" alt="" />
                  Share
                </button>

                <button className="Downloadbutton hidden md:block" style={{ opacity: User ? 1 : 0.7 }} disabled={!User}>
                  <img className='invert' src="/images/Download.svg" alt="" />
                  Download
                </button>
                <div className="relative">
                  <button className="more" onClick={togglePopup}>
                    <img className='invert rotate-90' src="/images/tripledot.svg" alt="" />
                  </button>
                  {isPopupVisible && (
                    <div className="popup-box w-[120px] py-2 absolute bottom-12 bg-[#282828]  shadow-lg rounded-lg">
                      <button className="flex items-center justify-evenly  w-full text-start text-[14px] leading-[20px] font-normal  py-1 hover:bg-[#535353]" style={{ opacity: User ? 1 : 0.7 }} disabled={!User}>
                        <img className="invert" src="/images/Clip.svg" alt="" />
                        Clip
                      </button>
                      <button className="flex items-center justify-evenly  w-full text-start text-[14px] leading-[20px] font-normal  py-1 hover:bg-[#535353]" style={{ opacity: User ? 1 : 0.7 }} disabled={!User} onClick={toggleSaveBox}>
                        <img className="invert" src="/images/Save.svg" alt="" />
                        Save
                      </button>
                      <button className="flex items-center justify-evenly  w-full  text-start text-[14px] leading-[20px] font-normal py-1 hover:bg-[#535353]" style={{ opacity: User ? 1 : 0.7 }} disabled={!User}>
                        <img className="ml-1 invert" src="/images/Report-history.svg" alt="" />
                        Report
                      </button>
                    </div>
                  )}
                </div>
                {isSaveBoxVisible && (
                  <PYPopupBox VideoId={VideoId} />
                )}
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

          

          </div>
        </VideoSection>
        <SuggestedVideosSection>

          {playlistId &&
            <VideoPlaylist videoId={VideoId} playlistId={playlistId} index={index} />
          }
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
                    <div className="videoInfo ">
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
            z-index: 9999;
            position: fixed;
            top: 0px !important;
            left: -300px !important;
            transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;   

          ${props => props.Minimize && `
            top: 0px;
            left: 0px !important;
    `}
          `;

const Container = styled.div`
          position: absolute;
          top: 58px;
          left: 0px;
          display: flex;  

              @media (max-width: 1024px) {
    flex-direction: column;
  }
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
          // margin-left: 60px;
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


    @media (min-width: 0px) and ( max-width: 768px) {
            margin-left: 0;
            padding: 0 24px 0 0;

                 video{
                    width:100vw;
                 }

              .VideoInfo{
                width: 90vw !important;
                margin: 0 6% 0 6% !important;

                .videotitle{
                  h1{
                     line-height: 26px !important;
                      font-size: 18px !important;
                      font-weight: 500 !important;
                  }
                }

                .videoCredentials{
                  flex-direction: column !important;

                  .funtionbuttons{
                    .Downloadbutton{
                      display: none;
                    }
                  }
                }

                .DescriptionBox{
                  width: 90vw !important;
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
              flex:1;
              width: 100%;

    

        @media (min-width: 768px) and (max-width: 1024px) {
            
        } 

          /* position: absolute; */
          flex-wrap: wrap;
          /* top: 90px; */
          /* left: 17px; */
          /* left: 30px; */
          margin-top:14px ;
          a{
            text-decoration: none;
          margin: 0 7.3px 8px 0px ;
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

  @media (min-width: 0px) and ( max-width: 768px) {
              width: 100vw;
              padding: 12px 0 0 0;


              .tags{
                  display: none !important;
              }

              ul{
                a{
                    margin: 0 0 8px 0px !important;

                  li{
                    flex-direction: column;

                    img{
                          width: 100%;
    height: 215px;
                    }

                    .videoInfo{
                      width: 100%;
                      
                    .Info{
                      max-width: 100vw;
                      }
                        
                    }
                  }
                  }

                }
        }


`;


export default VideoPlay;

import { useEffect, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import moment from "moment"
import LoadingGrid from "./Loadinggrid"
import api from "../services/api.service"
import Aurora from './Aurora';
import { Link } from "react-router-dom"

const ShinyText = ({ text, disabled = false, speed = 5, className = '' }) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`text-[#b5b5b5a4] bg-clip-text inline-block ${disabled ? '' : 'animate-shine'} ${className}`}
      style={{
        backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        animationDuration: animationDuration,
      }}
    >
      {text}
    </div>
  );
};




const RightSide = () => {
  const [allVideos, setAllVideos] = useState([])
  const [ytApiVideos, setYtApiVideos] = useState([])
  const [categoryId, setCategoryId] = useState(0)
  const [tagList, setTagList] = useState([])
  const [activetag, setactivetag] = useState("All")
  const [loading, setLoading] = useState(false)
  const [channelImages, setChannelImages] = useState({})
  const [isOpen, setIsOpen] = useState(true)
  const minimize = useSelector((state) => state.MinimizeState)
  const user = JSON.parse(localStorage.getItem("USER"))
  const [showMessage, setShowMessage] = useState(false);

  console.log("rightside render")

  const handleVideoClick = () => {
    setShowMessage(false);
    localStorage.setItem('messageShown', 'true');
  };

  useEffect(() => {
    fetchAllVideos()
    fetchTagList()
    const messageShown = localStorage.getItem('messageShown');
    if (!messageShown) {
      setShowMessage(true);
    }
    console.log("api call allvideos");

  }, [])

  useEffect(() => {
    if (categoryId === 0) {
      fetchAllVideos()
    }
    fetchCategoryVideos(categoryId)
  }, [categoryId])

  useEffect(() => {
    setLoading(true)
    if (ytApiVideos.length > 0) {
      fetchChannelImages()
    }
  }, [ytApiVideos])

  const fetchAllVideos = async () => {
    try {
      const response = await api.get("/videos/")
      setAllVideos(response.data.data)
    } catch (error) {
      console.error("Error fetching all videos:", error)
    }
  }

  const fetchCategoryVideos = async (categoryId) => {
    try {
      const response = await axios.get(
        `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=20000&regionCode=IN&videoCategoryId=${categoryId}&key=AIzaSyDlhskfkjE7kLtNtHFCWJf2mpaTOV6Wbno`,
      )
      setYtApiVideos(response.data.items)
    } catch (error) {
      console.error("Error fetching category videos:", error)
    }
  }

  const fetchTagList = async () => {
    try {
      const response = await axios.get(
        `https://youtube.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=IN&key=AIzaSyDlhskfkjE7kLtNtHFCWJf2mpaTOV6Wbno`,
      )
      setTagList(response.data.items)
    } catch (error) {
      console.error("Error fetching tag list:", error)
    }
  }

  const getYTchannelInfo = async (channelId) => {
    try {
      const response = await axios.get(
        `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channelId}&key=AIzaSyDlhskfkjE7kLtNtHFCWJf2mpaTOV6Wbno`,
      )
      return response?.data?.items[0]?.snippet?.thumbnails?.high?.url
    } catch (error) {
      console.error("Error fetching channel info:", error)
      return null
    }
  }

  const fetchChannelImages = async () => {
    const images = {}
    for (const data of ytApiVideos) {
      if (data?.snippet?.channelId) {
        const url = await getYTchannelInfo(data.snippet.channelId)
        if (url) {
          images[data.snippet.channelId] = url
        }
      }
    }
    setChannelImages(images)
    setLoading(false)
  }

  const formatViewCount = (count) => {
    if (count < 1000) return count
    if (count <= 1000000) return (count / 1000).toFixed(1) + " K"
    if (count <= 1000000000) return (count / 1000000).toFixed(1) + " M"
    return (count / 1000000000).toFixed(1) + " B"
  }

  const timeAgo = (date) => {
    const now = moment()
    const inputDate = moment(date)
    const diffInSeconds = now.diff(inputDate, "seconds")

    if (diffInSeconds < 60) return "now"
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minute${Math.floor(diffInSeconds / 60) > 1 ? "s" : ""} ago`
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hour${Math.floor(diffInSeconds / 3600) > 1 ? "s" : ""} ago`
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) > 1 ? "s" : ""} ago`
    if (diffInSeconds < 31536000)
      return `${Math.floor(diffInSeconds / 2592000)} month${Math.floor(diffInSeconds / 2592000) > 1 ? "s" : ""} ago`
    return `${Math.floor(diffInSeconds / 31536000)} year${Math.floor(diffInSeconds / 31536000) > 1 ? "s" : ""} ago`
  }

  const videoViewUpdate = async (videoId) => {
    try {
      await api.patch(`/videos/view/${videoId}`, {})
    } catch (error) {
      console.error("Error updating video view:", error)
    }
  }

  const closeModal = () => {
    setIsOpen(false)
    setactivetag("All")
  }

  const fetchMoodResult = async (mood) => {
    try {
      const response = await api.post("/ai/get-result", { prompt: mood })
      const result = response.data
      localStorage.setItem("mood", mood)
      console.log(result)
      const resultArray = result
      setYtApiVideos(resultArray)
    } catch (error) {
      console.error("Error fetching mood result:", error)
    }
  }

  const logMood = (mood) => {
    setYtApiVideos([])
    setAllVideos([])
    setactivetag("AI")
    setIsOpen(false)
    console.log(mood)
    fetchMoodResult(mood)
  }

  
  // return null;
  

  return (
    <div
      className={`flex flex-col w-screen  ${minimize ? "lg:w-[81vw] lg:left-[230px]" : "lg:w-[92vw] lg:left-[72px]"} h-screen top-0 overflow-y-scroll absolute transition-all duration-300 ease-in-out`}
    >
        
       
          <div className=" mt-16  tags min-h-[32px] max-h-[32px] flex-row  flex overflow-x-scroll ml-4  md:ml-  6 lg:ml-6 whitespace-nowrap gap-2.5">
            <button
              className={`${
                "AI" === activetag
                  ? "bg-white text-black hover:bg-[#FFFFFF]"
                  : "text-white bg-[#272727] hover:bg-[#3F3F3F]"
              } cursor-pointer border-[0.4px] border-zinc-600 text-center px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-300`}
              onClick={() => {
                setactivetag("AI")
                setCategoryId(-1)
                setIsOpen(true)
              }}
            >
          <ShinyText className={`${
                "AI" === activetag
                  ? "bg-white text-black hover:bg-[#FFFFFF]"
                  : ""
              } custom-class`} text="AI✦" disabled={false} speed={2}  />

              {/* AI✦ */}
            </button>
            <button
              className={`${
                "All" === activetag
                  ? "bg-white text-black hover:bg-[#FFFFFF]"
                  : "text-white bg-[#272727] hover:bg-[#3F3F3F]"
              } cursor-pointer text-center px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-300`}
              onClick={() => {
                setactivetag("All")
                setCategoryId(0);
              }}
            >
              All
            </button>
            {tagList.map((tag) => (
              <button
                key={tag.id}
                className={`${
                  tag.snippet.title === activetag ? "bg-white text-black" : "text-white bg-[#272727] hover:bg-[#3F3F3F]"
                } cursor-pointer  text-center px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-300`}
                onClick={() => {
                  setactivetag(tag.snippet.title)
                  setCategoryId(tag.id)
                  setAllVideos([])
                  handleVideoClick();
                }}
              >
                {tag.snippet.title}
              </button>
            ))}
          </div>

          {showMessage && !user && (
        <div className="flex flex-col items-center justify-center bg-[#272727] rounded-[18px] mx-auto mt-5 w-[440px] h-[100px] px-[30px]" >
          <h2 className="font-['Roboto','Arial',sans-serif] text-[20px] text-center leading-[22px] mt-[26px] mb-[12px] font-bold">
            Try searching to get started
          </h2>
          <h4 className="font-['Roboto','Arial',sans-serif] text-[14px] leading-[20px] font-normal text-center text-gray-400">
            Start watching videos to help us build a feed of videos you'll love.
          </h4>
        </div>
      )}

          {!(ytApiVideos && allVideos)  ? (
            <div
              className={`flex w-screen ${minimize ? "md:w-[81vw]" : "md:w-[91.6vw]"} justify-center items-center absolute top-[90px] left-[17px] flex-wrap`}
            >
              <LoadingGrid />
            </div>
          ) : (
            <div className="flex  md:ml-0 lg:ml-3  flex-col w-full md:flex-row md:flex-wrap gap-x-4 gap-y-8 md:p-4 mt-4">
              {allVideos.map((data) => (  
                <Link
                  to={`/watch/${data._id}`}
                  key={data._id}
                  onClick={() => {videoViewUpdate(data._id);
                    handleVideoClick();
                  }}
                  className="no-underline md:w-[48%] lg:w-[32%] w-full"
                >
                  <div className="transition-transform duration-300 hover:scale-105">
                    <img loading="lazy" 
                      className="object-cover max-h-[224px] w-full h-full rounded-lg"
                      src={data.thumbnail}
                      alt=""
                      width={343}
                      height={193}
                    />
                    <div className="flex mt-2 px-3">
                      <img loading="lazy" 
                        className="rounded-full min-w-[40px] w-[40px] max-h-[40px] "
                        src={data.details.avatar}
                        alt=""
                        width={36}
                        height={36}
                      />
                      <div className="ml-3 w-full">
                        <div className="flex justify-between items-center">
                          <span className="cursor-pointer flex-1 line-clamp-2 leading-[22px] font-medium text-base">
                            {data.title.length > 74 ? `${data.title.slice(0, 72)}...` : data.title}
                          </span>
                          <img loading="lazy" 
                            className="w-6 h-6 ml-0.5 cursor-pointer invert"
                            src="/images/tripledot.svg"
                            alt=""
                            width={24}
                            height={24}
                          />
                        </div>
                        <div className="flex items-center md:items-start flex-row md:flex-col">

                        <div className="flex items-center mt-1">
                          <span className="flex items-center font-normal text-[#949494] cursor-pointer text-sm leading-[20px]">
                            {data.details.username}
                            <img loading="lazy" 
                              className="w-3.5 h-3.5 ml-1 invert-[0.6]"
                              src="/images/tick.svg"
                              alt=""
                              width={14}
                              height={14}
                            />
                          </span>
                        </div>
                        <span className="text-[#949494] font-normal cursor-pointer text-sm leading-[20px] mt-1 ml-1 md:ml-0 md:mt-0">
                          {formatViewCount(data.views)} views • {timeAgo(data.createdAt)}
                        </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {Array.isArray(ytApiVideos)
                ? 
                ytApiVideos.length > 0 &&
                  ytApiVideos.map((data) => (
                    <Link to={`/watch/${data.id}`} onClick={handleVideoClick} key={data.id} className="no-underline md:w-[48%] lg:w-[32%]  w-full">
                      <div className="transition-transform duration-300 hover:scale-105">
                        <img loading="lazy" 
                          className="object-cover  max-h-[224px] w-full h-full  rounded-lg"
                          src={
                            data?.snippet?.thumbnails?.standard?.url ||
                            data?.snippet?.thumbnails?.maxres?.url ||
                            data?.snippet?.thumbnails?.high?.url
                          }
                          alt=""
                          width={343}
                          height={193}
                        />
                        <div className="flex mt-2 px-3">
                          <img loading="lazy" 
                            className="rounded-full min-w-[40px] w-[40px] max-h-[40px]"
                            src={channelImages[data?.snippet?.channelId] }
                            alt="Channel"
                            width={36}
                            height={36}
                          />
                          <div className="ml-3  w-full">
                            <div className="flex justify-between items-center">
                              <span className="cursor-pointer leading-[22px] font-medium text-base">
                                {data?.snippet?.title.length > 74
                                  ? `${data?.snippet?.title.slice(0, 72)}...`
                                  : data?.snippet?.title}
                              </span>
                              <img loading="lazy" 
                                className="w-6 h-6 ml-0.5 cursor-pointer invert"
                                src="/images/tripledot.svg"
                                alt=""
                                width={24}
                                height={24}
                              />
                            </div>
                            <div className="flex items-center mt-1">
                              <span className="flex items-center font-normal text-[#949494] cursor-pointer text-sm leading-[20px]">
                                {data?.snippet?.channelTitle}
                                <img loading="lazy" 
                                  className="w-3.5 h-3.5 ml-1 invert-[0.6]"
                                  src="/images/tick.svg"
                                  alt=""
                                  width={14}
                                  height={14}
                                />
                              </span>
                            </div>
                            <span className="text-[#949494] font-normal cursor-pointer text-sm leading-[20px]">
                              {formatViewCount(data?.statistics?.viewCount)} views •{" "}
                              {timeAgo(data?.snippet?.publishedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                : 
                Object.entries(ytApiVideos).map(([category,videos]) => (
                  <div className='flex flex-col ' key={category}>
                  <h1 className="text-white ml-2">{category}</h1>
                  {videos.length>0 && videos.map((data)=>(
                     <Link to={`/watch/${data.id}`} onClick={handleVideoClick}  key={data.id} className="no-underline md:w-[32%] w-full">
                     <div className="transition-transform duration-300 hover:scale-105">
                       <img loading="lazy" 
                         className="object-cover  max-h-[224px] w-full h-full  rounded-lg"
                         src={
                           data?.snippet?.thumbnails?.maxres?.url ||
                           data?.snippet?.thumbnails?.standard?.url ||
                           data?.snippet?.thumbnails?.high?.url
                         }
                         alt=""
                         width={343}
                         height={193}
                       />
                       <div className="flex mt-2 px-3">
                         <img loading="lazy" 
                           className="rounded-full min-w-[40px] w-[40px] max-h-[40px]"
                           src={channelImages[data?.snippet?.channelId] }
                           alt="Channel"
                           width={36}
                           height={36}
                         />
                         <div className="ml-3  w-full">
                           <div className="flex justify-between items-center">
                             <span className="cursor-pointer leading-[22px] font-medium text-base">
                               {data?.snippet?.title.length > 74
                                 ? `${data?.snippet?.title.slice(0, 72)}...`
                                 : data?.snippet?.title}
                             </span>
                             <img loading="lazy" 
                               className="w-6 h-6 ml-0.5 cursor-pointer invert"
                               src="/images/tripledot.svg"
                               alt=""
                               width={24}
                               height={24}
                             />
                           </div>
                           <div className="flex items-center mt-1">
                             <span className="flex items-center font-normal text-[#949494] cursor-pointer text-sm leading-[20px]">
                               {data?.snippet?.channelTitle}
                               <img loading="lazy" 
                                 className="w-3.5 h-3.5 ml-1 invert-[0.6]"
                                 src="/images/tick.svg"
                                 alt=""
                                 width={14}
                                 height={14}
                               />
                             </span>
                           <span className=" ml-2 text-[#949494] font-normal cursor-pointer text-sm leading-[20px]">
                             {/* {formatViewCount(data?.statistics?.viewCount)} views •{" "} */}
                             {timeAgo(data?.snippet?.publishedAt)}
                           </span>
                           </div>
                         </div>
                       </div>
                     </div>
                   </Link>
                  ))}
                </div>
                ))
                }
            </div>
          )}

          {isOpen && (

            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              
              <Aurora className='w-full h-full'
  colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
  speed={1}
  /> 
  <button

    onClick={closeModal}
    className="absolute top-20 right-8 bg-none border-none text-3xl cursor-pointer"
  >
      <img loading="lazy"  src="/images/escbtn.png" className="w-12 h-12" alt="" />  
  </button>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-20 rounded-lg text-center  max-w-[600px]">
               
                <h1 className="text-5xl leading-[40px] mb-12">What's Your Mood ?</h1>
                <div className="grid grid-cols-5 gap-6">
                  <span
                    role="img"
                    aria-label="happy"
                    title="Happy"
                    onClick={() => logMood("Happy")}
                    className="text-6xl cursor-pointer transition-transform transform hover:scale-125"
                  >
                    😊
                  </span>
                  <span
                    role="img"
                    aria-label="sad"
                    title="Sad"
                    onClick={() => logMood("Sad")}
                    className="text-6xl cursor-pointer transition-transform transform hover:scale-125"
                  >
                    😢
                  </span>
                  <span
                    role="img"
                    aria-label="angry"
                    title="Angry"
                    onClick={() => logMood("Angry")}
                    className="text-6xl cursor-pointer transition-transform transform hover:scale-125"
                  >
                    😠
                  </span>
                  <span
                    role="img"
                    aria-label="surprised"
                    title="Surprised"
                    onClick={() => logMood("Surprised")}
                    className="text-6xl cursor-pointer transition-transform transform hover:scale-125"
                  >
                    😲
                  </span>
                  <span
                    role="img"
                    aria-label="neutral"
                    title="Neutral"
                    onClick={() => logMood("Neutral")}
                    className="text-6xl cursor-pointer transition-transform transform hover:scale-125"
                  >
                    😐
                  </span>
                </div>
              </div>
            
            </div>
          )}
    </div>
  )
}

export default RightSide


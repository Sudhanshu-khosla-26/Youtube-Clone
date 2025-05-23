import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import ColorThief from "colorthief"
import moment from "moment"
import api from "../services/api.service";

const Playlist = () => {
  const [playlistData, setPlaylistData] = useState([])
  const { listquery } = useParams()
  const minimize = useSelector((state) => state.MinimizeState)
  const [gradient, setGradient] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [activeTag, setActiveTag] = useState("All")
  const [loading, setLoading] = useState(false)
  const User = JSON.parse(localStorage.getItem("USER"))

  console.log("render playlist")

  const handleAnalyzeImage = () => {
    if (!imageUrl) {
      alert("Please enter an image URL.")
      return
    }

    const img = new Image()
    img.crossOrigin = "Anonymous" // Fix CORS issues for external URLs
    img.src = imageUrl

    img.onload = () => {
      const colorThief = new ColorThief()
      try {
        // Extract 3 dominant colors (RGB format)
        const colors = colorThief.getPalette(img, 3)
        // Convert RGB to HEX
        const hexColors = colors.map((rgb) => rgbToHex(rgb))
        // Brighten the first color
        const brightenColor = (color) => {
          const brightenFactor = 1.2 // Adjust this factor to brighten the color more
          return color.map((c) => Math.min(Math.floor(c * brightenFactor), 255))
        }
        const brightenedFirstColor = rgbToHex(brightenColor(colors[0]))
        hexColors[0] = brightenedFirstColor
        // Darken the middle color
        const darkenColor = (color) => {
          const darkenFactor = 0.8 // Adjust this factor to darken the color more
          return color.map((c) => Math.floor(c * darkenFactor))
        }
        const darkenedMiddleColor = rgbToHex(darkenColor(colors[1]))
        hexColors[1] = darkenedMiddleColor
        // Ensure the third color is dark
        const darkColor = "#0F0F0F" // You can adjust this to any dark color you prefer
        hexColors[2] = darkColor
        // Create CSS gradient string
        const cssGradient = `linear-gradient(to bottom, ${hexColors[0]}, ${hexColors[1]}, ${hexColors[2]})`
        setGradient(cssGradient)
        setLoading(false)
      } catch (err) {
        console.error("Error extracting colors:", err)
        alert("Failed to analyze image.")
        setLoading(false)
      }
    }

    img.onerror = () => {
      alert("Failed to load the image. Check the URL or CORS permissions.")
      setLoading(false)
    }
  }

  const rgbToHex = (rgb) => {
    return `#${rgb.map((c) => c.toString(16).padStart(2, "0")).join("")}`
  }

  const getWLPlaylist = async () => {
    // in work
    //on login a playlist of watch later is created  if its not there
    //we will create a url to get watch later just like liked videos
    // then fetch it here
    //playlist/watchlater

    api
      .get("/playlist/watchlater")
      .then((response) => {
        // console.log(response);
        // setPlaylistData(response.data.data);
        const videoslist = response.data.data.videos
        const videoDataPromises = videoslist.map((videoId) => api.get(`/videos/${videoId}`))

        Promise.all(videoDataPromises)
          .then((responses) => {
            const videoData = responses.map((response) => response.data.data)
            setPlaylistData((playlistData.videos = videoData))
            // console.log(videoData);
            setImageUrl(videoData[0]?.thumbnail)
          })
          .catch((error) => {
            console.error("Error fetching video data:", error)
          })
      })
      .catch((error) => {
        console.error("Error fetching playlist data:", error)
      })
  }

  const getLLPlaylist = async () => {
    const accessToken = JSON.parse(localStorage.getItem("USER"))?.accessToken
    const headers = {
      Authorization: accessToken,
      Accept: "application/json",
    }
    api
      .get("/likes/videos")
      .then((response) => {
        setPlaylistData(response.data.data.reverse())
        setImageUrl(response.data.data[0]?.thumbnail)
      })
      .catch((error) => {
        console.error("Error fetching playlist data:", error)
      })
  }

  useEffect(() => {
    if (listquery === "LL") {
      getLLPlaylist()
    } else if (listquery === "WL") {
      getWLPlaylist()
    } else {
      console.log("else")
    }

    console.log("render  2 playlist")
  }, [listquery])

  useEffect(() => {
    if (imageUrl) {
      handleAnalyzeImage()
    }
  }, [imageUrl])

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

    if (diffInSeconds < 60) {
      return "now"
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours > 1 ? "s" : ""} ago`
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days > 1 ? "s" : ""} ago`
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000)
      return `${months} month${months > 1 ? "s" : ""} ago`
    } else {
      const years = Math.floor(diffInSeconds / 31536000)
      return `${years} year${years > 1 ? "s" : ""} ago`
    }
  }

  const videoViewUpdate = (videoId) => {
    api
      .patch(`/videos/view/${videoId}`, {})
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  console.log(gradient)

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div
      className={`flex absolute top-0  w-screen  ${minimize ? "md:w-[82vw] md:left-[240px]" : "md:w-[94vw] md:left-[80px]"} h-[90vh] flex-col md:flex-row mt-[56px] pt-[24px]`}
    >
      <div
        className={`playlistinfo w-full md:w-fit h-[98%] rounded-xl p-[24px] ${gradient}`}
        style={{ background: gradient }}
      >
        <div className="relative w-[312px]">
          <img
            className="w-[312px] h-[175.5px] rounded-xl"
            src={playlistData[0]?.thumbnail || "/placeholder.svg"}
            alt=""
          />
          <div className="rounded-xl cursor-pointer absolute gap-1 top-0 opacity-0 hover:opacity-100 w-[312px] h-[175.5px] flex text-[12px] leading-[18px] font-bold text-[#fff] justify-center items-center bg-[rgba(0,0,0,0.5)]">
            <img className="w-[24px] h-[24px] invert" src="/images/Play.svg" alt="" />
            PLAY ALL
          </div>
        </div>
        <h1 className="font-[700] leading-[38px] text-[28px] text-[#fff] mt-6">
          {listquery === "WL" ? "Watch Later" : "Liked videos"}
        </h1>
        <span className="owenerdetials font-bold leading-[20px] text-[14px] text-[#fff] mt-4">
          {User.user.username} <br />
          <pre className="font-medium leading-[18px] text-[12px] text-[#ffffffb3]">
            {playlistData?.length} videos No views Updated yesterday
          </pre>
        </span>
        <div className="my-4 flex items-center gap-4">
          <button className="bg-[rgba(255,255,255,0.1)] p-2 rounded-full">
            <img src="/images/Download.svg" alt="" className="invert" />
          </button>
          <button className="bg-[rgba(255,255,255,0.1)] p-2 rounded-full">
            <img src="/images/tripledot.svg" alt="" className="invert" />
          </button>
        </div>
        <div className="font-medium leading-[36px] text-[14px] flex items-center gap-[10px]">
          <button className="text-[#000] flex justify-center items-center bg-white px-[34px] rounded-2xl">
            <img src="/images/Play.svg" alt="" />
            Play all
          </button>
          <button className="text-[#fff] flex justify-center items-center bg-[rgba(255,255,255,0.1)] backdrop-blur-lg px-[34px] rounded-2xl">
            <img className="invert w-[24px] h-[24px]" src="/images/Shuffle.svg" alt="" />
            Shuffle
          </button>
        </div>
      </div>
      <div className="playlistitems p-0 pb-[20px] w-full md:p-[20px]">
        <div className="tags ml-4 mt-1 flex overflow-x-scroll whitespace-nowrap">
          {["All", "Videos", "Shorts"].map((tag, index) => (
            <button
              key={index}
              className={`w-max cursor-pointer text-center px-3 leading-5 text-sm bg-[#272727] font-semibold font-sans border-none h-8 rounded-lg mx-1 my-3 hover:bg-[#3F3F3F] ${activeTag === tag ? "bg-white text-black hover:bg-white " : ""}`}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        <ul className="flex flex-col w-full h-fit overflow-hidden flex-grow md:h-[94%] md:overflow-y-scroll md:scrollbar-hide">
          {playlistData.length > 0 &&
            playlistData.map((data, index) => (
              <a
                href={`/watch/${data._id}`}
                key={index}
                onClick={() => {
                  videoViewUpdate(data._id)
                }}
                className={`no-underline mx-[7.3px] my-[10px] flex items-center justify-between `}
              >
                <span className={`hidden md:block ${listquery === "WL" ? "text-[35px]  scale-y-75 scale-x-150" : ""}`}>
                  {listquery === "WL" ? "=" : index + 1}
                </span>
                <li className="flex flex-grow h-fit list-none ml-3.5 cursor-pointer">
                  <img
                    className="h-[113px] object-cover min-w-[200px] max-w-[200px] rounded-2xl"
                    src={data?.thumbnail || "/placeholder.svg"}
                    alt=""
                  />
                  <div className="videoInfo  flex md:flex-grow mt-1.5">
                    <div className="Info flex-col flex-grow w-full ml-3.5 flex items-start justify-start">
                      <div className="title flex w-full items-start justify-between">
                        <span className="cursor-pointer line-clamp-3 w-11/12 leading-5 font-medium text-lg">{data.title}</span>
                        <img className="w-6 h-6 ml-0.5 cursor-pointer invert" src="/images/tripledot.svg" alt="" />
                      </div>
                      <div className="channelname flex items-start mt-2">
                        <span className="flex items-center font-normal text-[#949494] cursor-pointer text-sm leading-5">
                          {data?.owner?.username}
                          {/* <img className="w-3.5 h-3.5 ml-1 invert-[0.6]" src="/images/tick.svg" alt="" /> */}
                        </span>
                      </div>
                      <span className="hidden md:block viewAndTime text-[#949494] font-normal cursor-pointer text-sm leading-5">
                        {formatViewCount(data?.views)} views • {timeAgo(data?.createdAt)}
                      </span>
                    </div>
                  </div>
                </li>
              </a>
            ))}
        </ul>
      </div>
    </div>
  )
}

export default Playlist


import { useState, useEffect } from "react"
import LeftSide from "./LeftSide"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import moment from "moment"
import api from '../services/api.service';

const Button = ({ children, className, ...props }) => (
    <button className={`px-4 py-2 rounded-full ${className}`} {...props}>
        {children}
    </button>
)

const TabsTrigger = ({ children, isActive, ...props }) => (
    <button
        className={`py-2 mx-2 ${isActive ? "text-white border-b-2 border-white" : "text-gray-400 hover:text-white"}`}
        {...props}
    >
        {children}
    </button>
)


const YouTubeChannel = () => {
    // const [isExpanded, setIsExpanded] = useState(false)
    const [activeTab, setActiveTab] = useState("videos")
    const [showPopup, setShowPopup] = useState(false)
    const minimize = useSelector((state) => state.MinimizeState);
    const { username } = useParams();
    console.log(username);
    const [channelStats, setChannelStats] = useState([]);
    const [channelDetails, setChannelDetails] = useState([]);
    const [channelVideos, setChannelVideos] = useState([]);
    const user = JSON.parse(localStorage.getItem('USER'));

    const getChannelStats = async () => {
        try {
            const response = await api.get(`/dashboard/stats/${username}`);
            setChannelStats(response.data.data);
        } catch (error) {
            console.error('Error fetching channel stats:', error);
        }
    };

    const getChannelDetails = async () => {
        try {
            const response = await api.get(`/dashboard/${username}`);
            setChannelDetails(response.data.data);
        } catch (error) {
            console.error('Error fetching channel details:', error);
        }
    };

    const getChannelVideos = async () => {
        try {
            const response = await api.get(`/dashboard/videos/${username}`);
            setChannelVideos(response.data.data);
        } catch (error) {
            console.error('Error fetching channel videos:', error);
        }
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
            await api.patch(`/videos/view/${videoId}`, {});
        } catch (error) {
            console.error('Error updating video view:', error);
        }
    };

    useEffect(() => {
        getChannelDetails();
        getChannelStats();
        getChannelVideos();
    }, [username]);

    console.log(channelStats, channelDetails, channelVideos);

    return (
        <div className="">
            <LeftSide />
            <div className={`flex absolute top-0 ${minimize ? 'w-[82vw] left-[240px]' : 'w-[94vw] left-[80px]'} h-[90vh] flex-col mt-[56px] pt-[24px]`}>
                {/* Channel Header */}
                <div className="p-6">
                    <div className="flex items-start gap-6">
                        {/* Profile Picture */}
                        <div className="flex-shrink-0">
                            <img
                                src={channelDetails?.avatar}
                                alt="Channel avatar"
                                className="h-[160px] w-[160px] rounded-full object-cover"
                            />
                        </div>

                        {/* Channel Info */}
                        <div className="flex-grow">
                            <h1 className="text-[36px] leading-[50px] font-bold mb-1">{channelDetails?.fullname}</h1>
                            <p className="text-[#aaa] text-sm mb-2">
                                <span className="text-white cursor-pointer mr-2">
                                    @{channelDetails?.username}
                                </span>
                                • {channelStats?.subscribers} subscribers • {channelStats?.totalVideos} videos</p>
                            <div className="text-[#aaa] text-[14px] leading-[16px] font-normal mb-4 flex items-center gap-2 ">
                                <p className="line-clamp-1 text-[#aaa]">
                                    More about this channel
                                </p>
                                <button className="text-white hover:text-white mt-1" onClick={() => setShowPopup(true)}>
                                    ...more
                                </button>
                            </div>

                            {/* Channel Actions */}
                            <div className="flex gap-4">
                                <Button className="bg-[#272727] text-white hover:bg-[#3F3F3F]">Customise channel</Button>
                                <Button className="bg-[#272727] text-white hover:bg-[#3F3F3F]">Manage videos</Button>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Navigation */}
                <div className="border-b ml-4 border-zinc-800">
                    <div className="flex h-16 items-center">
                        <TabsTrigger isActive={activeTab === "videos"} onClick={() => setActiveTab("videos")}>
                            Videos
                        </TabsTrigger>
                        <TabsTrigger isActive={activeTab === "playlists"} onClick={() => setActiveTab("playlists")}>
                            Playlists
                        </TabsTrigger>
                        <TabsTrigger isActive={activeTab === "community"} onClick={() => setActiveTab("community")}>
                            Community
                        </TabsTrigger>
                        <button className="ml-4 p-2 rounded-full bg-zinc-800 hover:bg-zinc-700" >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>


                <div className="p-6 flex flex-wrap gap-4">
                    {/* Video 1 */}
                    {channelVideos && channelVideos.map((data, index) => (
                        <a href={`/watch/${data._id}`} key={index} onClick={() => videoViewUpdate(data._id)} >
                            <div className="relative group max-w-[251px]" >
                                <div className="relative">
                                    <img src={data?.thumbnail} alt="Video thumbnail" className="w-full  rounded-lg" />
                                    <span className="absolute bottom-2 right-2 bg-black/80 px-1 rounded text-xs">1:40</span>
                                </div>
                                <div className="mt-3 flex justify-between text-[14px]">
                                    <div>
                                        <h3 className="font-medium">{data.title.length > 56 ? `${data.title.slice(0, 56)}...` : data.title}</h3>
                                        <p className="text-sm text-gray-400">{formatViewCount(data?.views)} views • {timeAgo(data?.createdAt)}</p>
                                    </div>
                                    <button className="h-8 w-8 flex items-center justify-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            className="w-5 h-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </a>

                    ))}

                </div>

                {/* Popup */}
                {showPopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-[#212121] p-6 rounded-lg max-w-md w-full">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className=" leading-[28px] text-[20px] font-bold">About</h2>
                                <button onClick={() => setShowPopup(false)} className="text-gray-400 hover:text-white">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="space-y-2 leading-[20px] text-[14px] font-normal text-[#f1f1f1] ">
                                <p className="text-[20px] leading-[28px] font-bold mt-8 mb-2">
                                    Channel details
                                </p>
                                <p className="flex items-center gap-2 py-1">
                                    <img src="/images/Call.svg" alt="" className="invert" />
                                    Phone verified
                                    <img src="/images/joined.svg" alt="" className="invert" />
                                </p>
                                <p className="flex items-center gap-2  leading-[20px] text-[14px] font-normal text-[#f1f1f1] py-1">
                                    <img src="/images/global.svg" alt="" className="invert" />
                                    www.youtube.com/@{channelDetails.username}
                                </p>
                                <p className="flex items-center gap-2  leading-[20px] text-[14px] font-normal text-[#f1f1f1] py-1">
                                    <img src="/images/subscriber.svg" alt="" className="invert" />
                                    {channelStats?.subscribers} subscribers
                                </p>
                                <p className="flex items-center gap-2  leading-[20px] text-[14px] font-normal text-[#f1f1f1] py-1">
                                    <img src="/images/yourvideos.svg" alt="" className="invert" />
                                    {channelStats?.totalVideos} videos
                                </p>
                                <p className="flex items-center gap-2  leading-[20px] text-[14px] font-normal text-[#f1f1f1] py-1">
                                    <img src="/images/sharelogo.svg" alt="" className="invert" />
                                    {channelStats?.totalViews} views
                                </p>
                                <p className="flex items-center gap-2  leading-[20px] text-[14px] font-normal text-[#f1f1f1] py-1">
                                    <img src="/images/joined.svg" alt="" className="invert" />
                                    Joined 30 Jul 2017
                                </p>
                            </div>
                            <button className="mt-4  bg-zinc-800 hover:bg-zinc-700 text-white px-4  text-[14px] leading-[36px] font-medium  flex justify-center items-center gap-2  rounded-3xl">
                                <img src="/images/Call.svg" alt="" className="invert" />
                                Share channel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>

    )
}

export default YouTubeChannel


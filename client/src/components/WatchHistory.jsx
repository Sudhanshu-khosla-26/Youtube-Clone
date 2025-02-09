import { useState, useEffect } from 'react';
// import moment from 'moment';
import { useSelector } from 'react-redux';
import LeftSide from './LeftSide';
import api from "../services/api.service";


const WatchHistory = () => {
    const [PlaylistData, setPlaylistData] = useState([])
    const Minimize = useSelector((state) => state.MinimizeState);

    const getWHPlaylist = async () => {
        api.get('/users/current-user')
            .then(response => {
                //get watchhistory video id and then fetch all the video and add them to array 
                // console.log(response);
                const watchhistory = response.data.data.watchHistory;
                // console.log(watchhistory);
                let uniqueVideoIds = [];
                if (Array.isArray(watchhistory)) {
                    uniqueVideoIds = Array.from(new Set(watchhistory.reverse()));
                    // console.log(uniqueVideoIds);
                } else {
                    console.error('watchhistory is not an array:', watchhistory);
                }

                const videoDataPromises = uniqueVideoIds.map(videoId =>
                    api.get(`/videos/${videoId}`)
                );

                Promise.all(videoDataPromises)
                    .then(responses => {
                        const videoData = responses.map(response => response.data.data);
                        setPlaylistData(videoData);
                        // console.log(responses.data);
                    })
                    .catch(error => {
                        console.error('Error fetching video data:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching playlist data:', error);
            });
    }

    const formatViewCount = (count) => {
        if (count < 1000) return count;
        if (count <= 1000000) return (count / 1000).toFixed(1) + ' K';
        if (count <= 1000000000) return (count / 1000000).toFixed(1) + ' M';
        return (count / 1000000000).toFixed(1) + ' B';
    };

    // const timeAgo = (date) => {
    //     const now = moment();
    //     const inputDate = moment(date);
    //     const diffInSeconds = now.diff(inputDate, 'seconds');

    //     if (diffInSeconds < 60) {
    //         return 'now';
    //     } else if (diffInSeconds < 3600) {
    //         const minutes = Math.floor(diffInSeconds / 60);
    //         return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    //     } else if (diffInSeconds < 86400) {
    //         const hours = Math.floor(diffInSeconds / 3600);
    //         return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    //     } else if (diffInSeconds < 2592000) {
    //         const days = Math.floor(diffInSeconds / 86400);
    //         return `${days} day${days > 1 ? 's' : ''} ago`;
    //     } else if (diffInSeconds < 31536000) {
    //         const months = Math.floor(diffInSeconds / 2592000);
    //         return `${months} month${months > 1 ? 's' : ''} ago`;
    //     } else {
    //         const years = Math.floor(diffInSeconds / 31536000);
    //         return `${years} year${years > 1 ? 's' : ''} ago`;
    //     }
    // };

    const videoViewUpdate = (VideoId) => {

        console.log(VideoId);
        api.patch(`/videos/view/${VideoId}`, {})
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        getWHPlaylist();
    }, [])



    return (
        <>
            <LeftSide />
            <div className={`flex absolute top-0 ${Minimize ? 'w-[82vw] left-[240px]' : 'w-[94vw] left-[80px]'} h-[90vh] flex-row justify-evenly mt-[56px] `}>
                <div className="playlistitems w-full p-[20px] ">
                    <h1 className="leading-[50px] font-bold text-[36px] pl-[20px] pb-[20px] ">Watch history</h1>
                    <ul className={`flex flex-col  ${Minimize ? 'w-10/12' : 'w-9/12'} flex-grow h-[92%] overflow-y-scroll scrollbar-hide`}>
                        {PlaylistData.length > 0 && PlaylistData.map((Data, index) => (
                            <a href={`/watch/${Data._id}`} key={index}
                                onClick={() => { videoViewUpdate(Data._id) }}
                                className="no-underline mx-[7.3px] my-[10px] flex items-center justify-between">
                                <li className='flex flex-grow h-fit list-none ml-3.5 cursor-pointer'>
                                    <img className="h-[138px] object-cover min-w-[246px] max-w-[246px] rounded-2xl" src={Data?.thumbnail} alt="" />
                                    <div className="videoInfo flex flex-grow mt-1.5">
                                        <div className="Info flex-col flex-grow w-full ml-3.5 flex items-start justify-start">
                                            <div className="title flex  w-full items-start justify-between">
                                                <span className="cursor-pointer w-9/12 leading-5 font-medium text-lg">{Data.title}</span>
                                                <img title='Remove from watch history' className="w-4 h-4 ml-4 mt-1 cursor-pointer invert" src="/images/cancel.png" alt="" />
                                                <img className="w-6 h-6 ml-0.5 cursor-pointer invert" src="/images/tripledot.svg" alt="" />
                                            </div>
                                            <div className="channelname flex  items-start mt-2">
                                                <span className="flex items-center font-normal text-[#949494] cursor-pointer text-sm leading-5">
                                                    {Data?.owner?.username}
                                                    <img className="w-3.5 h-3.5 ml-1 invert-[0.6]" src="/images/tick.svg" alt="" />
                                                </span>
                                                <span className='viewAndTime text-[#949494] ml-2 font-normal cursor-pointer text-sm leading-5'>
                                                    {formatViewCount(Data?.views)} views
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </a>
                        ))}
                    </ul>
                </div>
                <div className={`playlistinfo w-[385px] h-[98%] text-start p-[24px] `}>
                    hello
                </div>
            </div>
        </>
    )
}

export default WatchHistory

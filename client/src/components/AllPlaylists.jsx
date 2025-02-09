import { useEffect, useState } from 'react'
import LeftSide from './LeftSide';
import { useSelector } from 'react-redux';
import api from '../services/api.service';

const AllPlaylists = () => {
    const user = JSON.parse(localStorage.getItem('USER'));
    const [sortOrder, setSortOrder] = useState("A-Z");
    const minimize = useSelector((state) => state.MinimizeState);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [playlists, setplaylists] = useState([]);


    // const getownerdetaiils = (videoid) => {
    //     const accessToken = user?.accessToken
    //     const headers = {
    //         Authorization: accessToken,
    //         Accept: "application/json",
    //     }
    // }



    const getuserplaylists = () => {
        api.get(`/playlist/user/${user.user._id}`)
            .then((response) => {
                console.log(response.data.data)
                setplaylists(response.data.data)
            })
            .catch((error) => {
                console.error("Error fetching user playlists:", error)
            })
    }


    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };


    useEffect(() => {
        getuserplaylists();
    }, [])

    
    return (
        <div className="flex flex-row ">
            <LeftSide />
            <div className={`flex absolute top-0 ${minimize ? 'w-[82vw] left-[240px]' : 'w-[94vw] left-[80px]'} h-[90vh] flex-col mt-[56px] pt-[24px]`}>
                <div className="flex flex-col items-start ml-3 mb-6">
                    <h1 className="text-[36px] leading-[50px]  font-bold">Playlists</h1>
                    <div className="relative mt-4 bg-[#272727] py-1 px-[10px] rounded-lg">
                        <button
                            onClick={toggleDropdown}
                            className="flex justify-between items-center text-[14px] leading-[20px] font-medium text-white border-neutral-700 hover:bg-neutral-800"
                        >
                            {sortOrder}
                            <svg
                                className="ml-2 h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute rounded-lg  z-10 text-white left-1 right-0 mt-2 w-48 bg-[#282828] border border-neutral-700">
                                <button
                                    onClick={() => {
                                        setSortOrder("A-Z");
                                        setIsDropdownOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-white hover:bg-neutral-700"
                                >
                                    A-Z
                                </button>
                                <button
                                    onClick={() => {
                                        setSortOrder("Z-A");
                                        setIsDropdownOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-white hover:bg-neutral-700"
                                >
                                    Z-A
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 ml-3 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {playlists.map((playlist) => (
                        <a href='#' key={playlist._id} className={`group  ${minimize ? "w-[253px]" : "w-[295px]"}  max-w-[295px] `}>
                            {/* Thumbnail */}
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-800 mb-3">
                                <img
                                    src={playlist.details[0]?.thumbnail || "/images/youtube-no-img.jpg"}
                                    alt={playlist.name}
                                    className="w-full max-h-[166px] h-full object-cover"
                                />
                                <div className="absolute flex justify-center items-center inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <img className="w-[24px] h-[24px] invert" src="/images/Play.svg" alt="" />
                                    Play all
                                    {/* <svg
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="12" y1="8" x2="12" y2="16"></line>
                                        <line x1="8" y1="12" x2="16" y2="12"></line>
                                    </svg> */}
                                </div>
                                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0 text-[10px] font-normal  rounded flex items-center justify-center" >
                                    <img src="/images/playlists.svg" alt="" className='invert w-[12px] h-[12px] mr-1' />
                                    <span className='text-[12px] mr-1'>
                                        {playlist.videos.length}
                                    </span>
                                    {playlist.videos.length === 0 ? "No videos" : playlist.videos.length === 1 ? "video" : "videos"}
                                </div>
                            </div>

                            {/* Content */}
                            <div div className="flex gap-2" >
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-[14px] leading-[20px] line-clamp-2 mb-1">{playlist.name}</h3>
                                    <div className="flex items-center gap-1">
                                        <span className='text-[14px] leading-[20px] fonr-normal hover:text-white text-neutral-400'>
                                            {playlist.creator || "sudhanshu khosla"}
                                        </span>
                                        {/* {playlist.isVerified && (
                                                <svg
                                                    className="w-4 h-4 text-neutral-400"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                </svg>
                                            )} */}
                                        <span className='text-neutral-400 text-sm'>•</span>
                                        <span className='text-neutral-400  text-[14px] leading-[20px] fonr-normal hover:text-white'>playlist</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-neutral-400 text-sm">
                                        <button className="hover:text-white ">View full playlist</button>
                                    </div>
                                </div>

                            </div>
                        </a>
                    ))}
                </div>
            </div >
        </div >
    )
}

export default AllPlaylists

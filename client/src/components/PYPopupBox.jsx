import { useState, useEffect } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"

const PYPopupBox = (props) => {
    const [isOpen, setIsOpen] = useState(true)
    const [items, setItems] = useState([])
    const { VideoId } = useParams()
    const [isOpened, setIsOpened] = useState(false);
    const [title, setTitle] = useState("");
    const [visibility, setVisibility] = useState("private");
    const [isSelectOpen, setIsSelectOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem("USER"))

    const getuserplaylists = () => {
        const accessToken = user?.accessToken
        const headers = {
            Authorization: accessToken,
            Accept: "application/json",
        }
        axios
            .get(`http://localhost:8000/api/v1/playlist/user/${user.user._id}`, { headers })
            .then((response) => {
                const data = response.data.data
                data.forEach((item) => {
                    setItems((prevItems) => {
                        if (!prevItems.some((prevItem) => prevItem.id === item._id)) {
                            return [...prevItems, { id: item._id, label: item.name, checked: item.videos.includes(VideoId) }]
                        }
                        return prevItems
                    })
                })
                console.log(response.data.data)
            })
            .catch((error) => {
                console.error("Error fetching user playlists:", error)
            })
    }

    const addvideotoplaylist = (playlistid) => {
        const accessToken = user?.accessToken
        const headers = {
            Authorization: accessToken,
            Accept: "application/json",
        }
        axios
            .patch(`http://localhost:8000/api/v1/playlist/add/${VideoId}/${playlistid}`, {}, { headers })
            .then((response) => {
                console.log("Video added to playlist:", response.data)
            })
            .catch((error) => {
                console.error("Error adding video to playlist:", error)
            })
    }

    const removevideofromplaylist = (playlistid) => {
        const accessToken = user?.accessToken
        const headers = {
            Authorization: accessToken,
            Accept: "application/json",
        }
        axios
            .patch(`http://localhost:8000/api/v1/playlist/remove/${VideoId}/${playlistid}`, {}, { headers })
            .then((response) => {
                console.log("Video removed from playlist:", response.data)
            })
            .catch((error) => {
                console.error("Error removing video from playlist:", error)
            })
    }

    const createPlaylist = (name) => {
        const accessToken = user?.accessToken
        const headers = {
            Authorization: accessToken,
            Accept: "application/json",
        }
        axios.post(`http://localhost:8000/api/v1/playlist/`, {
            "name": name,
            "description": ""
        },
            { headers })
            .then((response) => {
                console.log("Playlist created:", response.data)
                // getuserplaylists()
                setIsOpened(false);
                setIsOpen(false);
                setTitle("");
            })
            .catch((error) => {
                console.error("Error creating playlist:", error)
            })
    }

    // const [showCreateForm, setShowCreateForm] = useState(false)
    // const [newPlaylistName, setNewPlaylistName] = useState("")
    // const [newPlaylistDescription, setNewPlaylistDescription] = useState("")
    // Remove unused state
    // const [newPlaylistVisibility, setNewPlaylistVisibility] = useState("public");
    // const [newPlaylistCollaborate, setNewPlaylistCollaborate] = useState(false);

    // Update the handleCreatePlaylist function

    // const handleCreatePlaylist = () => {
    //     // if (newPlaylistName.trim() && newPlaylistDescription.trim()) {
    //     //     createPlaylist(newPlaylistName, newPlaylistDescription)
    //     //     setShowCreateForm(false)
    //     //     setNewPlaylistName("")
    //     //     setNewPlaylistDescription("")
    //     // }
    // }

    useEffect(() => {
        getuserplaylists()
    }, [])

    const toggleItem = (id) => {
        setItems(
            items.map((item) => {
                if (item.id === id) {
                    const newItem = { ...item, checked: !item.checked }
                    if (newItem.checked) {
                        addvideotoplaylist(id)
                    } else {
                        removevideofromplaylist(id)
                    }
                    return newItem
                }
                return item
            }),
        )
    }

    return (
        <div className="h-1/5 bg-gray-900 flex items-center justify-center">
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    {isOpened ?
                        (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                                <div className="bg-[#212121] w-[320px] px-4 rounded-lg shadow-xl transform transition-all duration-300 scale-100" role="dialog" aria-modal="true">
                                    {/* Dialog content */}
                                    <div className="p-6">
                                        <h2 className="text-[20px] leading-[28px] font-bold  mb-6">New playlist</h2>

                                        <div className="space-y-6 ">
                                            <textarea
                                                type="text"
                                                placeholder="Choose a title"
                                                value={title}
                                                onChange={(e) => {
                                                    // e.preventDefault();
                                                    setTitle(e.target.value);
                                                    e.target.style.height = "auto";
                                                    e.target.style.height = e.target.scrollHeight + "px";
                                                }}
                                                className="resize-none h-auto max-h-[260px]  w-full  px-[8px] pt-[12px] pb-[24px] bg-zinc-800 border border-zinc-700 rounded-md text-[16px] leading-[22px] font-normal  placeholder:text-zinc-400 focus:outline-none focus:border-blue-500"
                                            />

                                            <div className="space-y-2">
                                                <div className="relative">
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsSelectOpen(!isSelectOpen)}
                                                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white flex items-center justify-between"
                                                    >
                                                        <span className="flex flex-col text-[16px] leading-[22px] font-normal items-start ">
                                                            <label className="text-[12px] leading-[18px] font-normal text-[#aaa] ">Visibility</label>
                                                            {/* {visibility === 'private' && (
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                                </svg>
                                                            )}
                                                            {visibility === 'unlisted' && (
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                                </svg>
                                                            )}
                                                            {visibility === 'public' && (
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            )} */}
                                                            {visibility.charAt(0).toUpperCase() + visibility.slice(1)}
                                                        </span>
                                                        <svg className="h-3 w-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                    </button>

                                                    {isSelectOpen && (
                                                        <div className="absolute z-10 top-full left-0 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg">
                                                            <button
                                                                onClick={() => { setVisibility('private'); setIsSelectOpen(false); }}
                                                                className="w-full px-3 py-2 flex items-center gap-2 hover:bg-zinc-700 text-left"
                                                            >
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                                </svg>
                                                                <div className="flex flex-col">
                                                                    <span>Private</span>
                                                                    <span className="text-xs text-zinc-400">Only you can view</span>
                                                                </div>
                                                            </button>
                                                            <button
                                                                onClick={() => { setVisibility('unlisted'); setIsSelectOpen(false); }}
                                                                className="w-full px-3 py-2 flex items-center gap-2 hover:bg-zinc-700 text-left"
                                                            >
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                                </svg>
                                                                <div className="flex flex-col">
                                                                    <span>Unlisted</span>
                                                                    <span className="text-xs text-zinc-400">Anyone with the link can view</span>
                                                                </div>
                                                            </button>
                                                            <button
                                                                onClick={() => { setVisibility('public'); setIsSelectOpen(false); }}
                                                                className="w-full px-3 py-2 flex items-center gap-2 hover:bg-zinc-700 text-left"
                                                            >
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                <div className="flex flex-col">
                                                                    <span>Public</span>
                                                                    <span className="text-xs text-zinc-400">Anyone can search for and view</span>
                                                                </div>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-2 pt-4">
                                                <button
                                                    onClick={() => setIsOpened(false)}
                                                    className="px-4 py-2 text-blue-400 hover:bg-blue-400/10 rounded-md transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    disabled={!title.trim()}
                                                    onClick={() => { createPlaylist(title) }}
                                                    className="px-4 py-2 text-blue-400 hover:bg-blue-400/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Create
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                        :
                        (
                            <div className="bg-[#212121] w-[232px] px-4 rounded-lg overflow-hidden shadow-xl transform transition-all duration-300 scale-100">
                                <div className="flex items-center justify-between py-3  ">
                                    <h2 className="text-[14px] leading-[22px] font-normal text-white">Save video to...</h2>
                                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </div>

                                <div className="">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center space-x-3 px-3  rounded-lg transition-colors overflow-y-scroll "
                                        >
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={item.id}
                                                    checked={item.checked}
                                                    onChange={() => toggleItem(item.id)}
                                                    className="w-4 h-4 opacity-0 absolute"
                                                />
                                                <div
                                                    className={`w-[20px] h-[20px] border-2 ${item.checked ? "bg-blue-500 border-blue-500" : "border-white"} rounded flex items-center justify-center`}
                                                >
                                                    {item.checked && (
                                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex  w-full items-center">
                                                <label
                                                    htmlFor={item.id}
                                                    className="text-[14px] flex-1 leading-[24px] font-normal text-white cursor-pointer"
                                                >
                                                    {item.label}
                                                </label>
                                                <div className="ml-auto">
                                                    <button className="h-8 w-8 text-gray-400 hover:text-white transition-colors">
                                                        <img className="invert" src="/images/lock.svg" alt="" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4">
                                    {/* Replace the "Create new playlist" button onClick handler */}
                                    <button
                                        className="w-full text-[14px] leading-[36px] font-medium text-white bg-[#383838] hover:bg-[#4d4d4d] py-0 px-4 rounded-3xl flex items-center justify-center transition-colors"
                                        onClick={() => setIsOpened(true)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-5 w-5 mr-2"
                                        >
                                            <path d="M12 5v14" />
                                            <path d="M5 12h14" />
                                        </svg>
                                        New playlist
                                    </button>
                                    {/* Add the create playlist form */}

                                </div>
                            </div>
                        )}
                </div>
            )}
        </div>
    )
}

export default PYPopupBox


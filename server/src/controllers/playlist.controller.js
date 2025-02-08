import mongoose, { isValidObjectId } from "mongoose"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Playlist } from "../models/playlist.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name } = req.body
    //TODO: create playlist 

    const description = " ";

    if (!name) {
        throw new ApiError(400, "All fields are required.")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: new mongoose.Types.ObjectId(`${req.user?._id}`)
    })

    if (!playlist) {
        throw new ApiError(501, "Error while creating playlist")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Playlist created successfully")
        )

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    //TODO: get user playlists

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user Id")
    }

    const playlists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(`${userId}`)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "details",
                pipeline: [
                    {
                        $project: {
                            thumbnail: 1
                        }
                    }
                ]
            }
        }
    ])

    return res
        .status(200)
        .json(
            playlists.length ?
                new ApiResponse(200, playlists, "User playlist data fetched succesfully.")
                :
                new ApiResponse(200, playlists, "No playlist found.")
        )

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    //TODO: get playlist by id

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Success")
        )

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!isValidObjectId(playlistId) && !isValidObjectId(videoId)) {
        throw new ApiError(401, "Invalid PlaylistID and videoID")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(400, "Cannout find playlist")
    }

    const responce = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet: {
                videos: videoId
            }
        },
        {
            new: true
        }
    )

    if (!responce) {
        throw new ApiError(500, "Something went wrong while adding Video to playlist.")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, responce, "Video added to playlist succesfully.")
        )

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist

    if (!isValidObjectId(playlistId) && !isValidObjectId(videoId)) {
        throw new ApiError(401, "Invalid PlaylistID and videoID")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(400, "Cannout find playlist")
    }

    const responce = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: {
                videos: {
                    $in: [`${videoId}`]
                }
            }
        },
        {
            new: true
        }
    )

    if (!responce) {
        throw new ApiError(500, "Something went wrong while adding Video to playlist.")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, responce, "Video added to playlist succesfully.")
        )

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(401, "Invalid PlaylistID")
    }

    const deletedplaylist = await Playlist.findByIdAndDelete(playlistId)

    if (!deletedplaylist) {
        throw new ApiError(500, "something went wrong when deleting playlist")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, deletedplaylist, "Playlist deleted succesfully.")
        )

})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    //TODO: update playlist

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(401, "Invalid PlaylistID")
    }

    if (!name && !description) {
        throw new ApiError(401, "Atleast on of the field is required")
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name,
                description
            }
        }, { new: true }
    )

    if (!playlist) {
        throw new ApiError(500, "Something went wrong while updating playlist.")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Playlist updates succesfully.")
        )

})

const getWatchLater = asyncHandler(async (req, res) => {

    if (!isValidObjectId(req.user._id)) {
        throw new ApiError(401, "Invalid userId")
    }

    const playlist = await Playlist.findOne({ owner: req.user?._id, name: "Watch Later" });


    if (!playlist) {
        throw new ApiError(404, "Watch Later playlist not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Watch Later playlist fetched successfully.")
        )

})




export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
    getWatchLater
}


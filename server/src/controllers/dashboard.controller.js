import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscriptions.model.js";
import { Like } from "../models/like.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  let { username } = req.params;
  if (!username) throw new ApiError(404, "Invalid channel");

  // Decode the username and trim any leading or trailing spaces
  username = decodeURIComponent(username).trim();

  const channel = await User.findOne({ username }).select('-password');

  if (!channel?._id) throw new ApiError(404, "Unauthorized request");

  const userId = channel?._id;

  const channelStats = await Video.aggregate([
    { $match: { owner: userId } },
    // Lookup for Subscribers of a channel
    {
      $lookup: {
        from: "subscriptions",
        localField: "owner",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    // Lookup for the channel which the owner Subscribe
    {
      $lookup: {
        from: "subscriptions",
        localField: "owner",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    // Lookup likes for the user's videos
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likedVideos",
      },
    },
    // Lookup comments for the user's videos
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "videoComments",
      },
    },
    // Lookup tweets by the user
    {
      $lookup: {
        from: "tweets",
        localField: "owner",
        foreignField: "owner",
        as: "tweets",
      },
    },
    // Group to calculate stats
    {
      $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: "$views" },
        subscribers: { $first: "$subscribers" },
        subscribedTo: { $first: "$subscribedTo" },
        totalLikes: { $sum: { $size: "$likedVideos" } },
        totalComments: { $sum: { $size: "$videoComments" } },
        totalTweets: { $first: { $size: "$tweets" } },
      },
    },
    // Project the desired fields
    {
      $project: {
        _id: 0,
        totalVideos: 1,
        totalViews: 1,
        subscribers: { $size: "$subscribers" },
        subscribedTo: { $size: "$subscribedTo" },
        totalLikes: 1,
        totalComments: 1,
        totalTweets: 1,
      },
    },
  ]);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        channelStats[0],
        "Channel stats fetched successfully"
      )
    );

});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  let { username } = req.params;
  if (!username) throw new ApiError(404, "Invalid channel");

  // Decode the username and trim any leading or trailing spaces
  username = decodeURIComponent(username).trim();

  const channel = await User.findOne({ username }).select('-password');
  if (!channel) throw new ApiError(404, "Channel not found");

  if (!channel?._id) throw new ApiError(404, "Unauthorized request");

  const videos = await Video.find({
    owner: channel._id
  })

  if (!videos[0]) {
    return res.status(200)
      .json(new ApiResponse(200, [], "No videos found"))
  }

  return res.status(200)
    .json(new ApiResponse(200, videos, "Total videos fetched successfully"))


});

const getChannelDetails = asyncHandler(async (req, res) => {
  let { username } = req.params;
  if (!username) throw new ApiError(404, "Invalid channel");

  // Decode the username and trim any leading or trailing spaces
  username = decodeURIComponent(username).trim();

  const channel = await User.findOne({ username }).select('-password');
  if (!channel) throw new ApiError(404, "Channel not found");


  const channelDetails = {
    channelid: channel._id,
    username: channel.username,
    email: channel.email,
    fullname: channel.fullName,
    avatar: channel.avatar,
    coverimage: channel.coverImage,
    createdAt: channel.createdAt,
    updatedAt: channel.updatedAt,
  }

  res.status(200).json(
    new ApiResponse(200, channelDetails, "Channel details fetched successfully")
  );
})

export { getChannelStats, getChannelVideos, getChannelDetails };

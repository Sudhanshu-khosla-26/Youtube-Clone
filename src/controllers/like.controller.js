import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { Tweet } from "../models/tweet.model.js"
import { Comment } from "../models/comment.model.js"

// const toggleLike = asyncHandler(async (req, res) => {
//   const { toggleLike, commentId, videoId, tweetId } = req.query;
//   console.log(toggleLike, commentId, videoId, tweetId );
//   let reqLike;

//   if (
//     !isValidObjectId(commentId) ||
//     !isValidObjectId(tweetId) ||
//     !isValidObjectId(videoId)
//   ){
//     throw new ApiError(400, "Invalid id");
//   }

//   if (toggleLike === "true") reqLike = true;
//   else if (toggleLike === "false") reqLike = false;
//   // else throw new ApiError(400, "Invalid query string!!!");

//   let userLike;

//   if (commentId) {
//     const comment = await Comment.findById(commentId);
//     if (!comment) throw new ApiError(400, "No comment found");

//     userLike = await Like.find({
//       comment: commentId,
//       likedBy: req.user?._id,
//     });
//   } else if (videoId) {
//     const video = await Video.findById(videoId);
//     if (!video) throw new ApiError(400, "No video found");

//     userLike = await Like.find({
//       video: videoId,
//       likedBy: req.user?._id,
//     });
//   } else if (tweetId) {
//     const tweet = await Tweet.findById(tweetId);
//     if (!tweet) throw new ApiError(400, "No tweet found");

//     userLike = await Like.find({
//       tweet: tweetId,
//       likedBy: req.user?._id,
//     });
//   }

//   let isLiked = false;

//   if (userLike?.length > 0) {
//     // entry is present so toggle status
//     if (userLike[0].liked) {
//       // like is present
//       if (reqLike) {
//         // toggle like so delete like
//         await Like.findByIdAndDelete(userLike[0]._id);
//         isLiked = false;
//         isDisLiked = false;
//       } 
//     } 
//   } else {
//     // entry is not present so create new
//     let like;
//     if (commentId) {
//       like = await Like.create({
//         comment: commentId,
//         likedBy: req.user?._id,
//         liked: reqLike,
//       });
//     } else if (videoId) {
//       like = await Like.create({
//         video: videoId,
//         likedBy: req.user?._id,
//         liked: reqLike,
//       });
//     } else if (tweetId) {
//       like = await Like.create({
//         tweet: tweetId,
//         likedBy: req.user?._id,
//         liked: reqLike,
//       });
//     }
//     if (!like) throw new ApiError(500, "error while toggling like");
//     isLiked = reqLike;
//   }

//   let totalLikes;

//   if (commentId) {
//     totalLikes = await Like.find({ comment: commentId, liked: true });
//   } else if (videoId) {
//     totalLikes = await Like.find({ video: videoId, liked: true });
//   } else if (tweetId) {
//     totalLikes = await Like.find({ tweet: tweetId, liked: true });
//   }

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       {
//         isLiked,
//         totalLikes: totalLikes.length,
//       },
//       "Like toggled successfully"
//     )
//   );
// });

const toggleVideoLike = asyncHandler(async (req, res) => {
    // const {videoId} = req.params
    //TODO: toggle like on video
    const {videoId} = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "invalid videoId");
  }

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(400, "video not found");

  let isLiked = await Like.find({ video: videoId, likedBy: req.user?._id });

  let like;
  if (isLiked && isLiked.length > 0) {
    like = await Like.findByIdAndDelete(isLiked[0]._id);
    isLiked = false;
  } else {
    like = await Like.create({ video: videoId, likedBy: req.user?._id });
    if (!like) throw new ApiError(500, "error while toggling like");
    isLiked = true;
  }

  let totalLikes = await Like.find({ video: videoId });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {like: like,  isLiked, totalLikes: totalLikes.length },
        "like toggled successfully"
      )
    );

})

const toggleCommentLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on comment
const { commentId } = req.params;

if (!isValidObjectId(commentId)) throw new ApiError(400, "invalid commentId");

const comment = await Comment.findById(commentId);
if (!comment) throw new ApiError(400, "no comment found");

let userLike = await Like.find({
  comment: commentId,
  likedBy: req.user?._id,
});

let isLiked = false;

if (userLike?.length > 0) {
  // entry is present so toggle status
  if (userLike[0].liked) {
    // like is present
      // toggle like so delete like
      await Like.findByIdAndDelete(userLike[0]._id);
      isLiked = false;
  }
} else {
  // entry is not present so create new
  const like = await Like.create({
    comment: commentId,
    likedBy: req.user?._id,
    liked: true,
  });
  if (!like) throw new ApiError(500, "error while toggling like");
  isLiked = true;
}

let totalLikes = await Like.find({ comment: commentId, liked: true });

return res.status(200).json(
  new ApiResponse(
    200,
    {
      isLiked,
      totalLikes: totalLikes.length,
    },
    "Comment like toggled successfully"
  )
);
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "invalid tweetId");
      }
    
      const tweet = await Tweet.findById(tweetId);
      if (!tweet) throw new ApiError(400, "Tweet not found");
    
      let isLiked = await Like.find({ tweet: tweetId, likedBy: req.user?._id });
    
      let like;
      if (isLiked && isLiked.length > 0) {
        like = await Like.findByIdAndDelete(isLiked[0]._id);
        isLiked = false;
      } else {
        like = await Like.create({ tweet: tweetId, likedBy: req.user?._id });
        if (!like) throw new ApiError(500, "error while toggling like");
        isLiked = true;
      }
    
      let totalLikes = await Like.find({ tweet: tweetId });
    
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            {like: like,  isLiked, totalLikes: totalLikes.length },
            "like toggled successfully"
          )
        );


})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const LikedVideos = await Like.aggregate([
        {
            $match: {
              video: { $ne: null },
              likedBy: new mongoose.Types.ObjectId(req.user?._id),
            },
          },
          {
            $lookup: {
              from: "videos",
              localField: "video",
              foreignField: "_id",
              as: "video",
              pipeline: [
                {
                  $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                    pipeline: [
                      {
                        $project: {
                          username: 1,
                          fullName: 1,
                          avatar: 1,
                        },
                      },
                    ],
                  },
                },
                {
                  $unwind: "$owner",
                },
              ],
            },
          },
          {
            $unwind: "$video",
          },
          {
            $match: {
              "video.isPublished": true,
            },
          },
          {
            $group: {
              _id: "likedBy",
              videos: { $push: "$video" },
            },
          },
        ]);

        const videos = LikedVideos[0]?.videos || [];

        return res
        .status(200)
        .json(
            new ApiResponse(200, videos, "Liked videos fetched successfully")
        )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    // toggleLike
}
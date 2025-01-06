import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
  //TODO: get all videos based on query, sort, pagination

  let getAllVideo;
  try {
    getAllVideo = Video.aggregate([
      {
        $sample: {
          size: parseInt(limit),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "details",
          pipeline: [
            {
              $project: {
                fullname: 1,
                avatar: 1,
                username: 1,
              },
            },

          ],
        },
      },

      {
        $addFields: {
          details: {
            $first: "$details",
          },
        },
      },
    ]);
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while fetching Videos !!"
    );
  }

  const result = await Video.aggregatePaginate(getAllVideo, { page, limit });

  if (result.docs.length == 0) {
    return res.status(200).json(new ApiResponse(200, [], "No Video Found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, result.docs, "Videos fetched Succesfully !")
    );

})

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body
  // TODO: get video, upload to cloudinary, create video

  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
  const videoFileLocalPath = req.files?.videoFile[0]?.path;

  if (
    [title, description, thumbnailLocalPath, videoFileLocalPath].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All field are required!");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  const videoFile = await uploadOnCloudinary(videoFileLocalPath);

  if (!thumbnail) {
    throw new ApiError(400, "Thumbnail link is required");
  }

  if (!videoFile) {
    throw new ApiError(400, "VideoFile link is required");
  }

  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    title,
    description,
    duration: videoFile.duration,
    isPublished: true,
    owner: req.user?._id,
  });

  if (!video) {
    throw new ApiError(
      500,
      "Something went wrong while uploading the video."
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video published succesfully."));
})

// const getVideoById = asyncHandler(async (req, res) => {
//   const { videoId } = req.params;
//   //TODO: get video by id

//   if (!isValidObjectId(videoId)) {
//     // throw new ApiError(400, "Invalid Video ID");
//     const ytvideo = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=AIzaSyAV74Shpyw_Aov7ux6po4GJ1Ti_Z8oLhS8`)
//     console.log(ytvideo, "ytvideo");
//     if (!ytvideo) {
//       throw new ApiError(404, "Video not found");
//     }
//     return res.status(200)
//       .json(
//         new ApiResponse(200, ytvideo, "Youtube video details successfully fetched")
//       )
//   }




//   // const video_details = await Video.findById(videoId);

//   // if (!video_details) {
//   //     throw new ApiError(404, "Video not found");
//   // }

//   // return res
//   // .status(200)
//   // .json(
//   //     new ApiResponse(200, video_details , "video details successfully fetched")
//   // );


//   const video = await Video.aggregate([
//     {
//       $match: {
//         _id: new mongoose.Types.ObjectId(videoId),
//         isPublished: true,
//       },
//     },
//     // get all likes array
//     {
//       $lookup: {
//         from: "likes",
//         localField: "_id",
//         foreignField: "video",
//         as: "likes",
//         pipeline: [
//           {
//             $match: {
//               liked: true,
//             },
//           },
//           {
//             $group: {
//               _id: "$liked",
//               likeOwners: { $push: "$likedBy" },
//             },
//           },
//         ],
//       },
//     },
//     // adjust shapes of likes
//     {
//       $addFields: {
//         likes: {
//           $cond: {
//             if: {
//               $gt: [{ $size: "$likes" }, 0],
//             },
//             then: { $first: "$likes.likeOwners" },
//             else: [],
//           },
//         },
//       },
//     },
//     // fetch owner details
//     {
//       $lookup: {
//         from: "users",
//         localField: "owner",
//         foreignField: "_id",
//         as: "owner",
//         pipeline: [
//           {
//             $project: {
//               username: 1,
//               fullName: 1,
//               avatar: 1,
//             },
//           },
//         ],
//       },
//     },
//     {
//       $unwind: "$owner",
//     },
//     // added like fields
//     {
//       $project: {
//         videoFile: 1,
//         title: 1,
//         description: 1,
//         duration: 1,
//         thumbnail: 1,
//         views: 1,
//         owner: 1,
//         createdAt: 1,
//         updatedAt: 1,
//         totalLikes: {
//           $size: "$likes",
//         },
//         isLiked: {
//           $cond: {
//             if: {
//               $in: [req.user?._id, "$likes"],
//             },
//             then: true,
//             else: false,
//           },
//         },
//       },
//     },
//   ]);
//   console.log(video);
//   if (!video.length > 0) throw new ApiError(400, "No video found");

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(200, video[0], "video details successfully fetched")
//     );
// });

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if ((videoId.length) < 12) {
    // Fetch video from YouTube
    const ytvideo = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=AIzaSyDpicnbroQi7p8Sp0zbeQv91n-elyXVeD8`);
    const ytvideoData = await ytvideo.json();
    console.log(ytvideoData, "ytvideo");
    if (!ytvideoData.items || ytvideoData.items.length === 0) {
      throw new ApiError(404, "YouTube video not found");
    }
    return res.status(200).json(new ApiResponse(200, ytvideoData, "YouTube video details successfully fetched"));
  }
  else {
    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid Video ID");
    }

    const video = await Video.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(videoId),
          isPublished: true,
        },
      },
      // get all likes array
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "video",
          as: "likes",
          pipeline: [
            {
              $match: {
                liked: true,
              },
            },
            {
              $group: {
                _id: "$liked",
                likeOwners: { $push: "$likedBy" },
              },
            },
          ],
        },
      },
      // adjust shapes of likes
      {
        $addFields: {
          likes: {
            $cond: {
              if: {
                $gt: [{ $size: "$likes" }, 0],
              },
              then: { $first: "$likes.likeOwners" },
              else: [],
            },
          },
        },
      },
      // fetch owner details
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
      // added like fields
      {
        $project: {
          videoFile: 1,
          title: 1,
          description: 1,
          duration: 1,
          thumbnail: 1,
          views: 1,
          owner: 1,
          createdAt: 1,
          updatedAt: 1,
          totalLikes: {
            $size: "$likes",
          },
          isLiked: {
            $cond: {
              if: {
                $in: [req.user?._id, "$likes"],
              },
              then: true,
              else: false,
            },
          },
        },
      },
    ]);

    console.log(video);
    if (!video.length > 0) throw new ApiError(400, "No video found");

    return res.status(200).json(new ApiResponse(200, video[0], "Video details successfully fetched"));
  }
});


const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  //TODO: update video details like title, description, thumbnail

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video ID");
  }

  const thumbnailLocalPath = req.file?.path;

  if (!title && !description && !thumbnailLocalPath) {
    throw new ApiError(400, "Atleast one change is required to update");
  }


  let thumbnail;
  if (thumbnailLocalPath) {
    thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!thumbnail.url) {
      throw new ApiError(
        400,
        "Error while updating thumbnail in cloudinary."
      );
    }
  }

  const updated_video_details = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
        thumbnail: thumbnail.url,
      },
    },
    { new: true }
  )

  if (!updated_video_details) {
    throw new ApiError(401, "error while updating video");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updated_video_details, "Video details updated successfully.")
    )

})

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params
  //TODO: delete video

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video ID");
  }


  await Video.findByIdAndDelete(videoId)

  return res
    .status(200)
    .json(
      new ApiResponse(200, [], "Video is deleted successfully")
    )

})


const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(401, "Invalid VideoID");
  }

  const responce = await Video.findById(videoId);

  if (!responce) {
    throw new ApiError(401, "Video not found.");
  }

  responce.isPublished = !responce.isPublished;
  await responce.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, responce, "Published toggled succesfully."));
})

const updateView = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) throw new ApiError(400, "videoId required");

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(400, "Video not found");

  video.views += 1;
  const updatedVideo = await video.save();
  if (!updatedVideo) throw new ApiError(400, "Error occurred on updating view");

  let WatchHistory;
  if (req.user) {
    WatchHistory = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $push: {
          watchHistory: new mongoose.Types.ObjectId(videoId),
        },
      },
      {
        new: true,
      }
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          isSuccess: true, views: updatedVideo.views,
          _id: WatchHistory._id,
          WatchHistory: WatchHistory.watchHistory
        },
        "Video views updated successfully"
      )
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  updateView
}

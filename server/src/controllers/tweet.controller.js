import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body;

    if(!content){
        throw new ApiError(400, "Content is required")
    }

    try {
        const tweet = await Tweet.create({
            content: content,
            owner: req.user?._id
        });

        return res
        .status(200)
        .json(
            new ApiResponse(200, tweet, "Tweet created successfully")
        )

    } catch (error) {
        throw new ApiError(500, "Something went wrong while creating the tweet")
    }

})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params;

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user ID")
    }

    try {
        const user = await User.findById(userId);

        if(!user){
            throw new ApiError(404, "User not found")
        }

        const tweets = await Tweet.aggregate([
            {
                $match: {
                    owner : new mongoose.Types.ObjectId(`${userId}`)
                }
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
                                fullName: 1,
                                username: 1,
                                avatar: 1
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "tweet",
                    as: "totalLikes",
                }
            },
            {
                $addFields: {
                    // detials: {
                        // $
                        // first: "$details"
                    // },
                    totalLikesCount: {
                        $size: "$totalLikes"
                    }
                }
            }
        ])

        return res
           .status(200)
           .json(
                new ApiResponse(200, tweets, "Tweets fetched successfully")
            )

    } catch (error) {
        throw new ApiError(500, "Something went wrong while fetching tweets")
    }
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params;
    const {content} = req.body;

    if(content?.trim() === ""){
        throw new ApiError(400, "Content is required")
    }

    const updatetweet = await Tweet.findByIdAndUpdate(tweetId,
        {
            $set : {
                content,
            },
        },
        {
            new : true
        }
    );

    if(!updatetweet){
        throw new ApiError(404, "Error while updating tweet")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatetweet, "Tweet updated successfully")
    )


})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(401, "Invalid tweetID.");
    }

    const responce = await Tweet.findByIdAndDelete(tweetId);

    if (!responce) {
        throw new ApiError(500, "Something went wrong while deleting Tweet.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, responce, "Tweet deleted succesfully."));
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}

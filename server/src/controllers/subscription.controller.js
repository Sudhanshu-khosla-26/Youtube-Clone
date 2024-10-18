import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscriptions.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params;
    // TODO: toggle subscription

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid Channel ID");
    }

    const channel = await User.findById(channelId);

    if(!channel){
        throw new ApiError(404, "Channel not found");
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: req.user?._id,
        channel: channelId,
    })

    if(existingSubscription){
        const unSubscribeChannel = await Subscription.findByIdAndDelete(
            existingSubscription._id
        )  

        return res
        .status(200)
        .json(
           new ApiResponse(200, unSubscribeChannel , "channel unsubscribed successfully")
        )
    }
    else{
        const newSubscription = await Subscription.create({
            subscriber: req.user?._id,
            channel: channelId,
        })  

        return res
        .status(200)
        .json(
            new ApiResponse(200, newSubscription, "channel subscribed successfully")
        )
    }


})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId = req.user?._id } = req.params;

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel")
    }

    const subscriberList = await Subscription.aggregate([
        {
          $match: {
            channel: new mongoose.Types.ObjectId(channelId),
          },
        },
        {
          $lookup: {
            from: "subscriptions",
            localField: "channel",
            foreignField: "subscriber",
            as: "subscribedChannels",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "subscriber",
            foreignField: "_id",
            as: "subscriber",
            pipeline: [
              {
                $lookup: {
                  from: "subscriptions",
                  localField: "_id",
                  foreignField: "channel",
                  as: "subscribersSubscribers",
                },
              },
              {
                $project: {
                  username: 1,
                  avatar: 1,
                  fullName: 1,
                  subscribersCount: {
                    $size: "$subscribersSubscribers",
                  },
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$subscriber",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            "subscriber.isSubscribed": {
              $cond: {
                if: {
                  $in: ["$subscriber._id", "$subscribedChannels.channel"],
                },
                then: true,
                else: false,
              },
            },
          },
        },
        {
          $group: {
            _id: "channel",
            subscriber: {
              $push: "$subscriber",
            },
          },
        },
      ]);
    
      const subscribers =
        subscriberList?.length > 0 ? subscriberList[0].subscriber : [];
    
    
    return res
    .status(200)
    .json(
           new ApiResponse(200,subscribers, "Subscriber Sent Successfully")
    )

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const {subscriberId} = req.params;

    if(!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriberId")
    }

    const subscribedChannels = await Subscription.aggregate([
        {
            $match: {
                subscriber : new mongoose.Types.ObjectId(subscriberId),
            }
        },
        {
            $lookup: {
              from: "users",
              localField: "channel",
              foreignField: "_id",
              as: "channel",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: "$channel",
          },
          // get channel's subscribers
          {
            $lookup: {
              from: "subscriptions",
              localField: "channel._id",
              foreignField: "channel",
              as: "channelSubscribers",
            },
          },
          {
            // logic if current user has subscribed the channel or not
            $addFields: {
              "channel.isSubscribed": {
                $cond: {
                  if: { $in: [req.user?._id, "$channelSubscribers.subscriber"] },
                  then: true,
                  else: false,
                },
              },
              // channel subscriber count
              "channel.subscribersCount": {
                $size: "$channelSubscribers",
              },
            },
          },
          {
            $group: {
              _id: "subscriber",
              subscribedChannels: {
                $push: "$channel",
              },
            },
          },
    ])

    const users =
    subscribedChannels?.length > 0
      ? subscribedChannels[0].subscribedChannels
      : [];

      return res
      .status(200)
      .json(
        new ApiResponse(200, users, "Subscribed channel list sent successfully")
      );

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
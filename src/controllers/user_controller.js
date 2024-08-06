import {asyncHandler}  from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";
import { User } from "../models/user_model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
    
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        return {
            accessToken,
            refreshToken
        }
    
    } catch (error) {
        throw new ApiError(500, 
        "Something went wrong while generating refresh token and access token");
    }
} 

const registerUser = asyncHandler( async (req, res) =>{
    // res.status(200).json({
    //     message: "ok"
    // })

    const {fullName, email,username, password} = req.body
    // console.log(("email :", email));

    if([fullName, email,username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields is required")  
    }

   const existedUser = await  User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser) {
        throw new ApiError(409, "Email or username already exists")
    }

    const avatarLocalPath =  req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files?.coverImage[0]?.path;
    }

    if(!avatarLocalPath){
        throw new ApiEroor(400, "avatar file is required")
    }

    const avatar  = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username : username.toLowerCase()        
    })

    const createdUser =  await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json( 
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})

const loginUser = asyncHandler(async(req,res) => {
    const {email, username, password} = req.body;

    if(!username && !email) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or : [{email}, {username}]
    }) 

    if(!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid =  await user.isPasswordCorrect(password);

    if(!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const {accessToken , refreshToken} = await 
    generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, {
            user: loggedInUser, accessToken , refreshToken
        }, "User logged in successfully")
    )

})

const logoutUser = asyncHandler(async(req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,{
        $set : {
            refreshToken: undefined
        }
    },
    {
        new: true
    })

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200 , {} , "User logged out"))

})

<<<<<<< HEAD
=======

>>>>>>> a87de7d81b2d21db7bcf99460a4c3fe6d0968a99
const refreshAccessToken = asyncHandler(async(req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || 
        req.body.refreshToken
    
        if(!incomingRefreshToken){
            throw new ApiError(401, "Unauthorized request")
        }
    
    
        const decodedToken =  jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id) 
    
        if(!user){
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true,
        }
    
        const {accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(200,
                 {accessToken , refreshToken : newRefreshToken}, 
                 "Access token refreshed")
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }


})

<<<<<<< HEAD
const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))

})

const getCurrentUser = asyncHandler(async(req, res)=> {
    return res
    .status(200)
    .json(200, req.user , "current user fetch successfully")
})

const updateAccountDetails = asyncHandler(async(req, res)=> {
    const {fullName , email} = req.body

    if(!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = User.findByIdAndUpdate(req.user?._id,
    {
        $set: {
            fullName: fullName,
            email: email
        }
    },
    {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(200, user , "Account Details updated successfully")

})

const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path
    
    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }
    
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar.url)  {
        throw new ApiError(400, "Error while uploading avatar")
    }

    await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    )

    return res
    .status(200)
    .json(200, user , "avatar updated successfully")

})

const updateUserCoverImage = asyncHandler(async(req, res) => {
    const CoverImageLocalPath = req.file?.path
    
    if(!CoverImageLocalPath) {
        throw new ApiError(400, "coverImage file is missing")
    }
    
    const coverImage = await uploadOnCloudinary(CoverImageLocalPath);

    if(!coverImage.url)  {
        throw new ApiError(400, "Error while uploading coverImage")
    }

    await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {new: true}
    )
  
    return res
    .status(200)
    .json(200, user , "coverImage updated successfully")

})

=======
>>>>>>> a87de7d81b2d21db7bcf99460a4c3fe6d0968a99
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
<<<<<<< HEAD
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
=======
>>>>>>> a87de7d81b2d21db7bcf99460a4c3fe6d0968a99
}
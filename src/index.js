// require('dotenv').config({path: './env'})
import dotenv from 'dotenv';
import connectDB from "./db/index.js";


/*
import express from "express";
const app = express();

;(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error", (error)=>{
            console.error("Error", error)
            throw error
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`app is listing on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("Error", error)
        throw error
    }
})() //IFEE 

*/


dotenv.config({
    path: './env'
})

connectDB()
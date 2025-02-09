// require('dotenv').config({path: './env'})
import dotenv from 'dotenv';
import connectDB from "./db/index.js";
import { app } from "./app.js"
import { generateResult } from './utils/AI.js';

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
    path: './.env'
})

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running on port http://localhost:${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log("Mongo db connection failed: " + err)
    })

const express = require("express")
const courseRouter = express.Router()

courseRouter.post("/course",(req,res)=>{
    res.json({
        message:"Course Endpoint"
    })
})

courseRouter.get("/preview",(req,res)=>{
    res.json({
        message:"Course Preview"
    })
})

module.exports = courseRouter


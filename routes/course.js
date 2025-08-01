const {Router} = express();
const courseRouter = Router()

courseRouter.post("/course",(req,res)=>{
    res.json({
        message:"Course Endpoint"
    })
})

courseRouter.get("/preview",(req,res)=>{
    res.json({
        mesaage:"Course Preview"
    })
})

module.exports={
    courseRouter:courseRouter
}
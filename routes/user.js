const { Router } = require("express");
const userRouter = Router();

userRouter.post("/signup", (req, res) => {
    res.json({
        message: "Signup page - GET request",
    });
});

userRouter.post("/signin", (req, res) => {
    res.json({
        message: "Signup endpoint - POST request",
    });
});

userRouter.get("/purchase",(req,res)=>{
    res.json({
        message:"Purchase Endpoint"
    })
})

module.exports = {
    userRouter: userRouter,
};

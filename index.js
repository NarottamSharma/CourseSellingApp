const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const courseRouter = require("./routes/course");
const adminRouter = require("./routes/admin");

const app = express();

app.use(express.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/admin", adminRouter);

app.listen(3001, () => {
    console.log("Server listening on port 3001");
});
  
async function connect(){ 
    try {
        await mongoose.connect("mongodb+srv://narottamphodegaa:Dxaf4FhfgmkANgq5@cluster0.myoyepz.mongodb.net/coursers-app");
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Database connection error:", error);
    }
}

connect();
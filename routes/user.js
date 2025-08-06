const express = require("express");
const userRouter = express.Router();
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { userMiddleware } = require("../middleware/user");
const { JWT_SECRET } = require("../config");
const { userModel, purchaseModel, courseModel } = require("../db");

userRouter.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const requiredBody = z.object({
    email: z.email().max(25),
    password: z.string().min(6).max(20),
    firstName: z.string().max(20),
    lastName: z.string().max(20),
  });
  const parseResult = requiredBody.safeParse(req.body);
  if (!parseResult.success) {
    return res.json({
      message: "Incorrect Method",
      error: parseResult.error,
    });
  }

  try {
    const existingUser = await userModel.findOne({
      email: email,
    });
    if (existingUser) {
      return res.json({
        message: "User Already Exists, Please Sign In",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 6);

    await userModel.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });

    return res.json({
      message: "You are Signed Up",
      password: hashedPassword,
    });
  } catch (e) {
    return res.json({
      message: "User Already Exist",
    });
  }
});

userRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    // This database query could fail if there's a connection issue
    const existingUser = await userModel.findOne({
      email: email,
    });

    if (!existingUser) {
      return res.status(403).json({
        message: "User not found",
      });
    }

    // This bcrypt operation could fail if the hash is corrupted
    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (passwordMatch) {
      // JWT signing could fail if JWT_SECRET is invalid
      const token = jwt.sign(
        {
          id: existingUser._id.toString(),
        },
        JWT_SECRET
      );
      return res.json({
        token,
      });
    } else {
      return res.status(403).json({
        message: "Incorrect Credential",
      });
    }
  } catch (e) {
    // Catches any unexpected errors like database connection failures,
    // bcrypt errors, or JWT signing errors
    console.error("Signin error:", e);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

userRouter.get("/purchases", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const purchases = await purchaseModel.find({
    userId,
  });
  const courseData = await courseModel.find({
    _id: { $in: purchases.map((x) => x.courseId) },
  });
  res.json({
    purchases,
    courseData
  });
});

module.exports = userRouter;

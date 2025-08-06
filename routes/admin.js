const express = require("express");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { adminModel, courseModel } = require("../db");
const adminRouter = express.Router();
const { JWT_ADMIN_SECRET } = require("../config");
const { adminMiddleware } = require("../middleware/admin");

adminRouter.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const requiredBody = z.object({
    email: z.string().email(),
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
    const existingAdmin = await adminModel.findOne({
      email: email,
    });
    if (existingAdmin) {
      return res.json({
        message: "User Already Exists, Please Sign In",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 6);

    await adminModel.create({
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
      message: "Error occurred during signup",
      error: e.message,
    });
  }
});
adminRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingAdmin = await adminModel.findOne({
      email,
    });
    if (!existingAdmin) {
      return res.status(403).json({
        message: "Not an admin",
      });
    }
    const passwordMatch = await bcrypt.compare(
      password,
      existingAdmin.password
    );
    if (passwordMatch) {
      const token = jwt.sign(
        {
          id: existingAdmin._id.toString(),
        },
        JWT_ADMIN_SECRET
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
    console.error("Sign in error", e);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

adminRouter.post("/course", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const { title, description, price, imageUrl } = req.body;
  const course = await courseModel.create({
    title: title,
    description: description,
    imageUrl: imageUrl,
    price: price,
    creatorId: adminId,
  });
  res.json({
    message: "Course created",
    courseId: course._id,
  });
});

adminRouter.put("/course", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const { title, description, price, imageUrl, courseId } = req.body;
  const course = await courseModel.updateOne(
    {
      _id: courseId, //filter
      creatorId: adminId,
    },
    {
      title: title,
      description: description,
      imageUrl: imageUrl,
      price: price,
    }
  );
  res.json({
    message: "Course updated",
    courseId: course._id,
  });
});

adminRouter.get("/course/bulk", adminMiddleware, async (req, res) => {
  const adminId = req.userId;

  const courses = await courseModel.find({
    creatorId: adminId,
  });

  res.json({
    message: "Courses",
    courses,
  });
});

module.exports = adminRouter;

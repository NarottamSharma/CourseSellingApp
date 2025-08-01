const express = require("express");
const userRouter = express.Router();
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWT_SECRET= "ewaihf[08y988";
const { userModel } = require("../db");

userRouter.post("/signup", async (req, res) => {
  const requiredBody = z.object({
    email: z.string().email().max(25),
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

  const { email, password, firstName, lastName } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 6);

    await userModel.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });

    return res.json({
      message: "You are Signed Up",
      password:hashedPassword,
    });
  } catch (e) {
    return res.json({
      message: "User Already Exist",
    });
  }
});

userRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const response = await userModel.findOne({
    email: email,
  });
  if (!response) {
    return res.status(403).json({
      message: "User not found",
    });
  }
  // You may want to add password verification here
  const passwordMatch = bcrypt.compareSync(password, response.password);
  if (passwordMatch) {
    const token = jwt.sign(
      {
        id: response._id.toString(),
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
});

userRouter.get("/purchases", (_, res) => {
  res.json({
    message: "User purchases endpoint",
  });
});

module.exports = userRouter;

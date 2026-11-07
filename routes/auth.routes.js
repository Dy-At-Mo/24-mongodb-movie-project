import express from "express";
import { randomInt } from "node:crypto";

import User from "../models/User.js";
import Session from "../models/Session.js";

import { uploadImage } from "../middleware/upload.js";
import { validateBody } from "../middleware/validateBody.js";
import { checkAuth } from "../middleware/checkAuth.js";

import { registerSchema, loginSchema,forgotPasswordSchema , resetPasswordSchema } from "../validation-schemas/auth.schema.js";

export const authRouter = express.Router();


// register
authRouter.post("/register",
  uploadImage("image"),
  validateBody(registerSchema),
  async (req, res, next) => {
    try {
      const { username, email, password } = req.body;

      // check if email is exists
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(422).json({
          errors: {
            email: {
              errors: ["email already in use"],
            },
          },
        });
      }

      // create  user
      const user = await User.create({
        username,
        email,
        password,
        image: req.file?.filename,
      });

      // remove sensitive fields from response
      const userData = user.toObject();

      delete userData.password;
      delete userData.resetOtp;
      delete userData.resetOtpExpires;

      return res.status(201).json({
        message: "register successful, you can now login",
        data: {
          user: userData,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);


// login

authRouter.post("/login",
  validateBody(loginSchema),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // find user byemail
      const user = await User.findOne({ email });

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({
          error: "invalid email or password",
        });
      }

      // create session
      const session = await Session.createSession(user._id);

      // Set session by cookie
      res.cookie("movie_session", session.sessionId, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
      });

      const userData = user.toObject();

      delete userData.password;
      delete userData.resetOtp;
      delete userData.resetOtpExpires;

      return res.status(200).json({
        message: "login successful",
        data: {
          user: userData,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);


// forgot-password
authRouter.post("/forgot-password",
  validateBody(forgotPasswordSchema),
  async (req, res, next) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          error: "user with this email does not exist",
        });
      }

      // generate 6digit OTP
      const otp = randomInt(100000, 1000000).toString();

      user.resetOtp = otp;
      user.resetOtpExpires = new Date(Date.now() + 15 * 60 * 1000);

      await user.save();

      return res.status(200).json({
        message: "otp generated successfully",
        otp,
      });
    } catch (err) {
      next(err);
    }
  }
);



// reset-password
authRouter.post("/reset-password",
  validateBody(resetPasswordSchema),
  async (req, res, next) => {
    try {
      const {
        email,
        otp,
        new_password,
      } = req.body;

      const user = await User.findOne({
        email,
        resetOtp: otp,
        resetOtpExpires: { $gt: new Date() },
      });

      if (!user) {
        return res.status(400).json({
          error: "invalid or expired otp",
        });
      }

      // Update passw
      user.password = new_password;

      // clear OTP after successful reset
      user.resetOtp = undefined;
      user.resetOtpExpires = undefined;

      await user.save();

      return res.status(200).json({
        message: "password reset successful, you can now login",
      });
    } catch (err) {
      next(err);
    }
  }
);



// GET /auth/me
authRouter.get("/me", checkAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -resetOtp -resetOtpExpires"
    );

    if (!user) {
      return res.status(401).json({
        error: "invalid session",
      });
    }

    return res.status(200).json({
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
});



// logout
authRouter.post("/logout", async (req, res, next) => {
  try {
    const sessionId = req.cookies?.movie_session;

    if (sessionId) {
      await Session.findOneAndDelete({ sessionId });
    }

    res.clearCookie("movie_session", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      message: "logout successful",
    });
  } catch (err) {
    next(err);
  }
});
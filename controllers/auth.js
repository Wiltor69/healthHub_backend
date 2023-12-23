import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import crypto from "node:crypto";
// import nodemailer from "nodemailer";
import { HttpError, ctrlWrapper, sendEmail } from "../helpers/index.js";

import { User } from "../models/user.js";

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const {
    name,
    email,
    password,

    goal,
    weight,
    height,
    age,
    userActivity,
    gender,
  } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPass = await bcrypt.hash(password, 10);

  const verificationCode = crypto.randomUUID();

  const newUser = await User.create({
    ...req.body,
    password: hashPass,
    verificationCode,
  });

  res.status(201).json({
    user: {
      name: newUser.name,
      email: newUser.email,
      goal: newUser.goal,
      gender: newUser.gender,
      age: newUser.age,
      weight: newUser.weight,
      height: newUser.height,
      userActivity: newUser.userActivity,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw HttpError(401, "Email or password is wrong");

  const passCompare = await bcrypt.compare(password, user.password);
  if (!passCompare) throw HttpError(401, "Email or password is wrong");

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "30d" });
  await User.findOneAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
    },
  });
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;

  if (!req.body) throw HttpError(400, "missing field subscription");

  const { email, subscription } = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!email || !subscription) throw HttpError(404, "Not found");

  res.status(201).json({ email, subscription });
};

const logout = async (req, res) => {
  const { token } = req.user;
  await User.findOneAndUpdate({ token }, { token: "" });

  res.json({
    message: "Logout success",
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  const { name } = user;

  const newPassword = crypto.randomBytes(8).toString("hex");
  const hashPassword = await bcrypt.hash(newPassword, 10);

  const newPasswordEmail = {
    to: email,
    subject: "Your new password",
    html: `
        <h1>Hello ${name},</h1>
        <p>Your password has been reset. Here is your new password: <strong>${newPassword}</strong></p>
        <p>Please log in and change your password immediately.</p>
        <p>Best regards,<br>Your dream Team</p>
      `,
  };

  await sendEmail(newPasswordEmail);

  const userUpdate = await User.findOneAndUpdate(
    { email },
    { password: hashPassword }
  );

  if (!userUpdate) {
    throw HttpError(404, "User not found");
  }

  res.status(200).json({
    message:
      "Password updated successfully. Check your email for the new password.",
  });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  updateSubscription: ctrlWrapper(updateSubscription),
  logout: ctrlWrapper(logout),

  forgotPassword: ctrlWrapper(forgotPassword),
};

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import Jimp from  "jimp";

// import gravatar from  "gravatar";
import crypto from "node:crypto";

import { HttpError, ctrlWrapper } from "../helpers/index.js";
import { Auth } from "../models/auth.js";
import { User } from "../models/user.js";
const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const auth = await Auth.findOne({ email });
  if (auth) {
    throw HttpError(409, "Email in use");
  }
  const hashPass = await bcrypt.hash(password, 10);

  const verificationCode = crypto.randomUUID();

  const newAuth = await Auth.create({
    ...req.body,
    password: hashPass,

    verificationCode,
  });
  await User.create({
    _id: newAuth._id,
  });
  res.status(201).json({
    auth: {
      name: newAuth.name,
      email: newAuth.email,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const auth = await Auth.findOne({ email });
  if (!auth) throw HttpError(401, "Email or password is wrong");

  const passCompare = await bcrypt.compare(password, auth.password);
  if (!passCompare) throw HttpError(401, "Email or password is wrong");

  const payload = {
    id: auth._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await Auth.findOneAndUpdate(auth._id, { token });

  res.json({
    token,
    auth: {
      email: auth.email,
    },
  });
};

const updateSubscription = async (req, res) => {
  const { _id } = req.auth;

  if (!req.body) throw HttpError(400, "missing field subscription");

  const { email, subscription } = await Auth.findByIdAndUpdate(_id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!email || !subscription) throw HttpError(404, "Not found");

  res.status(201).json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.auth;
  await Auth.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({
    message: "Logout success",
  });
};

const getCurrent = async (req, res) => {
  const { email } = req.auth;

  res.json({ email });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  updateSubscription: ctrlWrapper(updateSubscription),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
};

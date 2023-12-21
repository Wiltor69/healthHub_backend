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
  const newUser = await User.create({
    _id: newAuth._id,
    goal: "Lose fat",
    gender: "Male",
    age: 20,
    weight: 60,
    height: 160,
    userActivity: "1.25",
    waterDailyNorma: 0,
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
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "30d" });
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

const forgotPassword = async (req, res) => {
  const newPassword = crypto.randomUUID();
  const hashPass = await bcrypt.hash(password, 10);
  const { email } = req.body;
  const auth = await Auth.findOne({ email });
  if (auth.token !== "") {
    throw HttpError(400, "User is login");
  }
  await Auth.findByIdAndUpdate(auth._id, { password: hashPass });

  // const forPassEmail = ElasticEmail.EmailMessageData.constructFromObject({
  //   Recipients: [new ElasticEmail.EmailRecipient(email)],
  //   Content: {
  //     Body: [
  //       ElasticEmail.BodyPart.constructFromObject({
  //         ContentType: "HTML",
  //         Content: `If you forgot your password, use this one: ${newPassword}`,
  //       }),
  //     ],
  //     Subject: "You forgot your password for login in Health app",
  //     From:
  //   },
  // });

  // api.emailsPost(forPassEmail);

  res.json({ message: "New password sent" });
};

const getCurrent = async (req, res) => {
  const { email } = req.auth;

  res.json({ email });
};

const creatAvatar = async (req, res) => {
  const avatarURL = req.file.path;
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  updateSubscription: ctrlWrapper(updateSubscription),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  creatAvatar: ctrlWrapper(creatAvatar),
  forgotPassword: ctrlWrapper(forgotPassword),
};

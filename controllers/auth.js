import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import crypto from "node:crypto";
// import nodemailer from "nodemailer";
import { HttpError, ctrlWrapper, emailSend } from "../helpers/index.js";
import { BMRMaleOrFemale, waterPlus } from "./user.js";
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
  const caloriesDayilyNorma = BMRMaleOrFemale(req.body, gender);
  const waterDailyNorma = (weight * 0.03 + waterPlus(userActivity)).toFixed(1);
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPass = await bcrypt.hash(password, 10);

  const verificationCode = crypto.randomUUID();
  const dateNow = new Date();
  const monthNow = dateNow.getMonth();
  const dayNow = dateNow.getDate();
  const arrForWholeTime = [
    {
      month: monthNow + 1,
      dates: [
        {
          date: dayNow,
          weight,
        },
      ],
    },
  ];
  const onePercent = caloriesDayilyNorma / 100;
  let macroelementsProporsion = {};
  const countGoal = (percForProtein, percForFat) => {
    macroelementsProporsion.protein = Math.round(
      (onePercent * percForProtein) / 4.1
    );
    macroelementsProporsion.fat = Math.round((onePercent * percForFat) / 9.3);
    macroelementsProporsion.carbonohidrates = Math.round(
      (caloriesDayilyNorma -
        macroelementsProporsion.protein * 4.1 -
        macroelementsProporsion.fat * 9.3) /
        4.1
    );
  };
  if (goal == "Lose fat") {
    countGoal(25, 20);
  }
  if (goal == "Maintain") {
    countGoal(20, 25);
  }
  if (goal == "Gain Muscle") {
    countGoal(30, 20);
  }
  const newUser = await User.create({
    ...req.body,
    password: hashPass,
    verificationCode,
    macroelementsProporsion,
    arrForWholeTime,
    caloriesDayilyNorma,
    waterDailyNorma,
  });

  const payload = {
    id: newUser._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "30d" });

  await User.findOneAndUpdate(newUser._id, { token });

  res.status(201).json({
    token,
    user: {
      name: newUser.name,
      email: newUser.email,
      goal: newUser.goal,
      gender: newUser.gender,
      age: newUser.age,
      weight: newUser.weight,
      height: newUser.height,
      userActivity: newUser.userActivity,
      macroelementsProporsion,
      caloriesDayilyNorma,
      waterDailyNorma,
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

  const newPassword = crypto.randomBytes(6).toString("hex");
  const hashPassword = await bcrypt.hash(newPassword, 10);

  const newPassEmail = {
    to: email,
    subject: "Ihr neues Passwort",
    html: `
        <h1>Hallo ${name},</h1>
        <p>Dein Passwort wurde zurück gesetzt. Hier ist Ihr neues Passwort: <strong>${newPassword}</strong></p>
        <p>Bitte loggen Sie sich ein und ändern Sie umgehend Ihr Passwort.</p>
        <p>Beste grüße,<br>Ihr Traumteam</p>
      `,
  };

  await emailSend(newPassEmail);

  const userUpdate = await User.findOneAndUpdate(
    req.body,
    // { email },
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

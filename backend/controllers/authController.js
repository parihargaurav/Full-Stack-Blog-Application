import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import { getAuthCookieOptions } from "../utils/cookieOptions.js";

const salt = bcrypt.genSaltSync(10);

export const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });

    res.json(userDoc);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  const userDoc = await User.findOne({ username });

  if (!userDoc) {
    return res.status(404).json("User not found");
  }

  const passOk = bcrypt.compareSync(password, userDoc.password);

  if (!passOk) {
    return res.status(400).json("Wrong credentials");
  }

  jwt.sign(
    {
      username,
      id: userDoc._id,
    },
    process.env.JWT_SECRET,
    {},
    (err, token) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.cookie("token", token, getAuthCookieOptions()).json({
        id: userDoc._id,
        username,
      });
    }
  );
};

export const getProfile = (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(200).json(null); //  was 401, now silent
  }

  jwt.verify(token, process.env.JWT_SECRET, {}, (err, info) => {
    if (err) {
      return res.status(200).json(null); //  was 401, now silent
    }

    res.json(info);
  });
};

export const logoutUser = (req, res) => {
  res.clearCookie("token", getAuthCookieOptions());
  res.json("User logged out");
};
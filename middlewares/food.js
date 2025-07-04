import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();
const secret = process.env.secret;

export const auth_checker = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log("token in auth redirect = " + token);
    const payload = jwt.verify(token, secret);
    console.log(payload);
    req.user = payload;
    next();
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "You are not authorised. Please login once more",
    });
  }
};

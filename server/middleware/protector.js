const express = require("express");
const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");

const protector = async (req, res, next) => {
  try {
    const token = req.cookies.eUserToken;

    if (!token) {
      return res.status(400).json("Invalid Session, Please login");
    }
    // token verify
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await userModel.findById(verified.id);

    if (!user) {
      return res.status(401).json("user not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json("Not authorized, please login");
    console.log(error.message);
  }
};

module.exports = protector;

const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { BlacklistModel } = require("../models/bloacklist.model");
const authentication = async (req, res, next) => {
  //to check if someone is logged in or not
  const token = req.cookies.token;
  const blacklisted = await BlacklistModel.find({ blacklisted: token });
  if (!blacklisted.length) {
    //const decoded = jwt.verify(token, "token");
    jwt.verify(token, "token", function (err, decoded) {
      if (decoded) {
        next();
      } else {
        res.send({ msg: err.message });
      }
    });
  } else {
    res.send("please login");
  }
  //to check if the token is in blacklist
  // to check authorized user for specific route
};

module.exports = { authentication };

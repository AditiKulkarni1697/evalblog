const express = require("express");
const jwt = require("jsonwebtoken");
const authorization = ([permitted]) => {
  return (req, res, next) => {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, "token");
    if (permitted.includes(decoded.role)) {
      next();
    } else {
      res.send("access denied");
    }
  };
};

module.exports = { authorization };

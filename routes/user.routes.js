const express = require("express");
const { UserModel } = require("../models/user.model");
const { BlacklistModel } = require("../models/bloacklist.model");
const { authentication } = require("../middleware/authentication.middleware");
const { authorization } = require("../middleware/authorization.middleware");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//const jwt = require("jsonwebtoken");
const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send("All the users..");
});

userRouter.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  bcrypt.hash(password, 8, async function (err, hash) {
    if (hash) {
      const user = new UserModel({ name, email, password: hash, role });
      await user.save();
      res.send({ msg: "User is registered" });
    } else {
      res.send({ msg: err.message });
    }
  });
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.find({ email });
  bcrypt.compare(password, user[0].password, function (err, result) {
    if (result) {
      const token = jwt.sign(
        { userID: user[0]._id, role: user[0].role },
        "token",
        { expiresIn: "1m" }
      );
      const refreshToken = jwt.sign(
        { userID: user[0]._id, role: user[0].role },
        "refreshToken",
        { expiresIn: "3m" }
      );
      res.cookie("token", token);
      res.cookie("refresh", refreshToken);
      console.log(req.cookies);
      res.send({ msg: "Logged in successfully" });
    }
  });
});

userRouter.get("/logout", authentication, async (req, res) => {
  try {
    const token = req.cookies.token;
    const blacklisted = new BlacklistModel({ blacklisted: token });
    await blacklisted.save();
    res.send("logout successful");
  } catch (err) {
    res.send(err);
  }
});

userRouter.get("/getnewtoken", async (req, res) => {
  const refresh = req.cookies.refresh;
  const blacklisted = await BlacklistModel.find({ blacklisted: refresh });
  if (!blacklisted.length) {
    jwt.verify(refresh, "refreshToken", function (err, decoded) {
      if (decoded) {
        console.log(decoded);
        const token = jwt.sign(
          { userID: decoded.userID, role: decoded.role },
          "token",
          { expiresIn: "1m" }
        );
        res.cookie("token", token);
        console.log(req.cookies);
        res.send("Logged in success");
      } else {
        res.send({ msg: err.message });
      }
    });
  } else {
    res.send("Please log in");
  }
});

module.exports = { userRouter };

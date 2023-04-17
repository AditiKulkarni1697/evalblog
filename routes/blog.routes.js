const { BlogModel } = require("../models/blog.model");
const express = require("express");
const { UserModel } = require("../models/user.model");
const { authentication } = require("../middleware/authentication.middleware");
const { authorization } = require("../middleware/authorization.middleware");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const blogRouter = express.Router();

blogRouter.get(
  "/",
  authentication,
  authorization(["user", "moderator"]),
  async (req, res) => {
    try {
      const blogs = await BlogModel.find();
      res.send(blogs);
    } catch (err) {
      res.send(err);
    }
  }
);

blogRouter.post(
  "/create",
  authentication,
  authorization(["user"]),
  async (req, res) => {
    const token = req.cookies.token;
    jwt.verify(token, "token", async function (err, decoded) {
      if (decoded) {
        req.body.userID = decoded.userID;
        const blog = new BlogModel(req.body);
        await blog.save();
        res.send("blog created");
      } else {
        res.send({ msg: err.message });
      }
    });
  }
);

blogRouter.patch(
  "/update/:id",
  authentication,
  authorization(["user"]),
  async (req, res) => {
    const token = req.cookies.token;
    const blogID = req.params.id;
    const payload = req.body;
    const blog = await BlogModel.find({ _id: blogID });
    jwt.verify(token, "token", async function (err, decoded) {
      if (decoded) {
        if (decoded.userID == blog[0].userID) {
          const blog = await BlogModel.findByIdAndUpdate(
            { _id: blogID },
            payload
          );
          res.send("blog updated");
        } else {
          res.send("Please log in");
        }
      } else {
        res.send({ msg: err.message });
      }
    });
  }
);

blogRouter.delete(
  "/delete/:id",
  authentication,
  authorization(["user"]),
  async (req, res) => {
    const token = req.cookies.token;
    const blogID = req.params.id;

    const blog = await BlogModel.find({ _id: blogID });
    jwt.verify(token, "token", async function (err, decoded) {
      if (decoded) {
        if (decoded.userID == blog[0].userID) {
          const blog = await BlogModel.findByIdAndDelete({ _id: blogID });
          res.send("blog deleted");
        } else {
          res.send("Please log in");
        }
      } else {
        res.send({ msg: err.message });
      }
    });
  }
);

blogRouter.delete(
  "/deleteany/:id",
  authentication,
  authorization(["moderator"]),
  async (req, res) => {
    const token = req.cookies.token;
    const blogID = req.params.id;

    const blog = await BlogModel.find({ _id: blogID });
    jwt.verify(token, "token", async function (err, decoded) {
      if (decoded) {
        const blog = await BlogModel.findByIdAndDelete({ _id: blogID });
        res.send("blog deleted");
      } else {
        res.send({ msg: err.message });
      }
    });
  }
);

module.exports = { blogRouter };

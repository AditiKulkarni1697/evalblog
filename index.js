const express = require("express");

require("dotenv").config();
const { connection } = require("./db");
const { userRouter } = require("./routes/user.routes");
const { blogRouter } = require("./routes/blog.routes");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.listen(8080, async () => {
  try {
    await connection;
    console.log("DB is connected to server");
  } catch (err) {
    console.log(err);
  }
  console.log("Server is running at port 8080");
});

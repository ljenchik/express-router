const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRouter = require("./../routes/users");
const fruitRouter = require("./../routes/fruits");

app.use("/users", userRouter);
app.use("/fruits", fruitRouter);

module.exports = { app };

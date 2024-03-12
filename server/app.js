import express from "express";
import cookieParser from "cookie-parser";

import userRoute from "./Routes/user.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/users", userRoute);

app.get("/test", (req, res) => {
  res.send("Hello World!");
  console.log("Hello World!");
});

export { app };

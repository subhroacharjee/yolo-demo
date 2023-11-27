import express from "express";
import { login, logout, register } from "../controllers/auth";
import httpStatus from "http-status";
import { Context } from "../utils/Context";
import { sessionHandler } from "../middlewares/session";
import logger from "../config/logger";

const authRouter = express.Router();

authRouter.post("/register", async (req, res, next) => {
  const {
    name, email, password
  } = req.body;

  try {
    const data = await register({
      name,
      email,
      password
    });

    res
      .status(httpStatus.OK)
      .json({
        success: true,
        data,
      });

  } catch (error) {
    next(error)
  }
});

authRouter.post("/login", async (req, res, next) => {
  const {
    email, password
  } = req.body;

  try {
    const data = await login(email, password);
    res
      .status(httpStatus.OK)
      .json({
        success: true,
        data
      })
  } catch (error) {
    next(error)
  }
});


authRouter.delete("/logout", sessionHandler, async (req, res, next) => {
  const userID: string = Context.getData(req, "userId")!;

  try {
    const data = await logout(userID);
    res
      .status(httpStatus.OK)
      .json({
        success: true,
        data,
      })
  } catch (error) {
    next(error)
  }
});


// TODO: remove before pushing to repo
authRouter.post("/login-force", async (req, res, next) => {
  const {
    email, password
  } = req.body;

  try {
    const data = await login(email, password, true);
    res
      .status(httpStatus.OK)
      .json({
        success: true,
        data
      })
  } catch (error) {
    next(error)
  }
});

export default authRouter;

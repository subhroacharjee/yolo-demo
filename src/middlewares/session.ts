
import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import Users, { IUserForAuth } from "../models/user";
import { Jwt } from "../utils/Jwt";
import logger from "../config/logger";
import { Context } from "../utils/Context";
import * as jwt from "jsonwebtoken";
import { redisClient } from "../config/redis";

export async function sessionHandler(req: Request, _: Response, next: NextFunction) {
  // set flag if url endpoint is called
  const isLogoutPath = req.url.includes("logout");
  try {

    // get authorization header and validate the token
    const authHeader = req.get("authorization");
    if (!authHeader) {
      next(new ApiError(httpStatus.UNAUTHORIZED, "no authorization header found"));
      return
    }

    const tokens = authHeader.split("Bearer ");
    if (tokens.length !== 2) {
      next(new ApiError(httpStatus.UNAUTHORIZED, "no bearer token found"))
      return
    }

    const accessToken = tokens[1];
    var userInfo: IUserForAuth
    try {
      userInfo = Jwt.verifyJWT(accessToken);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        await removeExpiredDeviceID(accessToken);
      }
      next(new ApiError(httpStatus.UNAUTHORIZED, `${error}`))
      return;
    }

    let userId = "";
    // check if the accessToken is present in cache or not.
    const redisUserId = await redisClient.get(accessToken);
    if (!redisUserId) {
      // if not present in cache then do the opperation.
      const user = await Users.findById(userInfo.id);
      if (!user) {
        next(new ApiError(httpStatus.UNAUTHORIZED, "invalid api token"));
        return
      }

      if (user.logInID !== userInfo.logInID) {
        next(new ApiError(httpStatus.UNAUTHORIZED, "incorrect device id"));
        return;
      }

      userId = userInfo.id;
      if (!isLogoutPath) {
        // if we are not logging out then we store the access token in cache.
        // in case we are logging out and also saving the accessToken,
        // then even after logging out we will be able to use the api even after
        // the session has been removed.
        await redisClient.set(accessToken, userId);
        await redisClient.expire(accessToken, 600)
      }
    }
    Context.setData(req, "userId", redisUserId || userId);
    if (isLogoutPath) await redisClient.del(accessToken);
    next();
  } catch (error) {
    logger.error(error)
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "something went wrong"))
  }
}

async function removeExpiredDeviceID(token: string) {
  const expiredPayload: IUserForAuth = Jwt.getExpiredPayload(token);
  const user = await Users.findById(expiredPayload.id);
  if (!user) return;
  user.isLoggedIn = false;
  user.logInID = null;
  await user.save();
}

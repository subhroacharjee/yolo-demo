import { NextFunction, Request, Response } from "express";
import logger from "../config/logger";
import ApiError from "../utils/ApiError";
import { redisClient } from "../config/redis";
import { API_LIMIT_DURATION, API_LIMIT_PER_DURATION } from "../config/config";
import httpStatus from "http-status";
import { Context } from "../utils/Context";

export default async function CheckLimit(req: Request, res: Response, next: NextFunction) {
  try {
    const ctx = Context.getRequestContext(req);
    if (!ctx) {
      logger.error("No request context is set");
      next(new ApiError(500, "something went wrong"));
      return
    }

    const userId = Context.getData(req, "userId");
    if (!userId) {
      logger.error("anonymous access to " + new URL(req.url).pathname);
      next(new ApiError(httpStatus.UNAUTHORIZED, httpStatus[httpStatus.UNAUTHORIZED]));
      return;
    }

    const redisKey = `api_limit:${userId}`;
    const requestCounter = await redisClient.incr(redisKey);

    if (requestCounter === 1) {
      await redisClient.expire(redisKey, API_LIMIT_DURATION);
    }

    res.setHeader("X-Limit-Per-Duration", `${API_LIMIT_PER_DURATION}`);
    res.setHeader("X-Limit-Remaining", `${API_LIMIT_PER_DURATION - requestCounter}`);
    res.setHeader("X-Limit-Refresh-Duration", `${API_LIMIT_DURATION}s`)
    if (requestCounter > API_LIMIT_PER_DURATION) {
      next(new ApiError(httpStatus.TOO_MANY_REQUESTS, "api limit exceeded"));
      return
    }

    next()
  } catch (error) {
    logger.error(error)
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "something went wrong"))
  }
}

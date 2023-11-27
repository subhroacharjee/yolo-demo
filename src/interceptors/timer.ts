import express from "express"
import logger from "../config/logger";

// I was not able to think of any better example than this one for using
// interceptor.
export async function timer(req: express.Request, res: express.Response, next: express.NextFunction) {
  const path = req.url;
  const method = req.method;
  const time = new Date().getTime();
  next()
  const endTime = new Date().getTime();
  logger.info(`[${method}] ${path} ${(endTime - time) / 1000}s`)

}

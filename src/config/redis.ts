import { Redis } from "ioredis";
import * as Config from "./config"

export const redisClient = new Redis(Config.REDIS_URL)

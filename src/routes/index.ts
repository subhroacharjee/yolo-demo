import express from "express";
import authRouter from "./auth.routes";
import { sessionHandler } from "../middlewares/session";
import CheckLimit from "../middlewares/rateLimiter";
import todoRouter from "./todo.routes";
const router = express.Router();

router.use("/api/auth", authRouter);
router.use("/api/todo", sessionHandler, CheckLimit, todoRouter);
export default router;

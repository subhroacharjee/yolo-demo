import express from 'express';
import { Context } from '../utils/Context';
import { create, get, getAll, remove, toggleFinished, update } from '../controllers/todo';
import httpStatus from 'http-status';

const todoRouter = express.Router();

todoRouter.post("/", async (req, res, next) => {
  try {
    const {
      title,
      description
    } = req.body;

    const userId = Context.getData(req, "userId")!;
    const data = await create({
      title,
      description,
      userId
    });
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

todoRouter.get("/", async (req, res, next) => {
  try {
    const userId = Context.getData(req, "userId")!;
    const data = await getAll(userId);
    res
      .status(httpStatus.OK)
      .json({
        success: true,
        data,
      })
  } catch (error) {
    next(error)
  }
})

todoRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = Context.getData(req, "userId")!;
    const data = await get(id, userId);
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

todoRouter.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = Context.getData(req, "userId")!;
    const data = await toggleFinished(id, userId);
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


todoRouter.patch("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = Context.getData(req, "userId")!;
    const data = await update(id, userId, req.body);
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

todoRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = Context.getData(req, "userId")!;
    const data = await remove(id, userId);
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

export default todoRouter;

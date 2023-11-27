import { ObjectId } from "mongodb";
import Todo, { ITodoData } from "../models/todo";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";

function getTodoInfo(todo: any): ITodoData {
  return {
    _id: todo._id.toString(),
    title: todo.title,
    description: todo.description,
    isFinished: todo.isFinished,
    finishedAt: todo.finishedAt,
    createdAt: todo.createdAt
  }
}

async function getOrThrow(id: string, userId: string) {
  const todo = await Todo.findOne({
    _id: new ObjectId(id),
    creator: new ObjectId(userId),
  });
  if (!todo) throw new ApiError(httpStatus.NOT_FOUND, "no such todo was found");
  return todo;
}

export async function create(payload: { title: string, description?: string, userId: string }): Promise<ITodoData> {
  const newTodo = new Todo({
    creator: new ObjectId(payload.userId),
  });
  newTodo.title = payload.title;
  newTodo.description = newTodo.description;

  await newTodo.save();

  return getTodoInfo(newTodo);
}

export async function getAll(userId: string): Promise<ITodoData[]> {
  const todos = await Todo.find({
    creator: new ObjectId(userId),
  }, "_id title description isFinished finishedAt createdAt");

  return todos.map((t) => getTodoInfo(t));
}

export async function get(id: string, userId: string): Promise<ITodoData> {
  return getTodoInfo(await getOrThrow(id, userId));
}

export async function remove(id: string, userId: string): Promise<string> {
  const todo = await getOrThrow(id, userId);
  await todo.deleteOne();
  return "ok";
}

export async function toggleFinished(id: string, userId: string): Promise<ITodoData> {
  const todo = await getOrThrow(id, userId);
  const isFinished = !todo.isFinished;
  todo.isFinished = isFinished;
  todo.finishedAt = isFinished ? new Date() : null;
  await todo.save();
  return getTodoInfo(todo);
}

export async function update(id: string, userId: string, payload: {
  title?: string,
  description?: string,
}): Promise<ITodoData> {
  const todo = await getOrThrow(id, userId);
  todo.title = payload.title || todo.title;
  todo.description = payload.description || todo.description;

  await todo.save();
  return getTodoInfo(todo);
}



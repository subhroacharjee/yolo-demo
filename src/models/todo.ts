import * as mongoose from "mongoose";
import { IUser } from "./user";

export interface ITodo {
  title: string
  description?: string
  isFinished?: boolean
  creator: IUser
  createdAt: Date
  finishedAt?: Date | null
}

export interface ITodoData {
  _id: string,
  title: string
  description?: string
  isFinished?: boolean
  createdAt: Date
  finishedAt?: Date
}

const todoSchema = new mongoose.Schema<ITodo>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  isFinished: {
    type: Boolean,
    default: false,
  },
  creator: {
    type: mongoose.Types.ObjectId, ref: "User",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  finishedAt: {
    type: Date,
  }
}, {
  timestamps: true,
});


const Todo = mongoose.model<ITodo>("Todo", todoSchema);
export default Todo;

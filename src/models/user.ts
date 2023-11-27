import * as mongoose from "mongoose";

export interface IUser {
  name: string
  email: string
  password: string
  isLoggedIn?: boolean
  lastLoggedIn?: Date
  logInID?: string | null
}

export interface IUserForAuth {
  id: string
  name: string
  email: string
  isLoggedIn: boolean
  logInID: string
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  lastLoggedIn: {
    type: Date,
    required: false,
  },
  logInID: {
    type: String,
  }
}, { timestamps: true });

const Users = mongoose.model<IUser>("User", userSchema);
export default Users;

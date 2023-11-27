import httpStatus from "http-status";
import Users, { IUser, IUserForAuth } from "../models/user";
import ApiError from "../utils/ApiError";
import { Hash } from "../utils/Hash";
import { Jwt } from "../utils/Jwt";
import logger from "../config/logger";

interface IAuthResponse {
  user: IUserForAuth,
  accessToken: string,
}

export async function register(user: IUser): Promise<IAuthResponse> {
  const existingUser = await Users.findOne({
    email: user.email,
  });

  if (existingUser) throw new ApiError(httpStatus.BAD_REQUEST, "email already exists");

  const newUser = new Users(user);
  newUser.password = Hash.hashText(newUser.password);
  newUser.isLoggedIn = true;
  newUser.lastLoggedIn = new Date();
  newUser.logInID = Hash.generateId()
  await newUser.save();

  const userInfo: IUserForAuth = {
    id: newUser._id.toString(),
    name: newUser.name,
    email: newUser.email,
    isLoggedIn: newUser.isLoggedIn,
    logInID: newUser.logInID,
  };
  logger.debug(JSON.stringify(userInfo))
  return {
    user: userInfo,
    accessToken: Jwt.createJWT(userInfo)
  }
}

export async function login(email: string, password: string, force: boolean = false): Promise<IAuthResponse> {
  const user = await Users.findOne({
    email
  });

  if (!user || !Hash.verifyHash(user.password, password)) throw new ApiError(httpStatus.BAD_REQUEST, "invalid email or password");
  if (!force && user.isLoggedIn) throw new ApiError(httpStatus.UNAUTHORIZED, "user is already logged in from another device")

  user.isLoggedIn = true;
  user.lastLoggedIn = new Date();
  user.logInID = Hash.generateId();
  await user.save();

  const userInfo: IUserForAuth = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    isLoggedIn: user.isLoggedIn,
    logInID: user.logInID,

  };

  return {
    user: userInfo,
    accessToken: Jwt.createJWT(userInfo)
  };
}

export async function logout(id: string): Promise<string> {
  const user = await Users.findById(id);
  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "invalid session");
  user.logInID = null;
  user.isLoggedIn = false;
  await user.save();

  return "session ended!"
}

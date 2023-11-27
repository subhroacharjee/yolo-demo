import jwt from "jsonwebtoken"
import { JWT_EXPIRE, JWT_SECRET } from "../config/config"
export class Jwt {
  static createJWT(body: any): string {
    return jwt.sign(body, JWT_SECRET, { expiresIn: JWT_EXPIRE })
  }

  static verifyJWT<T>(token: string): T {
    const decoded = jwt.verify(token, JWT_SECRET,);
    return decoded as T;
  }

  static getExpiredPayload<T>(token: string): T {
    return jwt.verify(token, JWT_SECRET, { ignoreExpiration: true }) as T;
  }
}

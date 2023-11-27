import bcrypt from "bcrypt";
import { v4 } from "uuid";
export class Hash {
  static hashText(text: string) {
    return bcrypt.hashSync(text, bcrypt.genSaltSync(10));
  }

  static verifyHash(hash: string, text: string) {
    return bcrypt.compareSync(text, hash);
  }

  static generateId() {
    return v4()
  }
}

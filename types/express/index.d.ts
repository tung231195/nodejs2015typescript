import { IUserDoc } from "../../src/types";

declare global {
  namespace Express {
    export interface Request {
      user?: IUserDoc; // thêm user vào type Request
    }
  }
}

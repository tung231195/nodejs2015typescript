import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel.js";
import { IUser } from "../interfaces/user.interface.js";

export const AdminAuthMiddleware = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("token admin", token);
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user = (await UserModel.findById(decoded.id)) as IUser;
    if (!user) return res.status(403).json({ message: "The User not exist => Unauthorized" });
    if (!["admin", "superadmin"].includes(user.role))
      return res.status(403).json({ message: "You hasn't privigile to access Admin" });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

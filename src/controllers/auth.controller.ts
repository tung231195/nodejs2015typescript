import { Request, Response } from "express";
import { UserModel } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { TokenModel } from "../models/tokenModel.js";

const generateAccessToken = (user: any) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" } // access token ngắn hạn
  );
};

const generateRefreshToken = async (user: any) => {
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" }
  );
  // lưu refreshToken vào DB
  await TokenModel.findOneAndUpdate(
    { userId: user._id },
    { token: refreshToken },
    { upsert: true }
  );
  return refreshToken;
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const user = await UserModel.create({ username, email, password });
    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    res.status(500).json({ error: "Error registering user" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: "Error logging in" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

  try {
    const stored = await TokenModel.findOne({ token: refreshToken });
    if (!stored) return res.status(403).json({ message: "Invalid refresh token" });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as any;

    const user = await UserModel.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: "No refresh token" });

  try {
    await TokenModel.findOneAndDelete({ token: refreshToken });
    res.json({ message: "Logged out" });
  } catch (err) {
    res.status(500).json({ error: "Error logging out" });
  }
};

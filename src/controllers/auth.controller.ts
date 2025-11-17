import { Request, Response } from "express";
import { UserModel } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { TokenModel } from "../models/tokenModel.js";
import { OAuth2Client } from "google-auth-library";
import { IUserDoc, IUserInput } from "../types/index.js";
import axios from "axios";
import sendEmail from "../util/email/index.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const generateAccessToken = async (user: any) => {
  console.log("user token", user);
  return await jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "115m" }, // access token ngắn hạn
  );
};

const generateRefreshToken = async (user: any) => {
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "7d",
  });
  // lưu refreshToken vào DB
  await TokenModel.findOneAndUpdate(
    { userId: user._id },
    { token: refreshToken },
    { upsert: true },
  );
  return refreshToken;
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    console.log("user data", req.body);
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const user = await UserModel.create({ name, email, password });
    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    res.status(500).json({ error: "Error registering user" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(200).json({ status: "error", message: "The user not exist" });
    console.log("check password", password, email);
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(200).json({
        status: "error",
        message: "Invalid email or password",
      });

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    // hide password
    const userData = user.toObject();
    delete userData.password;
    res.json({
      status: "success",
      message: "Login successfully",
      accessToken,
      refreshToken,
      user: userData,
    });
  } catch (err) {
    res.status(500).json({ status: "error", error: "Error logging in" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  console.log("refreshToken aaaaaaa", refreshToken);
  if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

  try {
    const stored = await TokenModel.findOne({ token: refreshToken });
    if (!stored) return res.status(403).json({ message: "Invalid refresh token 1" });
    console.log("kkkkkkkkk1111", refreshToken, process.env.JWT_REFRESH_SECRET);
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as any;
    console.log("decodeaaaaaaaa", decoded);
    const user = await UserModel.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    console.log("user aaaaaaaaa", user);
    const newAccessToken = await generateAccessToken(user);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(403).json({ message: "Invalid refresh token 2", error: err.message });
    }
    return res.status(403).json({ message: "Invalid refresh token 2", error: String(err) });
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
async function findOrCreateUser(input: IUserInput): Promise<{
  user: IUserDoc;
  created: boolean;
}> {
  const { googleId, email, name, picture, authProvider = "google", password = "google" } = input;

  let user = await UserModel.findOne({ email });

  if (!user) {
    user = await UserModel.create({
      googleId,
      email: email ?? "abc@gmail.com",
      name: name ?? "",
      picture: picture ?? "",
      authProvider,
      password,
    });
    return { user, created: true };
  }

  return { user, created: false };
}

export const google = async (req: Request, res: Response) => {
  const { token } = req.body;
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    const { sub, email, name, picture } = payload;
    // TODO: kiểm tra DB, tạo user nếu chưa có
    if (!email) {
      return res.status(400).json({ message: "Google account has no email" });
    }
    // TODO: kiểm tra DB, tạo user nếu chưa có
    const user = await findOrCreateUser({
      googleId: sub,
      email,
      name: name ?? "Unknown User", // ✅ fallback an toàn
      picture: picture ?? "",
    });
    console.log("token user google", user);
    // Trả JWT app riêng
    return res.json({
      accessToken: await generateAccessToken(user.user),
      user: { email, name, picture },
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Google token verification failed" });
  }
};

export const facebookCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  try {
    // 1. Đổi code -> access token
    const tokenRes = await axios.get(`https://graph.facebook.com/v20.0/oauth/access_token`, {
      params: {
        client_id: process.env.FB_CLIENT_ID,
        client_secret: process.env.FB_CLIENT_SECRET,
        redirect_uri: "http://localhost:5000/api/auth/facebook/callback",
        code,
      },
    });

    const accessToken = tokenRes.data.access_token;

    // 2. Lấy thông tin user
    const userRes = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`,
    );

    const fbUser = userRes.data; //
    const { id, name, email, picture } = fbUser;
    // 3. Tạo user trong DB nếu chưa có
    const user = await findOrCreateUser({ googleId: id, email, name, picture: picture.data.url });
    // 4. Tạo JWT cho app
    const appToken = await generateAccessToken(user.user);

    res.redirect(
      `http://localhost:3000/callback?token=${appToken}&email=${encodeURIComponent(fbUser.email)}&_id=${id}&&name=${encodeURIComponent(fbUser.name)}&picture=${encodeURIComponent(fbUser.picture.data.url)}`,
    );
  } catch (err) {
    console.error("Facebook login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "The Email not already " });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashed = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordToken = hashed;
    user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();
    // sent mail to reset password
    sendEmail({
      to: email,
      subject: "Reset your password",
      htmlTemplate: "reset-password.html",
      variables: {
        name: "Hoang",
        resetLink: `${process.env.FRONTEND_ORIGIN}/reset/${resetToken}`,
      },
    });
    res.status(201).json({ message: "The Email sent successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error in Forgot password user" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) return res.status(400).json({ message: "Missing token or password" });

    // ✅ Hash lại token để khớp DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log("ddddddddddddd", hashedToken, password, new Date());
    // ✅ Tìm user có token và còn hạn
    const user = await UserModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() }, // còn hạn
    });

    if (!user) return res.status(400).json({ message: "Token invalid or expired" });

    // ✅ Hash password mới
    user.password = password;

    // ✅ Xóa token reset
    user.resetPasswordToken = "";
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

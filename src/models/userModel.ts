import mongoose, { Schema } from "mongoose";
import { IUserDoc } from "../types";
import bcrypt from "bcryptjs";

const userSchema = new Schema<IUserDoc>(
  {
    googleId: { type: String },
    picture: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
  },
  { timestamps: true },
);
// Hash password trước khi save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  if (this.password) {
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  if (this.password) return bcrypt.compare(password, this.password);
};

export const UserModel = mongoose.model<IUserDoc>("User", userSchema);

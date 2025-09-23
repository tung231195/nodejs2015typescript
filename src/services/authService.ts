import jwt from 'jsonwebtoken';
import { TokenModel } from '../models/tokenModel';
import { UserModel } from '../models/userModel';

const ACCESS_EXPIRES = '15m';
const REFRESH_EXPIRES = '7d';

export class AuthService {
  generateAccessToken(user: any) {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: ACCESS_EXPIRES });
  }
  async generateRefreshToken(user: any) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: REFRESH_EXPIRES });
    await TokenModel.findOneAndUpdate({ userId: user._id }, { token }, { upsert: true });
    return token;
  }
  async refreshAccessToken(refreshToken: string) {
    const found = await TokenModel.findOne({ token: refreshToken });
    if (!found) throw new Error('Invalid refresh token');
    const decoded: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);
    const user = await UserModel.findById(decoded.id);
    if (!user) throw new Error('User not found');
    return this.generateAccessToken(user);
  }
  async revokeRefreshToken(refreshToken: string) {
    await TokenModel.findOneAndDelete({ token: refreshToken });
  }
}

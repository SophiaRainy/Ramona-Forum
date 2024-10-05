import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'moderator' | 'admin' | 'super';
  membershipLevel: 'basic' | 'premium' | 'vip';
  currency: number;
  createdAt: Date;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  avatarFrame?: mongoose.Types.ObjectId;
  aiAssistantEnabled: boolean;
}

const UserSchema: Schema = new Schema({
  // ... 保持原有的 schema 定义不变
});

export default mongoose.model<IUser>('User', UserSchema);
import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  type: 'new_follower' | 'new_message' | 'post_like' | 'post_comment';
  read: boolean;
  createdAt: Date;
  post?: mongoose.Types.ObjectId;
}

const NotificationSchema: Schema = new Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true, enum: ['new_follower', 'new_message', 'post_like', 'post_comment'] },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
});

export default mongoose.model<INotification>('Notification', NotificationSchema);
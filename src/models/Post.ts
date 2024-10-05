import mongoose, { Document, Schema } from 'mongoose';
import elasticClient from '../services/elasticsearch';

export interface IPost extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  content: string;
  likes: number;
  comments: Array<{
    user: mongoose.Types.ObjectId;
    text: string;
    date: Date;
  }>;
  createdAt: Date;
  tags: string[];
}

const PostSchema: Schema = new Schema({
  // ... 保持原有的 schema 定义不变
});

PostSchema.post('save', function(doc) {
  elasticClient.index({
    index: 'posts',
    id: doc._id.toString(),
    body: {
      title: doc.title,
      content: doc.content,
      tags: doc.tags,
      createdAt: doc.createdAt
    }
  });
});

PostSchema.post('remove', function(doc) {
  elasticClient.delete({
    index: 'posts',
    id: doc._id.toString()
  });
});

export default mongoose.model<IPost>('Post', PostSchema);
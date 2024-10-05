import React from 'react';
import ShareButton from './ShareButton';

const PostItem = ({ post }) => {
  return (
    <div className="post-item">
      <h3>{post.title}</h3>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      {post.mediaUrl && (
        <div className="post-media">
          {post.mediaType === 'image' && <img src={post.mediaUrl} alt="帖子图片" />}
          {post.mediaType === 'video' && <video src={post.mediaUrl} controls />}
          {post.mediaType === 'audio' && <audio src={post.mediaUrl} controls />}
        </div>
      )}
      <p>作者: {post.user.username}</p>
      <ShareButton post={post} />
    </div>
  );
};

export default PostItem;
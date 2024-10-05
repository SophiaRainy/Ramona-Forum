import React, { useState } from 'react';
import axios from 'axios';

const Comment = ({ postId, token, onCommentAdded, setError }) => {
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/posts/${postId}/comments`, { text }, {
        headers: { 'x-auth-token': token }
      });
      onCommentAdded(res.data);
      setText('');
    } catch (err) {
      setError(err.response?.data?.msg || '添加评论失败');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="添加评论"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <button type="submit">提交评论</button>
    </form>
  );
};

export default Comment;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FollowingPosts = ({ token, setError }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchFollowingPosts();
  }, []);

  const fetchFollowingPosts = async () => {
    try {
      const res = await axios.get('/api/posts/following', {
        headers: { 'x-auth-token': token }
      });
      setPosts(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || '获取关注动态失败');
    }
  };

  return (
    <div>
      <h2>关注动态</h2>
      {posts.map(post => (
        <div key={post._id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <small>作者: {post.user.username}</small>
        </div>
      ))}
    </div>
  );
};

export default FollowingPosts;
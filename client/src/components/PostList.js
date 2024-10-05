import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const PostList = ({ setError }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/posts');
      setPosts(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || '获取帖子失败');
    }
  };

  const Row = ({ index, style }) => {
    const post = posts[index];
    return (
      <div style={style}>
        <h3>{post.title}</h3>
        <p>{post.content}</p>
        <small>作者: {post.user.username}</small>
      </div>
    );
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            itemCount={posts.length}
            itemSize={100}
            width={width}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

export default PostList;
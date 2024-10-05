import React, { useState } from 'react';
import axios from 'axios';

const SearchPosts: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.get(`/api/posts/search?q=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error('搜索失败:', err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索帖子..."
        />
        <button type="submit">搜索</button>
      </form>
      <div>
        {results.map((post: any) => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content.substring(0, 100)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPosts;
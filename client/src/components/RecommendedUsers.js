import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecommendedUsers = ({ token, setError }) => {
  const [recommendedUsers, setRecommendedUsers] = useState([]);

  useEffect(() => {
    fetchRecommendedUsers();
  }, []);

  const fetchRecommendedUsers = async () => {
    try {
      const res = await axios.get('/api/users/recommended', {
        headers: { 'x-auth-token': token }
      });
      setRecommendedUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || '获取推荐用户失败');
    }
  };

  return (
    <div>
      <h3>推荐关注</h3>
      <ul>
        {recommendedUsers.map(user => (
          <li key={user._id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendedUsers;
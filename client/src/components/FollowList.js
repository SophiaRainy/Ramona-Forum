import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FollowList = ({ token, setError, type }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, [type]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`/api/users/${type}`, {
        headers: { 'x-auth-token': token }
      });
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || '获取用户列表失败');
    }
  };

  return (
    <div>
      <h2>{type === 'following' ? '关注列表' : '粉丝列表'}</h2>
      <ul>
        {users.map(user => (
          <li key={user._id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default FollowList;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserBadges = ({ token, setError }) => {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const res = await axios.get('/api/badges/user', {
        headers: { 'x-auth-token': token }
      });
      setBadges(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || '获取徽章失败');
    }
  };

  return (
    <div>
      <h3>我的徽章</h3>
      {badges.map(badge => (
        <div key={badge._id}>
          <img src={badge.badge.imageUrl} alt={badge.badge.name} style={{ width: '50px', height: '50px' }} />
          <p>{badge.badge.name} - 等级 {badge.level}</p>
          <p>{badge.badge.description}</p>
        </div>
      ))}
    </div>
  );
};

export default UserBadges;
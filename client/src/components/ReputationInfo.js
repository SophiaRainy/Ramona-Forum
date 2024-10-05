import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReputationInfo = ({ token, setError }) => {
  const [reputationInfo, setReputationInfo] = useState(null);

  useEffect(() => {
    fetchReputationInfo();
  }, []);

  const fetchReputationInfo = async () => {
    try {
      const res = await axios.get('/api/users/reputation', {
        headers: { 'x-auth-token': token }
      });
      setReputationInfo(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || '获取声誉信息失败');
    }
  };

  if (!reputationInfo) return null;

  return (
    <div>
      <h3>声誉信息</h3>
      <p>声誉积分: {reputationInfo.reputation}</p>
      <p>等级: {reputationInfo.level}</p>
    </div>
  );
};

export default ReputationInfo;
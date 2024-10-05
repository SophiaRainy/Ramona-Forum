import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AvatarFrameShop = ({ token, setError }) => {
  const [frames, setFrames] = useState([]);

  useEffect(() => {
    fetchFrames();
  }, []);

  const fetchFrames = async () => {
    try {
      const res = await axios.get('/api/avatar-frames', {
        headers: { 'x-auth-token': token }
      });
      setFrames(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || '获取头像框失败');
    }
  };

  const buyFrame = async (frameId) => {
    try {
      const res = await axios.post(`/api/avatar-frames/buy/${frameId}`, {}, {
        headers: { 'x-auth-token': token }
      });
      alert(res.data.msg);
      // 更新用户信息或刷新页面
    } catch (err) {
      setError(err.response?.data?.msg || '购买头像框失败');
    }
  };

  return (
    <div>
      <h2>头像框商店</h2>
      {frames.map(frame => (
        <div key={frame._id}>
          <img src={frame.imageUrl} alt={frame.name} style={{ width: '50px', height: '50px' }} />
          <p>{frame.name} - 价格: {frame.price}</p>
          <button onClick={() => buyFrame(frame._id)}>购买</button>
        </div>
      ))}
    </div>
  );
};

export default AvatarFrameShop;
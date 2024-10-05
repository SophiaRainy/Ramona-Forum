import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = ({ token, setError, userRole }) => {
  const [vouchers, setVouchers] = useState([]);
  const [newVoucher, setNewVoucher] = useState({ code: '', value: '' });
  const [users, setUsers] = useState([]);
  const [frames, setFrames] = useState([]);
  const [newFrame, setNewFrame] = useState({ name: '', imageUrl: '', price: '' });
  const [ads, setAds] = useState([]);
  const [newAd, setNewAd] = useState({ imageUrl: '', linkUrl: '' });

  useEffect(() => {
    fetchVouchers();
    if (userRole === 'super') {
      fetchUsers();
    }
    fetchFrames();
    fetchAds();
  }, [userRole]);

  const fetchVouchers = async () => {
    try {
      const res = await axios.get('/api/vouchers', {
        headers: { 'x-auth-token': token }
      });
      setVouchers(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || '获取卡密列表失败');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users', {
        headers: { 'x-auth-token': token }
      });
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || '获取用户列表失败');
    }
  };

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

  const fetchAds = async () => {
    try {
      const res = await axios.get('/api/advertisements', {
        headers: { 'x-auth-token': token }
      });
      setAds(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || '获取广告列表失败');
    }
  };

  const handleCreateVoucher = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/vouchers/create', newVoucher, {
        headers: { 'x-auth-token': token }
      });
      setNewVoucher({ code: '', value: '' });
      fetchVouchers();
    } catch (err) {
      setError(err.response?.data?.msg || '创建卡密失败');
    }
  };

  const handleChangeUserRole = async (userId, newRole) => {
    try {
      await axios.put(`/api/admin/users/${userId}/role`, { role: newRole }, {
        headers: { 'x-auth-token': token }
      });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.msg || '更改用户角色失败');
    }
  };

  const handleCreateFrame = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/avatar-frames', newFrame, {
        headers: { 'x-auth-token': token }
      });
      setNewFrame({ name: '', imageUrl: '', price: '' });
      fetchFrames();
    } catch (err) {
      setError(err.response?.data?.msg || '创建头像框失败');
    }
  };

  const handleUpdateFrame = async (frameId, updates) => {
    try {
      await axios.put(`/api/avatar-frames/${frameId}`, updates, {
        headers: { 'x-auth-token': token }
      });
      fetchFrames();
    } catch (err) {
      setError(err.response?.data?.msg || '更新头像框失败');
    }
  };

  const handleCreateAd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/advertisements', newAd, {
        headers: { 'x-auth-token': token }
      });
      setNewAd({ imageUrl: '', linkUrl: '' });
      fetchAds();
    } catch (err) {
      setError(err.response?.data?.msg || '创建广告失败');
    }
  };

  const handleUpdateAd = async (adId, updates) => {
    try {
      await axios.put(`/api/advertisements/${adId}`, updates, {
        headers: { 'x-auth-token': token }
      });
      fetchAds();
    } catch (err) {
      setError(err.response?.data?.msg || '更新广告失败');
    }
  };

  return (
    <div>
      <h2>管理员面板</h2>
      <h3>创建新卡密</h3>
      <form onSubmit={handleCreateVoucher}>
        <input
          type="text"
          placeholder="卡密代码"
          value={newVoucher.code}
          onChange={(e) => setNewVoucher({ ...newVoucher, code: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="卡密价值"
          value={newVoucher.value}
          onChange={(e) => setNewVoucher({ ...newVoucher, value: e.target.value })}
          required
        />
        <button type="submit">创建卡密</button>
      </form>
      <h3>卡密列表</h3>
      <ul>
        {vouchers.map(voucher => (
          <li key={voucher._id}>
            代码: {voucher.code}, 价值: {voucher.value}, 
            状态: {voucher.isUsed ? '已使用' : '未使用'}
          </li>
        ))}
      </ul>
      {userRole === 'super' && (
        <>
          <h3>用户管理</h3>
          <ul>
            {users.map(user => (
              <li key={user._id}>
                {user.username} - {user.role}
                <select 
                  value={user.role} 
                  onChange={(e) => handleChangeUserRole(user._id, e.target.value)}
                >
                  <option value="user">用户</option>
                  <option value="moderator">版主</option>
                  <option value="admin">管理员</option>
                  <option value="super">超级管理员</option>
                </select>
              </li>
            ))}
          </ul>
        </>
      )}
      <h3>头像框管理</h3>
      <form onSubmit={handleCreateFrame}>
        <input
          type="text"
          placeholder="名称"
          value={newFrame.name}
          onChange={(e) => setNewFrame({ ...newFrame, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="图片URL"
          value={newFrame.imageUrl}
          onChange={(e) => setNewFrame({ ...newFrame, imageUrl: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="价格"
          value={newFrame.price}
          onChange={(e) => setNewFrame({ ...newFrame, price: e.target.value })}
          required
        />
        <button type="submit">创建头像框</button>
      </form>
      <ul>
        {frames.map(frame => (
          <li key={frame._id}>
            {frame.name} - 价格: {frame.price}
            <input
              type="number"
              value={frame.price}
              onChange={(e) => handleUpdateFrame(frame._id, { price: e.target.value })}
            />
            <button onClick={() => handleUpdateFrame(frame._id, { isAvailable: !frame.isAvailable })}>
              {frame.isAvailable ? '下架' : '上架'}
            </button>
          </li>
        ))}
      </ul>
      <h3>广告管理</h3>
      <form onSubmit={handleCreateAd}>
        <input
          type="text"
          placeholder="图片 URL"
          value={newAd.imageUrl}
          onChange={(e) => setNewAd({ ...newAd, imageUrl: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="链接 URL"
          value={newAd.linkUrl}
          onChange={(e) => setNewAd({ ...newAd, linkUrl: e.target.value })}
          required
        />
        <button type="submit">创建广告</button>
      </form>
      <ul>
        {ads.map(ad => (
          <li key={ad._id}>
            <img src={ad.imageUrl} alt="Advertisement" style={{ width: '100px' }} />
            <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer">{ad.linkUrl}</a>
            <button onClick={() => handleUpdateAd(ad._id, { isActive: !ad.isActive })}>
              {ad.isActive ? '停用' : '启用'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
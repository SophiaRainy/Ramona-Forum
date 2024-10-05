import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RedeemVoucher from './RedeemVoucher';
import Login from './Login';
import RecommendedUsers from './RecommendedUsers';
import NotificationSettings from './NotificationSettings';
import ReputationInfo from './ReputationInfo';
import UserBadges from './UserBadges';

const Profile = ({ token, setToken, setError, userId, setCurrentPage }) => {
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token, userId]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(userId ? `/api/users/${userId}` : '/api/users/me', {
        headers: { 'x-auth-token': token }
      });
      setUser(res.data);
      setIsFollowing(res.data.followers.includes(userId));
    } catch (err) {
      setError(err.response?.data?.msg || '获取个人资料失败');
    }
  };

  const handleFollow = async () => {
    try {
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      await axios.post(`/api/users/${endpoint}/${userId}`, {}, {
        headers: { 'x-auth-token': token }
      });
      setIsFollowing(!isFollowing);
    } catch (err) {
      setError(err.response?.data?.msg || '操作失败');
    }
  };

  const handleRedeemSuccess = (newBalance) => {
    setUser(prevUser => ({ ...prevUser, currency: newBalance }));
  };

  if (!token) {
    return <Login setToken={setToken} setError={setError} />;
  }

  if (!user) return <div>加载中...</div>;

  return (
    <div>
      <h2>个人资料</h2>
      {user.avatarFrame && (
        <img src={user.avatarFrame.imageUrl} alt="头像框" style={{ width: '100px', height: '100px' }} />
      )}
      <p>用户名: {user.username}</p>
      <p>邮箱: {user.email}</p>
      <p>会员等级: {user.membershipLevel}</p>
      <p>货币: {user.currency}</p>
      <p>关注数: {user.following.length}</p>
      <p>粉丝数: {user.followers.length}</p>
      {userId && userId !== user._id && (
        <button onClick={handleFollow}>
          {isFollowing ? '取消关注' : '关注'}
        </button>
      )}
      <button onClick={() => setCurrentPage('notifications')}>查看通知</button>
      <button onClick={() => setCurrentPage('following')}>查看关注列表</button>
      <button onClick={() => setCurrentPage('followers')}>查看粉丝列表</button>
      <button onClick={() => setCurrentPage('avatarFrameShop')}>头像框商店</button>
      <h3>兑换卡密</h3>
      <RedeemVoucher token={token} onRedeemSuccess={handleRedeemSuccess} setError={setError} />
      <RecommendedUsers token={token} setError={setError} />
      <button onClick={() => setShowNotificationSettings(!showNotificationSettings)}>
        {showNotificationSettings ? '隐藏通知设置' : '显示通知设置'}
      </button>
      {showNotificationSettings && (
        <NotificationSettings token={token} setError={setError} />
      )}
      <ReputationInfo token={token} setError={setError} />
      <UserBadges token={token} setError={setError} />
    </div>
  );
};

export default Profile;
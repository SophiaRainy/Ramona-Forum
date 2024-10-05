import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationSettings = ({ token, setError }) => {
  const [settings, setSettings] = useState({
    newFollower: true,
    newMessage: true,
    postLike: true,
    postComment: true
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get('/api/users/notification-settings', {
        headers: { 'x-auth-token': token }
      });
      setSettings(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || '获取通知设置失败');
    }
  };

  const handleChange = async (e) => {
    const { name, checked } = e.target;
    try {
      const updatedSettings = { ...settings, [name]: checked };
      await axios.put('/api/users/notification-settings', updatedSettings, {
        headers: { 'x-auth-token': token }
      });
      setSettings(updatedSettings);
    } catch (err) {
      setError(err.response?.data?.msg || '更新通知设置失败');
    }
  };

  return (
    <div>
      <h2>通知设置</h2>
      <div>
        <label>
          <input
            type="checkbox"
            name="newFollower"
            checked={settings.newFollower}
            onChange={handleChange}
          />
          新关注者通知
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="newMessage"
            checked={settings.newMessage}
            onChange={handleChange}
          />
          新消息通知
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="postLike"
            checked={settings.postLike}
            onChange={handleChange}
          />
          帖子点赞通知
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="postComment"
            checked={settings.postComment}
            onChange={handleChange}
          />
          帖子评论通知
        </label>
      </div>
    </div>
  );
};

export default NotificationSettings;
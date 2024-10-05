import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = ({ token, setError, socket }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
    if (socket) {
      socket.on('newNotification', handleNewNotification);
    }
    return () => {
      if (socket) {
        socket.off('newNotification');
      }
    };
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/users/notifications', {
        headers: { 'x-auth-token': token }
      });
      setNotifications(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || '获取通知失败');
    }
  };

  const handleNewNotification = (notification) => {
    setNotifications(prevNotifications => [notification, ...prevNotifications]);
    playNotificationSound();
    showDesktopNotification(notification);
  };

  const playNotificationSound = () => {
    const audio = new Audio('/notification-sound.mp3');
    audio.play();
  };

  const showDesktopNotification = (notification) => {
    if (Notification.permission === 'granted') {
      new Notification('新通知', {
        body: renderNotificationContent(notification),
        icon: '/path/to/icon.png'
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          showDesktopNotification(notification);
        }
      });
    }
  };

  const renderNotificationContent = (notification) => {
    switch (notification.type) {
      case 'new_follower':
        return `${notification.sender.username} 关注了你`;
      // 可以根据需要添加其他类型的通知
      default:
        return '新通知';
    }
  };

  return (
    <div>
      <h2>通知</h2>
      {notifications.length === 0 ? (
        <p>暂无通知</p>
      ) : (
        <ul>
          {notifications.map(notification => (
            <li key={notification._id} style={{ marginBottom: '10px' }}>
              {renderNotificationContent(notification)}
              <br />
              <small>{new Date(notification.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
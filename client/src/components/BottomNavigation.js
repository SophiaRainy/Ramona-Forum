import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BottomNavigation = ({ setCurrentPage, token }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get('/api/users/notifications/unread-count', {
        headers: { 'x-auth-token': token }
      });
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error('Failed to fetch unread notifications count:', err);
    }
  };

  return (
    <nav style={styles.nav}>
      <button style={styles.button} onClick={() => setCurrentPage('home')}>首页</button>
      <button style={styles.button} onClick={() => setCurrentPage('followingPosts')}>关注动态</button>
      <button style={styles.button} onClick={() => setCurrentPage('createPost')}>发帖</button>
      <button style={styles.button} onClick={() => setCurrentPage('chat')}>私聊</button>
      <button style={styles.button} onClick={() => setCurrentPage('profile')}>
        个人
        {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
      </button>
    </nav>
  );
};

const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    padding: '10px 0',
    borderTop: '1px solid #e0e0e0',
  },
  button: {
    border: 'none',
    background: 'none',
    fontSize: '14px',
    cursor: 'pointer',
  },
  badge: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    padding: '2px 5px',
    borderRadius: '50%',
    background: 'red',
    color: 'white',
    fontSize: '12px',
  }
};

export default BottomNavigation;
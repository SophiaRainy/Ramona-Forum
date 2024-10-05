import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Advertisement = ({ onClose, userIsPremium }) => {
  const [ad, setAd] = useState(null);
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (!userIsPremium) {
      fetchAd();
    }
  }, [userIsPremium]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const fetchAd = async () => {
    try {
      const res = await axios.get('/api/advertisements/active');
      setAd(res.data);
    } catch (err) {
      console.error('Failed to fetch advertisement:', err);
    }
  };

  const handleAdClick = async () => {
    if (ad) {
      try {
        await axios.post(`/api/advertisements/click/${ad._id}`);
      } catch (err) {
        console.error('Failed to record ad click:', err);
      }
    }
  };

  if (userIsPremium || !ad) {
    return null;
  }

  return (
    <div style={styles.overlay}>
      <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" onClick={handleAdClick}>
        <img src={ad.imageUrl} alt="Advertisement" style={styles.image} />
      </a>
      {timeLeft > 0 ? (
        <p>广告将在 {timeLeft} 秒后关闭</p>
      ) : (
        <button onClick={onClose}>关闭广告</button>
      )}
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  image: {
    maxWidth: '80%',
    maxHeight: '80%',
  },
};

export default Advertisement;
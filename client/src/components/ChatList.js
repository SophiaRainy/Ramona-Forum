import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatList = ({ token, setError, onSelectChat }) => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await axios.get('/api/messages/conversations', {
        headers: { 'x-auth-token': token }
      });
      setConversations(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || '获取对话列表失败');
    }
  };

  return (
    <div>
      <h2>私聊列表</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {conversations.map(conv => (
          <li 
            key={conv._id} 
            onClick={() => onSelectChat(conv.user._id)}
            style={{ 
              padding: '10px', 
              border: '1px solid #ddd', 
              marginBottom: '5px', 
              cursor: 'pointer' 
            }}
          >
            <strong>{conv.user.username}</strong>
            <br />
            最后消息: {conv.lastMessage.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
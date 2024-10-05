import React, { useState, useEffect } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import axios from 'axios';

const Chat = ({ token, setError }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [aiAssistantEnabled, setAiAssistantEnabled] = useState(false);

  useEffect(() => {
    fetchAIAssistantStatus();
  }, []);

  const fetchAIAssistantStatus = async () => {
    try {
      const res = await axios.get('/api/users/me', {
        headers: { 'x-auth-token': token }
      });
      setAiAssistantEnabled(res.data.aiAssistantEnabled);
    } catch (err) {
      setError(err.response?.data?.msg || '获取 AI 助手状态失败');
    }
  };

  const toggleAIAssistant = async () => {
    try {
      const res = await axios.post('/api/messages/toggle-ai', {}, {
        headers: { 'x-auth-token': token }
      });
      setAiAssistantEnabled(res.data.aiAssistantEnabled);
    } catch (err) {
      setError(err.response?.data?.msg || '切换 AI 助手失败');
    }
  };

  return (
    <div>
      <button onClick={toggleAIAssistant}>
        {aiAssistantEnabled ? '关闭 AI 助手' : '开启 AI 助手'}
      </button>
      {selectedChat ? (
        <>
          <button onClick={() => setSelectedChat(null)}>返回聊天列表</button>
          <ChatWindow token={token} setError={setError} recipientId={selectedChat} aiAssistantEnabled={aiAssistantEnabled} />
        </>
      ) : (
        <ChatList token={token} setError={setError} onSelectChat={setSelectedChat} aiAssistantEnabled={aiAssistantEnabled} />
      )}
    </div>
  );
};

export default Chat;
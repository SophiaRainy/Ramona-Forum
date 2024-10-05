import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatWindow = ({ token, setError, recipientId, aiAssistantEnabled }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (recipientId) {
      fetchMessages();
    }
  }, [recipientId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`/api/messages/${recipientId}`, {
        headers: { 'x-auth-token': token }
      });
      setMessages(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || '获取消息失败');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/messages', {
        recipient: recipientId,
        content: newMessage
      }, {
        headers: { 'x-auth-token': token }
      });
      if (Array.isArray(res.data)) {
        setMessages(prevMessages => [...prevMessages, ...res.data]);
      } else {
        setMessages(prevMessages => [...prevMessages, res.data]);
      }
      setNewMessage('');
    } catch (err) {
      setError(err.response?.data?.msg || '发送消息失败');
    }
  };

  return (
    <div>
      <h2>聊天窗口 {aiAssistantEnabled && '(AI 助手已开启)'}</h2>
      <div style={{ height: '300px', overflowY: 'scroll' }}>
        {messages.map(msg => (
          <div key={msg._id}>
            <strong>{msg.sender === recipientId ? (msg.isAIResponse ? 'AI 助手' : '对方') : '你'}:</strong> {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="输入消息"
        />
        <button type="submit">发送</button>
      </form>
    </div>
  );
};

export default ChatWindow;
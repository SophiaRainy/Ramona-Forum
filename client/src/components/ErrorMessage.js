import React from 'react';

const ErrorMessage = ({ message, onClose }) => (
  <div style={{ backgroundColor: 'pink', padding: '10px', margin: '10px 0' }}>
    {message}
    <button onClick={onClose} style={{ marginLeft: '10px' }}>关闭</button>
  </div>
);

export default ErrorMessage;
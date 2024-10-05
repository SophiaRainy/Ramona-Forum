import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken }) => {
  // ... 现有的登录逻辑

  const handleGoogleLogin = () => {
    window.location.href = '/auth/google';
  };

  const handleFacebookLogin = () => {
    window.location.href = '/auth/facebook';
  };

  return (
    <div>
      {/* ... 现有的登录表单 */}
      <button onClick={handleGoogleLogin}>使用 Google 登录</button>
      <button onClick={handleFacebookLogin}>使用 Facebook 登录</button>
    </div>
  );
};

export default Login;
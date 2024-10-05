import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthSuccess = ({ setToken }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      setToken(token);
      navigate('/');
    }
  }, [location, setToken, navigate]);

  return <div>登录成功，正在跳转...</div>;
};

export default AuthSuccess;
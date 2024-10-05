import React, { useState } from 'react';
import axios from 'axios';

const RedeemVoucher = ({ token, onRedeemSuccess, setError }) => {
  const [code, setCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/vouchers/redeem', { code }, {
        headers: { 'x-auth-token': token }
      });
      onRedeemSuccess(res.data.newBalance);
      setCode('');
      alert(res.data.msg);
    } catch (err) {
      setError(err.response?.data?.msg || '兑换失败');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="输入卡密"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
      />
      <button type="submit">兑换</button>
    </form>
  );
};

export default RedeemVoucher;
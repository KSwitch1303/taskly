import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function Withdraw() {
  const [points, setPoints] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [balance, setBalance] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .balance()
      .then(setBalance)
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.withdraw({
        points: Number(points),
        paymentDetails: { bankName, accountNumber, accountName }
      });
      setMessage('Withdrawal request submitted');
      setPoints('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card">
      <h2>Withdraw</h2>
      {balance && (
        <div className="muted">
          Available TP: {balance.points} - Minimum: {balance.minWithdrawPoints}
        </div>
      )}
      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="form">
        <label>
          T-points to withdraw
          <input
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            type="number"
            min="0"
            required
          />
        </label>
        <label>
          Bank Name
          <input value={bankName} onChange={(e) => setBankName(e.target.value)} />
        </label>
        <label>
          Account Number
          <input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
        </label>
        <label>
          Account Name
          <input value={accountName} onChange={(e) => setAccountName(e.target.value)} />
        </label>
        <button type="submit">Request Withdrawal</button>
      </form>
    </div>
  );
}

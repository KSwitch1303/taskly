import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';

export default function Register({ onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.register({ email, password, referralCode: referralCode || undefined });
      localStorage.setItem('token', data.token);
      onAuth(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Create Account</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="form">
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <label>
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </label>
        <label>
          Referral Code (optional)
          <input
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            type="text"
          />
        </label>
        <button disabled={loading} type="submit">
          {loading ? 'Creating...' : 'Register'}
        </button>
      </form>
      <p className="helper">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

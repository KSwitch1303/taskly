import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function Dashboard({ user }) {
  const [balance, setBalance] = useState(null);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .balance()
      .then((data) => setBalance(data))
      .catch((err) => setError(err.message));
    api
      .adgemEvents()
      .then((data) => setEvents(data.events || []))
      .catch(() => {});
  }, []);

  const clickCount = events.filter((c) => c.status === 'clicked').length;
  const postbackCount = events.filter((c) => c.status === 'postback').length;

  return (
    <div className="card">
      <h2>Dashboard</h2>
      {error && <div className="error">{error}</div>}
      <div className="grid">
        <div className="panel">
          <div className="label">T-points</div>
          <div className="value">{balance ? balance.points : '...'}</div>
        </div>
        <div className="panel">
          <div className="label">Estimated NGN</div>
          <div className="value">{balance ? balance.ngnEstimate.toFixed(2) : '...'}</div>
        </div>
        <div className="panel">
          <div className="label">Referral Code</div>
          <div className="value">{user.referralCode}</div>
        </div>
        <div className="panel">
          <div className="label">Offerwall Clicks</div>
          <div className="value">{clickCount}</div>
        </div>
        <div className="panel">
          <div className="label">Postbacks</div>
          <div className="value">{postbackCount}</div>
        </div>
      </div>

      <div className="actions">
        <Link className="primary" to="/earn">
          Go to Offerwall
        </Link>
      </div>

      <div className="muted">
        Rewards may take 5-30 minutes after completion. Postbacks appear once AdGem confirms.
      </div>

      {balance && (
        <div className="muted">
          Minimum withdrawal: NGN {balance.minWithdrawNgn} ({balance.minWithdrawPoints} TP)
        </div>
      )}
    </div>
  );
}

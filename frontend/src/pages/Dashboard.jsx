import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function Dashboard({ user }) {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState('');
  const smartLinkBase = import.meta.env.VITE_CPA_SMARTLINK_BASE || '';

  useEffect(() => {
    api
      .balance()
      .then((data) => setBalance(data))
      .catch((err) => setError(err.message));
  }, []);

  const offerUrl = smartLinkBase
    ? `${smartLinkBase}${smartLinkBase.includes('?') ? '&' : '?'}subid=${user._id}`
    : '';

  return (
    <div className="card">
      <h2>Dashboard</h2>
      {error && <div className="error">{error}</div>}
      <div className="grid">
        <div className="panel">
          <div className="label">Points</div>
          <div className="value">{balance ? balance.points : '...'}</div>
        </div>
        <div className="panel">
          <div className="label">Estimated NGN</div>
          <div className="value">
            {balance ? balance.ngnEstimate.toFixed(2) : '...'}
          </div>
        </div>
        <div className="panel">
          <div className="label">Referral Code</div>
          <div className="value">{user.referralCode}</div>
        </div>
      </div>

      <div className="actions">
        {offerUrl ? (
          <a className="primary" href={offerUrl} target="_blank" rel="noreferrer">
            Complete Offers & Earn
          </a>
        ) : (
          <div className="muted">
            Set <code>VITE_CPA_SMARTLINK_BASE</code> to enable offers
          </div>
        )}
      </div>

      {balance && (
        <div className="muted">
          Minimum withdrawal: ₦{balance.minWithdrawNgn} ({balance.minWithdrawPoints} points)
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function Dashboard({ user }) {
  const [balance, setBalance] = useState(null);
  const [clicks, setClicks] = useState([]);
  const [error, setError] = useState('');
  const [clickError, setClickError] = useState('');
  const [message, setMessage] = useState('');
  const smartLinkBase = import.meta.env.VITE_CPA_SMARTLINK_BASE || '';

  useEffect(() => {
    api
      .balance()
      .then((data) => setBalance(data))
      .catch((err) => setError(err.message));
    api
      .offerClicks()
      .then((data) => setClicks(data.clicks || []))
      .catch(() => {});
  }, []);

  const offerUrl = smartLinkBase
    ? `${smartLinkBase}${smartLinkBase.includes('?') ? '&' : '?'}subid=${user._id}`
    : '';

  const pendingCount = clicks.filter((c) => c.status === 'pending').length;
  const confirmedCount = clicks.filter((c) => c.status === 'confirmed').length;

  const handleOfferClick = async () => {
    setClickError('');
    setMessage('');
    if (!offerUrl) return;
    window.open(offerUrl, '_blank', 'noopener,noreferrer');
    try {
      await api.offerClick();
      setMessage('Offer opened. Earnings may take 5–30 minutes to reflect.');
      const data = await api.offerClicks();
      setClicks(data.clicks || []);
    } catch (err) {
      setClickError(err.message);
    }
  };

  return (
    <div className="card">
      <h2>Dashboard</h2>
      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}
      {clickError && <div className="error">{clickError}</div>}
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
        <div className="panel">
          <div className="label">Pending Earnings</div>
          <div className="value">{pendingCount}</div>
        </div>
        <div className="panel">
          <div className="label">Confirmed Earnings</div>
          <div className="value">{confirmedCount}</div>
        </div>
      </div>

      <div className="actions">
        {offerUrl ? (
          <button className="primary" onClick={handleOfferClick}>
            Complete Offers & Earn
          </button>
        ) : (
          <div className="muted">
            Set <code>VITE_CPA_SMARTLINK_BASE</code> to enable offers
          </div>
        )}
      </div>

      <div className="muted">
        Rewards may take 5–30 minutes to reflect after completing an offer.
      </div>

      {balance && (
        <div className="muted">
          Minimum withdrawal: ₦{balance.minWithdrawNgn} ({balance.minWithdrawPoints} points)
        </div>
      )}
    </div>
  );
}

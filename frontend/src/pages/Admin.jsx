import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function Admin() {
  const [status, setStatus] = useState('pending');
  const [withdrawals, setWithdrawals] = useState([]);
  const [clickStatus, setClickStatus] = useState('pending');
  const [offerClicks, setOfferClicks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clickLoading, setClickLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [clickError, setClickError] = useState('');

  const loadWithdrawals = async (currentStatus) => {
    setLoading(true);
    setError('');
    try {
      const data = await api.adminWithdrawals(currentStatus);
      setWithdrawals(data.withdrawals || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWithdrawals(status);
  }, [status]);

  useEffect(() => {
    const loadClicks = async () => {
      setClickLoading(true);
      setClickError('');
      try {
        const data = await api.adminOfferClicks(clickStatus);
        setOfferClicks(data.clicks || []);
      } catch (err) {
        setClickError(err.message);
      } finally {
        setClickLoading(false);
      }
    };
    loadClicks();
  }, [clickStatus]);

  const handleApprove = async (id) => {
    setMessage('');
    setError('');
    try {
      await api.approveWithdrawal(id);
      setMessage('Withdrawal approved');
      loadWithdrawals(status);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReject = async (id) => {
    setMessage('');
    setError('');
    try {
      await api.rejectWithdrawal(id);
      setMessage('Withdrawal rejected');
      loadWithdrawals(status);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card">
      <div className="admin-header">
        <h2>Admin Withdrawals</h2>
        <div className="admin-controls">
          <label>
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="pending">pending</option>
              <option value="approved">approved</option>
              <option value="rejected">rejected</option>
            </select>
          </label>
          <button onClick={() => loadWithdrawals(status)} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}

      <div className="table">
        <div className="row header admin-row">
          <div>User</div>
          <div>Points</div>
          <div>NGN</div>
          <div>Status</div>
          <div>Requested</div>
          <div>Actions</div>
        </div>
        {withdrawals.length === 0 && <div className="muted">No withdrawals found.</div>}
        {withdrawals.map((wd) => (
          <div className="row admin-row" key={wd._id}>
            <div>{wd.user?.email || wd.user}</div>
            <div>{wd.points}</div>
            <div>{Number(wd.ngnAmount).toFixed(2)}</div>
            <div>{wd.status}</div>
            <div>{new Date(wd.createdAt).toLocaleString()}</div>
            <div className="admin-actions">
              {wd.status === 'pending' ? (
                <>
                  <button onClick={() => handleApprove(wd._id)}>Approve</button>
                  <button className="danger" onClick={() => handleReject(wd._id)}>
                    Reject
                  </button>
                </>
              ) : (
                <span className="muted">—</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="divider" />

      <div className="admin-header">
        <h3>Offer Clicks</h3>
        <div className="admin-controls">
          <label>
            Status
            <select value={clickStatus} onChange={(e) => setClickStatus(e.target.value)}>
              <option value="clicked">clicked</option>
              <option value="pending">pending</option>
              <option value="confirmed">confirmed</option>
              <option value="expired">expired</option>
            </select>
          </label>
          <button onClick={() => setClickStatus((s) => s)} disabled={clickLoading}>
            {clickLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {clickError && <div className="error">{clickError}</div>}

      <div className="table">
        <div className="row header admin-click-row">
          <div>User</div>
          <div>Status</div>
          <div>USD</div>
          <div>Points</div>
          <div>Txid</div>
          <div>Created</div>
        </div>
        {offerClicks.length === 0 && <div className="muted">No offer clicks found.</div>}
        {offerClicks.map((click) => (
          <div className="row admin-click-row" key={click._id}>
            <div>{click.user?.email || click.user}</div>
            <div>{click.status}</div>
            <div>{Number(click.amountUsd || 0).toFixed(2)}</div>
            <div>{click.points || 0}</div>
            <div className="truncate">{click.txid || '—'}</div>
            <div>{new Date(click.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

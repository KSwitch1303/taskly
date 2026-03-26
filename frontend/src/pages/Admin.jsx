import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function Admin() {
  const [status, setStatus] = useState('pending');
  const [withdrawals, setWithdrawals] = useState([]);
  const [adgemStatus, setAdgemStatus] = useState('all');
  const [adgemEvents, setAdgemEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adgemLoading, setAdgemLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [adgemError, setAdgemError] = useState('');

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

  const loadAdgemEvents = async (currentStatus) => {
    setAdgemLoading(true);
    setAdgemError('');
    try {
      const data = await api.adminAdgemEvents(currentStatus);
      setAdgemEvents(data.events || []);
    } catch (err) {
      setAdgemError(err.message);
    } finally {
      setAdgemLoading(false);
    }
  };

  useEffect(() => {
    loadWithdrawals(status);
  }, [status]);

  useEffect(() => {
    loadAdgemEvents(adgemStatus);
  }, [adgemStatus]);

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

  const clickedCount = adgemEvents.filter((e) => e.status === 'clicked').length;
  const postbackCount = adgemEvents.filter((e) => e.status === 'postback').length;

  return (
    <div className="card">
      <div className="admin-header">
        <h2>Admin Withdrawals</h2>
        <div className="admin-controls">
          <label>
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">all</option>
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
                <span className="muted">-</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="divider" />

      <div className="admin-header">
        <div>
          <h3>AdGem Events</h3>
          <div className="muted">
            Clicks: {clickedCount} - Postbacks: {postbackCount}
          </div>
        </div>
        <div className="admin-controls">
          <label>
            Status
            <select value={adgemStatus} onChange={(e) => setAdgemStatus(e.target.value)}>
              <option value="all">all</option>
              <option value="clicked">clicked</option>
              <option value="postback">postback</option>
              <option value="confirmed">confirmed</option>
            </select>
          </label>
          <button onClick={() => loadAdgemEvents(adgemStatus)} disabled={adgemLoading}>
            {adgemLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {adgemError && <div className="error">{adgemError}</div>}

      <div className="table">
        <div className="row header admin-adgem-row">
          <div>User</div>
          <div>Status</div>
          <div>USD</div>
          <div>Points</div>
          <div>Transaction</div>
          <div>Offer</div>
        </div>
        {adgemEvents.length === 0 && <div className="muted">No AdGem events found.</div>}
        {adgemEvents.map((event) => (
          <div className="row admin-adgem-row" key={event._id}>
            <div>{event.user?.email || event.user}</div>
            <div>{event.status}</div>
            <div>{Number(event.payoutUsd || 0).toFixed(2)}</div>
            <div>{event.rewardPoints || 0}</div>
            <div className="truncate">{event.transactionId || '-'}</div>
            <div className="truncate">{event.offerName || '-'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

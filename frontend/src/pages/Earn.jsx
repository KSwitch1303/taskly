import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../api';

function buildPlayerId(id) {
  if (!id) return '';
  return String(id).toLowerCase().replace(/[^a-z0-9]/g, '');
}

export default function Earn({ user }) {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [events, setEvents] = useState([]);

  const appId = import.meta.env.VITE_ADGEM_APP_ID || '';
  const wallBase = import.meta.env.VITE_ADGEM_WALL_URL || 'https://adunits.adgem.com/v1/wall';
  const playerId = buildPlayerId(user?._id);

  const wallUrl = useMemo(() => {
    if (!appId || !playerId) return '';
    try {
      const url = new URL(wallBase);
      url.searchParams.set('appid', appId);
      url.searchParams.set('playerid', playerId);
      return url.toString();
    } catch (err) {
      return '';
    }
  }, [appId, playerId, wallBase]);

  useEffect(() => {
    if (!user?._id) return;
    api
      .adgemClick()
      .then(() => setMessage('Offerwall opened. Rewards may take 5-30 minutes to appear.'))
      .catch(() => {});
    api
      .adgemEvents()
      .then((data) => setEvents(data.events || []))
      .catch(() => {});
  }, [user?._id]);

  const clickedCount = events.filter((e) => e.status === 'clicked').length;
  const postbackCount = events.filter((e) => e.status === 'postback').length;

  return (
    <div className="earn-page">
      <div className="earn-header">
        <div>
          <h2>Earn T-points</h2>
          <p className="muted">
            Complete tasks on the Taskly offerwall. Pending appears only after AdGem confirms.
          </p>
        </div>
        <div className="earn-stats">
          <div>
            <span className="label">Clicks</span>
            <strong>{clickedCount}</strong>
          </div>
          <div>
            <span className="label">Postbacks</span>
            <strong>{postbackCount}</strong>
          </div>
        </div>
      </div>

      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}

      {wallUrl ? (
        <div className="offerwall-wrap">
          <iframe
            title="Taskly Offerwall"
            src={wallUrl}
            className="offerwall-frame"
            allow="clipboard-read; clipboard-write"
          />
        </div>
      ) : (
        <div className="card">
          <h3>Offerwall pending approval</h3>
          <p className="muted">
            We are currently connecting Taskly to AdGem. Once approved, you will see live tasks
            here.
          </p>
          <div className="mock-tasks">
            <div className="mock-task">
              <div>
                <strong>Install and open a finance app</strong>
                <span>Earn 250 TP</span>
              </div>
              <span className="badge">Mobile</span>
            </div>
            <div className="mock-task">
              <div>
                <strong>Complete a short survey</strong>
                <span>Earn 180 TP</span>
              </div>
              <span className="badge">Survey</span>
            </div>
            <div className="mock-task">
              <div>
                <strong>Create a free trial account</strong>
                <span>Earn 320 TP</span>
              </div>
              <span className="badge">Signup</span>
            </div>
          </div>
          <div className="muted">
            Tip: use Chrome or your device browser for the best tracking results.
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .transactions()
      .then((data) => setTransactions(data.transactions || []))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="card">
      <h2>Transactions</h2>
      {error && <div className="error">{error}</div>}
      <div className="table">
        <div className="row header">
          <div>Type</div>
          <div>TP</div>
          <div>Date</div>
        </div>
        {transactions.length === 0 && <div className="muted">No transactions yet.</div>}
        {transactions.map((tx) => (
          <div className="row" key={tx._id}>
            <div>{tx.type}</div>
            <div>{tx.points}</div>
            <div>{new Date(tx.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}



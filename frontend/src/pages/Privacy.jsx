import React from 'react';

export default function Privacy() {
  return (
    <div className="public">
      <section className="section">
        <h1>Privacy Policy</h1>
        <p>
          Taskly collects the minimum data required to operate the reward platform and prevent
          fraud. We never sell your personal information.
        </p>
      </section>

      <section className="section">
        <h2>What we collect</h2>
        <ul className="list">
          <li>Email and account details</li>
          <li>Offer completion events from our partners</li>
          <li>Device and IP data for fraud prevention</li>
        </ul>
      </section>

      <section className="section">
        <h2>How we use data</h2>
        <ul className="list">
          <li>To credit rewards and process withdrawals</li>
          <li>To protect the platform from abuse</li>
          <li>To respond to support requests</li>
        </ul>
      </section>
    </div>
  );
}



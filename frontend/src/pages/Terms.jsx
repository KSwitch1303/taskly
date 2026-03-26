import React from 'react';

export default function Terms() {
  return (
    <div className="public">
      <section className="section">
        <h1>Terms of Service</h1>
        <p>
          By using Taskly, you agree to comply with our rules and follow all offer instructions.
          We reserve the right to withhold rewards for incomplete, duplicated, or fraudulent
          activity.
        </p>
      </section>

      <section className="section">
        <h2>Reward rules</h2>
        <ul className="list">
          <li>Complete offers fully and honestly to earn T-points.</li>
          <li>Do not use VPNs, bots, emulators, or automated tools.</li>
          <li>Only one account per person is allowed.</li>
          <li>Rewards may take time to confirm and appear in your balance.</li>
        </ul>
      </section>

      <section className="section">
        <h2>Account actions</h2>
        <p>
          We may suspend or terminate accounts that violate our policies. We may also delay or
          reverse rewards if advertisers flag the activity as invalid.
        </p>
      </section>
    </div>
  );
}

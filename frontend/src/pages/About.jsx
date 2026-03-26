import React from 'react';

export default function About() {
  return (
    <div className="public">
      <section className="section">
        <h1>About Taskly</h1>
        <p>
          Taskly is a reward platform that connects users with trusted advertiser offers. Our
          mission is to make earning simple, transparent, and fair through a virtual currency
          system called T-points (TP).
        </p>
      </section>
      <section className="section">
        <h2>What we value</h2>
        <ul className="list">
          <li>Clear instructions and honest reward expectations</li>
          <li>Fraud prevention that protects real users</li>
          <li>Reliable tracking through verified postbacks</li>
        </ul>
      </section>
      <section className="section">
        <h2>Who Taskly is for</h2>
        <p>
          Taskly is built for users who want to earn by completing legitimate online tasks. We
          do not support automated traffic, misleading incentives, or deceptive advertising.
        </p>
      </section>
    </div>
  );
}

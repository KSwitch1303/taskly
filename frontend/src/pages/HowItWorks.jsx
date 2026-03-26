import React from 'react';

export default function HowItWorks() {
  return (
    <div className="public">
      <section className="section">
        <h1>How Taskly Works</h1>
        <div className="steps">
          <div className="step">
            <span>1</span>
            <div>
              <h3>Create your account</h3>
              <p>Sign up and access the Taskly offerwall.</p>
            </div>
          </div>
          <div className="step">
            <span>2</span>
            <div>
              <h3>Choose an offer</h3>
              <p>Select an offer that matches your device and location.</p>
            </div>
          </div>
          <div className="step">
            <span>3</span>
            <div>
              <h3>Complete all steps</h3>
              <p>Follow the instructions carefully (install, open, verify, etc.).</p>
            </div>
          </div>
          <div className="step">
            <span>4</span>
            <div>
              <h3>Wait for confirmation</h3>
              <p>Postback confirmation can take 5-30 minutes before rewards appear.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section highlight">
        <div>
          <h2>Important tips</h2>
          <ul className="list">
            <li>Use Chrome or your device browser for best tracking.</li>
            <li>Do not use VPNs or automated tools - they invalidate rewards.</li>
            <li>Only one account per person is allowed.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

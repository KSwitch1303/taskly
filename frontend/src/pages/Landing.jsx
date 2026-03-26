import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="public">
      <section className="hero">
        <div className="hero-text">
          <span className="badge">Taskly - Earn T-points</span>
          <h1>Earn rewards for completing trusted offers.</h1>
          <p>
            Taskly is a reward platform where users complete offers from vetted advertisers and
            earn T-points (TP). Rewards are transparent, tracked, and protected by anti-fraud
            checks.
          </p>
          <div className="cta-row">
            <Link className="primary" to="/register">
              Get started
            </Link>
            <Link className="ghost" to="/how-it-works">
              How it works
            </Link>
          </div>
          <div className="hero-note">
            Available globally - Mobile-first - Rewards may take a few minutes to confirm
          </div>
        </div>
        <div className="hero-card">
          <div className="stat">
            <span>Step 1</span>
            <strong>Choose an offer</strong>
            <p>Pick tasks like app installs, surveys, or sign-ups.</p>
          </div>
          <div className="stat">
            <span>Step 2</span>
            <strong>Complete it fully</strong>
            <p>Follow all steps. Some offers require email verification.</p>
          </div>
          <div className="stat">
            <span>Step 3</span>
            <strong>Earn T-points</strong>
            <p>Once confirmed, your balance updates automatically.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Why Taskly</h2>
        <div className="features">
          <div>
            <h3>Transparent rewards</h3>
            <p>We show clear instructions and notify you about pending confirmations.</p>
          </div>
          <div>
            <h3>Security first</h3>
            <p>Fraud checks protect honest users and keep the platform sustainable.</p>
          </div>
          <div>
            <h3>Built for real users</h3>
            <p>Mobile-friendly experience with a dedicated offerwall.</p>
          </div>
        </div>
      </section>

      <section className="section highlight">
        <div>
          <h2>Earn T-points, redeem with confidence</h2>
          <p>
            T-points (TP) are Taskly's virtual currency. Earn TP by completing offers and redeem
            once you reach the minimum threshold. We never ask users to pay to earn.
          </p>
        </div>
        <Link className="primary" to="/register">
          Create your account
        </Link>
      </section>
    </div>
  );
}

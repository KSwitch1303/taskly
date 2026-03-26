import React from 'react';

export default function Contact() {
  return (
    <div className="public">
      <section className="section">
        <h1>Contact</h1>
        <p>
          Need help? Reach out to our support team and we will get back to you as soon as possible.
        </p>
        <div className="contact-card">
          <div>
            <span>Support email</span>
            <strong>support@taskly.app</strong>
          </div>
          <div>
            <span>Response time</span>
            <strong>Within 24-48 hours</strong>
          </div>
        </div>
      </section>
    </div>
  );
}

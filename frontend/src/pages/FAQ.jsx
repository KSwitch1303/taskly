import React from 'react';

export default function FAQ() {
  return (
    <div className="public">
      <section className="section">
        <h1>FAQ</h1>
        <div className="faq">
          <div>
            <h3>Why is my reward pending?</h3>
            <p>
              Rewards show as pending only after the offer provider sends a postback to Taskly.
              This can take a few minutes depending on the offer.
            </p>
          </div>
          <div>
            <h3>When can I withdraw?</h3>
            <p>Withdrawals are available once you reach the minimum T-points threshold.</p>
          </div>
          <div>
            <h3>Why was my reward rejected?</h3>
            <p>
              Rewards may be rejected if the offer was incomplete, duplicated, or flagged as
              suspicious by the advertiser.
            </p>
          </div>
          <div>
            <h3>Do I need to pay to earn?</h3>
            <p>No. Taskly never requires payment to access tasks or earn rewards.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

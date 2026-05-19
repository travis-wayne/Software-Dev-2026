import React from 'react';

export default function DisplayMessage({ message }) {
  if (!message) {
    return <div className="message-box message-box--empty">No message provided.</div>;
  }
  
  return (
    <div className="message-box">
      <span className="message-icon">💬</span>
      <p className="message-text">{message}</p>
    </div>
  );
}

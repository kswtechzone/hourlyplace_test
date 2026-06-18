'use client';

import { useState } from 'react';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('Thank you for subscribing! We\'ll keep you updated.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="subscribe-form">
      <div className="subscribe-input-group">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={status === 'loading' || status === 'success'}
          className="subscribe-input"
        />
        <button type="submit" disabled={status === 'loading' || status === 'success'} className="subscribe-button">
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </div>
      {status === 'success' && <p className="subscribe-message success">{message}</p>}
      {status === 'error' && <p className="subscribe-message error">{message}</p>}
    </form>
  );
}

import React from 'react';

export default function Loader({ message = 'Analyzing image...', sub = 'Running AI detection model' }) {
  return (
    <div className="loader-wrapper animate-fade">
      <div className="loader-ring">
        <div className="loader-ring-track" />
        <div className="loader-ring-spin" />
        <div className="loader-inner-dot" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p className="loader-text">{message}</p>
        <p className="loader-subtext">{sub}</p>
      </div>
      <LoadingDots />
    </div>
  );
}

function LoadingDots() {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--primary)',
            opacity: 0.4,
            animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            display: 'inline-block',
          }}
        />
      ))}
      <style>{`
        @keyframes dotBounce {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40%            { opacity: 1;   transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

import React from 'react';

/* ─── Confidence helpers ──────────────────────────────────────────── */
function confidenceClass(pct) {
  if (pct >= 85) return 'high';
  if (pct >= 60) return 'mid';
  return 'low';
}

/* ─── Sub-components ──────────────────────────────────────────────── */
function DetailRow({ icon, label, value, valueClass = '' }) {
  return (
    <div className="detail-row">
      <span className="detail-label">
        <span className="dl-icon">{icon}</span>
        {label}
      </span>
      <span className={`detail-value ${valueClass}`}>{value}</span>
    </div>
  );
}

function ConfidenceBar({ confidence }) {
  const pct = Math.round((confidence ?? 0) * 100);
  const cls = confidenceClass(pct);
  return (
    <div className="confidence-bar-wrap">
      <div className="confidence-bar-header">
        <span>Model Confidence</span>
        <strong>{pct}%</strong>
      </div>
      <div className="conf-track">
        <div
          className={`conf-fill ${cls}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function DetectedImagePreview({ src, label }) {
  if (!src) {
    return (
      <div className="detected-preview">
        <div className="no-preview-overlay">
          <span style={{ fontSize: 28 }}>🖼️</span>
          <span>No annotated image returned</span>
        </div>
      </div>
    );
  }
  return (
    <div className="detected-preview">
      <img src={src} alt="Detected result" />
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          left: 10,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(8px)',
          color: '#fff',
          fontSize: 11,
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          letterSpacing: '0.04em',
        }}
      >
        🤖 {label}
      </div>
    </div>
  );
}

/* ─── Main ResultCard ─────────────────────────────────────────────── */
export default function ResultCard({ result }) {
  if (!result) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <h3>No results yet</h3>
        <p>Upload an image or capture from webcam to run detection.</p>
      </div>
    );
  }

  const {
    vehicle_number,
    helmet_detected,
    violation,
    confidence,
    detected_image_url,
    timestamp,
  } = result;

  const isViolation = violation ?? !helmet_detected;
  const statusCls = isViolation ? 'violation' : 'clear';
  const pct = Math.round((confidence ?? 0) * 100);
  const confCls = confidenceClass(pct);
  const timeStr = timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="result-card">

      {/* ── Status Banner ── */}
      <div className={`result-status-banner ${statusCls}`}>
        <div className="status-icon-wrap">
          {isViolation ? '🚨' : '✅'}
        </div>
        <div className="status-text">
          <strong>{isViolation ? 'Violation Detected' : 'No Violation'}</strong>
          <span>
            {isViolation
              ? 'Rider not wearing helmet — challan eligible'
              : 'Helmet worn correctly — compliant rider'}
          </span>
        </div>
      </div>

      {/* ── Annotated image ── */}
      <DetectedImagePreview
        src={detected_image_url}
        label={isViolation ? 'Violation flagged' : 'Cleared'}
      />

      {/* ── Confidence bar ── */}
      <ConfidenceBar confidence={confidence} />

      {/* ── Detail rows ── */}
      <div className="detail-section">
        <DetailRow
          icon="🔢"
          label="Number Plate"
          value={vehicle_number || 'Unreadable'}
          valueClass={vehicle_number ? 'plate' : ''}
        />
        <DetailRow
          icon="⛑️"
          label="Helmet Status"
          value={helmet_detected ? '✔ Detected' : '✘ Not Detected'}
          valueClass={helmet_detected ? 'confidence-high' : 'confidence-low'}
        />
        <DetailRow
          icon="📊"
          label="Confidence"
          value={`${pct}%`}
          valueClass={`confidence-${confCls}`}
        />
        <DetailRow
          icon="🕐"
          label="Captured At"
          value={timeStr}
        />
      </div>

      {/* ── Action row ── */}
      <div style={{ display: 'flex', gap: 10 }}>
        {isViolation && (
          <button
            className="btn btn-primary"
            style={{ flex: 1, borderRadius: 'var(--radius-sm)', padding: '10px 16px', fontSize: 13 }}
            onClick={() => alert(`Challan issued for ${vehicle_number || 'unknown plate'}`)}
          >
            🧾 Issue Challan
          </button>
        )}
        <button
          className="btn btn-ghost"
          style={{ flex: 1, borderRadius: 'var(--radius-sm)', padding: '10px 16px', fontSize: 13 }}
          onClick={() => {
            const data = JSON.stringify(result, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `viowatch_${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          ⬇ Export JSON
        </button>
      </div>

    </div>
  );
}

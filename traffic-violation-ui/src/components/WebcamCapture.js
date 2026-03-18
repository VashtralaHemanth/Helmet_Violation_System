import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';

const VIDEO_CONSTRAINTS = {
  width: { ideal: 1280 },
  height: { ideal: 720 },
  facingMode: 'environment',
};

export default function WebcamCapture({ onDetect, isLoading }) {
  const webcamRef  = useRef(null);
  const [captured, setCaptured] = useState(null);
  const [capturedBlob, setCapturedBlob] = useState(null);
  const [flash, setFlash]       = useState(false);
  const [camError, setCamError] = useState(false);
  const [camReady, setCamReady] = useState(false);

  /* ── Capture frame ── */
  const capture = useCallback(() => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    // Flash effect
    setFlash(true);
    setTimeout(() => setFlash(false), 350);

    setCaptured(imageSrc);

    // Convert base64 → Blob
    fetch(imageSrc)
      .then((r) => r.blob())
      .then((blob) => setCapturedBlob(blob));
  }, []);

  const retake = () => {
    setCaptured(null);
    setCapturedBlob(null);
  };

  const handleDetect = () => {
    if (capturedBlob && !isLoading) {
      const file = new File([capturedBlob], `webcam_${Date.now()}.jpg`, { type: 'image/jpeg' });
      onDetect(file);
    }
  };

  /* ── Render ── */
  return (
    <div>
      <div className="panel-title">
        <div className="panel-icon">📷</div>
        Live Camera
      </div>

      <div className="webcam-container">
        {!captured ? (
          <>
            {!camError ? (
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                screenshotQuality={0.92}
                videoConstraints={VIDEO_CONSTRAINTS}
                onUserMedia={() => setCamReady(true)}
                onUserMediaError={() => setCamError(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <CamErrorState />
            )}

            {flash && <div className="capture-flash" />}

            {/* Overlay */}
            <div className="webcam-overlay" />

            {camReady && !camError && (
              <div className="webcam-status">
                <span className="live-dot" /> LIVE
              </div>
            )}

            {/* Corner decoration (bottom-left mirror) */}
            <svg
              style={{ position: 'absolute', bottom: 14, left: 14, pointerEvents: 'none' }}
              width="24" height="24" viewBox="0 0 24 24" fill="none"
            >
              <path d="M0 24 L0 6 Q0 0 6 0" stroke="rgb(133,57,83)" strokeWidth="3" fill="none"
                strokeDasharray="120" strokeDashoffset="120"
                style={{ animation: 'drawLine 0.6s 0.3s forwards' }}
              />
            </svg>
          </>
        ) : (
          <img src={captured} alt="Captured" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        )}
      </div>

      {/* Button row */}
      <div className="webcam-btn-row">
        {!captured ? (
          <button
            className="btn btn-primary"
            style={{ borderRadius: 'var(--radius-sm)', padding: '12px', fontSize: 14 }}
            onClick={capture}
            disabled={!camReady || camError || isLoading}
          >
            📸 Capture Frame
          </button>
        ) : (
          <>
            <button
              className="btn btn-outline"
              style={{ borderRadius: 'var(--radius-sm)', padding: '12px', fontSize: 14 }}
              onClick={retake}
              disabled={isLoading}
            >
              🔄 Retake
            </button>
            <button
              className="btn btn-primary"
              style={{ borderRadius: 'var(--radius-sm)', padding: '12px', fontSize: 14 }}
              onClick={handleDetect}
              disabled={!capturedBlob || isLoading}
            >
              {isLoading ? (
                <><SpinIcon /> Analyzing…</>
              ) : (
                <><ScanIcon /> Detect</>
              )}
            </button>
          </>
        )}
      </div>

      {camReady && !captured && (
        <p style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 10, textAlign: 'center' }}>
          📌 Position the vehicle clearly in frame before capturing
        </p>
      )}
    </div>
  );
}

/* ── Error fallback ── */
function CamErrorState() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '100%', gap: 10, color: 'rgba(255,255,255,0.5)', padding: 20, textAlign: 'center',
    }}>
      <span style={{ fontSize: 36 }}>📵</span>
      <p style={{ fontSize: 13, fontWeight: 600 }}>Camera Access Denied</p>
      <p style={{ fontSize: 12 }}>Please allow camera permissions in your browser settings and reload.</p>
    </div>
  );
}

function ScanIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/>
      <path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
      <rect x="7" y="7" width="10" height="10" rx="1"/>
    </svg>
  );
}

function SpinIcon() {
  return (
    <span style={{
      width: 15, height: 15,
      border: '2.5px solid rgba(255,255,255,0.35)',
      borderTopColor: '#fff', borderRadius: '50%',
      display: 'inline-block',
      animation: 'spin 0.75s linear infinite',
    }} />
  );
}

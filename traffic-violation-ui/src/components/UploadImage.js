import React, { useState, useRef } from 'react';

export default function UploadImage({ onDetect, isLoading }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile]       = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  /* ── File helpers ── */
  const handleFile = (f) => {
    if (!f || !f.type.startsWith('image/')) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  const handleInputChange = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDetect = () => {
    if (file && !isLoading) onDetect(file);
  };

  const clear = (e) => {
    e.stopPropagation();
    setPreview(null);
    setFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  /* ── Render ── */
  return (
    <div>
      <div className="panel-title">
        <div className="panel-icon">🖼️</div>
        Upload Image
      </div>

      {/* Drop zone / preview */}
      {preview ? (
        <div className="preview-container animate-fade">
          <img src={preview} alt="Preview" />
          <div className="preview-badge">
            📁 {file?.name?.slice(0, 22)}{file?.name?.length > 22 ? '…' : ''}
          </div>
          <button
            className="btn btn-ghost preview-change-btn"
            style={{ fontSize: 12, padding: '6px 12px', borderRadius: 8 }}
            onClick={clear}
          >
            ✕ Remove
          </button>
        </div>
      ) : (
        <label
          className={`upload-zone ${dragging ? 'dragging' : ''}`}
          onDragEnter={() => setDragging(true)}
          onDragLeave={() => setDragging(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
          />
          <span className="upload-icon">📤</span>
          <h3>Drop image here or click to browse</h3>
          <p>
            Supports JPG, PNG, WEBP up to 10MB<br />
            Best results with clear, well-lit images
          </p>
        </label>
      )}

      {/* Actions */}
      <div className="action-row">
        <button
          className="btn btn-primary detect-btn"
          onClick={handleDetect}
          disabled={!file || isLoading}
        >
          {isLoading ? (
            <>
              <SpinIcon /> Analyzing…
            </>
          ) : (
            <>
              <ScanIcon /> Run Detection
            </>
          )}
        </button>

        {preview && !isLoading && (
          <button
            className="btn btn-outline"
            style={{ width: '100%', borderRadius: 'var(--radius-sm)', padding: '10px' }}
            onClick={clear}
          >
            🔄 Clear & Upload New
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Inline SVG icons ── */
function ScanIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <rect x="7" y="7" width="10" height="10" rx="1" />
    </svg>
  );
}

function SpinIcon() {
  return (
    <span
      style={{
        width: 16,
        height: 16,
        border: '2.5px solid rgba(255,255,255,0.35)',
        borderTopColor: '#fff',
        borderRadius: '50%',
        display: 'inline-block',
        animation: 'spin 0.75s linear infinite',
      }}
    />
  );
}

import React, { useState, useCallback, useEffect } from 'react';
import UploadImage from '../components/UploadImage';
import WebcamCapture from '../components/WebcamCapture';
import ResultCard from '../components/ResultCard';
import Loader from '../components/Loader';
import ViolationTable from "../components/ViolationTable";

import { detectViolation, getViolations } from '../api/api';
import '../styles/dashboard.css';

/* ─── Toast Hook ───────────────────────────────── */
function useToast() {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((type, title, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return { toasts, add };
}

const TOAST_ICONS = {
  success: '✅',
  error: '🚨',
  warning: '⚠️',
  info: 'ℹ️'
};

/* ─── Helper ───────────────────────────────── */
function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/* ─── Dashboard ───────────────────────────────── */
export default function Dashboard({ activeTab, onTabChange }) {

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const { toasts, add: addToast } = useToast();

  /* ─── Load history from DB ───────────────── */
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await getViolations();

      const formatted = res.data.map(v => ({
        id: v.id,
        vehicle_number: v.plate,
        violation: true,
        timestamp: v.time,
        confidence: 0.95
      }));

      setHistory(formatted);
    } catch (err) {
      console.error("❌ Failed to load history:", err);
    }
  };

  /* ─── Stats ───────────────── */
  const totalScans = history.length;
  const violations = history.filter(h => h.violation).length;
  const cleared = history.filter(h => !h.violation).length;

  /* ─── Detection ───────────────── */
  const handleDetect = useCallback(async (imageFile) => {

    setIsLoading(true);
    setResult(null);

    try {
      let data = await detectViolation(imageFile);

      // 🔥 FIX: normalize backend response
      data = {
        vehicle_number: data.vehicle || data.vehicle_number,
        violation: data.violation,
        timestamp: data.timestamp,
        confidence: data.confidence || 0.95
      };

      setResult(data);

      // update history locally
      setHistory(prev => [
        { ...data, id: Date.now() },
        ...prev
      ].slice(0, 20));

      if (data.violation) {
        addToast('error', 'Violation Detected!', `Plate: ${data.vehicle_number}`);
      } else {
        addToast('success', 'No Violation', `Plate: ${data.vehicle_number}`);
      }

    } catch (err) {
      console.error(err);
      addToast('error', 'Detection Failed', err.message);
    } finally {
      setIsLoading(false);
    }

  }, [addToast]);

  /* ─── UI ───────────────── */
  return (
    <>
      <div className="dashboard-wrapper">

        {/* Header */}
        <div className="dashboard-hero">
          <h1>🚦 Traffic Violation Detection</h1>
          <p>AI-based helmet violation system</p>
        </div>

        {/* Stats */}
        <div className="stats-strip">
          <div>Total: {totalScans}</div>
          <div>Violations: {violations}</div>
          <div>Cleared: {cleared}</div>
        </div>

        {/* Tabs */}
        <div className="tab-switcher">
          <button
            className={activeTab === "upload" ? "active" : ""}
            onClick={() => onTabChange("upload")}
          >
            Upload
          </button>

          <button
            className={activeTab === "webcam" ? "active" : ""}
            onClick={() => onTabChange("webcam")}
          >
            Webcam
          </button>
        </div>

        {/* Main */}
        <div className="dashboard-grid">

          <div className="card">
            {activeTab === "upload" ? (
              <UploadImage onDetect={handleDetect} isLoading={isLoading} />
            ) : (
              <WebcamCapture onDetect={handleDetect} isLoading={isLoading} />
            )}
          </div>

          <div className="card">
            {isLoading ? <Loader /> : <ResultCard result={result} />}
          </div>

        </div>

        {/* History (Local) */}
        {history.length > 0 && (
          <div className="card">
            <h3>Recent Scans</h3>

            {history.map(h => (
              <div key={h.id}>
                {h.vehicle_number} — {h.violation ? "Violation" : "Clear"} — {formatTime(h.timestamp)}
              </div>
            ))}
          </div>
        )}

        {/* 🔥 DB TABLE */}
        <ViolationTable />

      </div>

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            {TOAST_ICONS[t.type]} {t.title}
          </div>
        ))}
      </div>
    </>
  );
}
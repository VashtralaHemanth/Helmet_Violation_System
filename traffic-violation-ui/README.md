# 🚦 VioWatch — AI Traffic Violation Detection UI

A modern React dashboard for AI-based helmet violation detection.

## Quick Start

```bash
npm install
npm start
```

Opens at **http://localhost:3000**

---

## Flask API

The app connects to **http://localhost:5000/detect**

### Expected POST `/detect`

**Request:** `multipart/form-data` with field `image`

**Response JSON:**
```json
{
  "vehicle_number": "TS09AB1234",
  "helmet_detected": false,
  "violation": true,
  "confidence": 0.943,
  "detected_image_url": "data:image/jpeg;base64,...",
  "timestamp": "2025-03-18T12:34:56.000Z"
}
```

> **Offline / Dev mode:** If the Flask server isn't running, the app automatically falls back to a mock response so you can develop and test the UI independently.

---

## Project Structure

```
src/
├── api/
│   └── api.js          ← Axios client + detectViolation()
├── components/
│   ├── Navbar.js       ← Top navbar with tab switching
│   ├── UploadImage.js  ← Drag-drop image uploader
│   ├── WebcamCapture.js ← Live camera with capture
│   ├── ResultCard.js   ← Detection result display
│   └── Loader.js       ← Animated loading indicator
├── pages/
│   └── Dashboard.js    ← Main page + state management
└── styles/
    ├── global.css      ← Design system tokens + utilities
    ├── dashboard.css   ← Dashboard layout + component styles
    └── navbar.css      ← Navbar styles
```

## Color Palette

| Token       | Value                  |
|-------------|------------------------|
| Background  | `rgb(243, 244, 244)`   |
| Primary     | `rgb(133, 57, 83)`     |
| Secondary   | `rgb(97, 45, 83)`      |
| Dark        | `rgb(44, 44, 44)`      |

## Environment Variables

Create a `.env` file in the root:

```
REACT_APP_API_URL=http://localhost:5000
```

# 🚦 AI-Based Helmet Violation Detection System

An end-to-end full-stack AI system that detects helmet violations, extracts vehicle number plates, stores violations in a database, and sends SMS alerts to vehicle owners.

---

## 🔥 Features

* 🧠 **Helmet Detection** using YOLOv8
* 🚗 **License Plate Detection & Recognition**
* 🔁 **Fallback OCR (EasyOCR)**
* 🗄️ **MySQL Database Integration**
* 📊 **React Dashboard (Upload + Webcam)**
* 📩 **SMS Alerts using Twilio**
* 📜 **Violation History Tracking**

---

## 🏗️ Project Structure

```
helmet-violation-system/
│
├── ai-model/                  # Backend (Flask + AI)
│   ├── flask_server.py
│   ├── .env
│   ├── api/
│   │   ├── db.py
│   │   ├── sms_service.py
│   │   └── violation_service.py
│   ├── helmet_detection/
│   ├── plate_detection/
│   ├── ocr/
│   └── models/
│
├── frontend/                 # React Dashboard
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── api/
│
└── database/
    └── schema.sql
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/your-username/helmet-violation-system.git
cd helmet-violation-system
```

---

## 🧠 Backend Setup (Flask + AI)

### 🔹 Create virtual environment

```
python -m venv gpu_env
gpu_env\Scripts\activate   # Windows
```

### 🔹 Install dependencies

```
pip install -r requirements.txt
```

### 🔹 Create `.env` file

```
PLATE_API_KEY=your_plate_api_key
DB_PASSWORD=your_mysql_password
TWILIO_SID=your_sid
TWILIO_TOKEN=your_token
TWILIO_PHONE=your_twilio_number
```

---

## 🗄️ Database Setup (MySQL)

```
CREATE DATABASE traffic_system;

USE traffic_system;

CREATE TABLE violations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plate_number VARCHAR(20),
    violation_type VARCHAR(50),
    timestamp DATETIME
);

CREATE TABLE vehicle_owners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plate_number VARCHAR(20),
    owner_name VARCHAR(100),
    mobile VARCHAR(15)
);
```

---

## 🚀 Run Backend

```
cd ai-model
python flask_server.py
```

Backend runs at:

```
http://localhost:5000
```

---

## 🎨 Frontend Setup (React)

```
cd frontend
npm install
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

## 🔗 API Endpoints

### 📸 Detect Violation

```
POST /detect
```

### 📊 Get Violations

```
GET /violations
```

---

## 🔄 Workflow

```
Image/Webcam
   ↓
Helmet Detection (YOLO)
   ↓
Plate Detection
   ↓
Plate Recognition API
   ↓
Fallback OCR
   ↓
Save to MySQL
   ↓
Fetch Owner Details
   ↓
Send SMS (Twilio)
   ↓
Display in React Dashboard
```

---

## 🧪 Testing

1. Upload an image or use webcam
2. Detect helmet violation
3. Verify:

   * Plate number extracted
   * Data saved in DB
   * SMS sent to owner
   * History updated in dashboard

---

## 📸 Sample Output

* 🚗 Plate: AP09AB1234
* ⚠️ Violation: No Helmet
* 📩 SMS Sent to Owner

---

## ⚠️ Notes

* Twilio trial accounts require verified phone numbers
* Ensure MySQL server is running
* Place `.env` file inside `ai-model/` folder

---

## 🚀 Future Enhancements

* 📡 Real-time CCTV integration
* 💳 E-challan payment system
* 📧 Email notifications
* ☁️ Cloud deployment (AWS/GCP)

---

## 👨‍💻 Author

Hemanth
AI & Full Stack Developer

---

## ⭐ If you like this project

Give it a ⭐ on GitHub!

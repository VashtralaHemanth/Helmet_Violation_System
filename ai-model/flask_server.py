from flask import Flask, request, jsonify
from flask_cors import CORS   # ✅ IMPORT
import cv2
import numpy as np
from datetime import datetime
from dotenv import load_dotenv
from api.sms_service import send_sms
from api.violation_service import get_owner_mobile
import os

# ✅ Load env
load_dotenv()

print("Loaded KEY:", os.getenv("PLATE_API_KEY"))

# AI Modules
from helmet_detection.detect_helmet import HelmetDetector
from plate_detection.detect_plate import PlateDetector
from ocr.plate_api import PlateAPI
from ocr.read_plate import PlateOCR

# 🔥 DB
from api.db import cursor, db

# ✅ CREATE APP ONLY ONCE
app = Flask(__name__)

# 🔥 APPLY CORS HERE (IMPORTANT)
CORS(app, resources={r"/*": {"origins": "*"}})

helmet = HelmetDetector()
plate = PlateDetector()
api = PlateAPI()
ocr = PlateOCR()


# ─────────────────────────────────────
# 🔥 HOME (optional, removes 404)
# ─────────────────────────────────────
@app.route("/detect", methods=["POST"])
def detect():

    try:
        file = request.files["file"]

        img_bytes = file.read()
        nparr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is None:
            return jsonify({"error": "Invalid image"})

        result = helmet.detect(frame)

        vehicle_number = ""
        plate_detected = False

        if result["violation_detected"]:

            print("🚨 Helmet Violation Detected")

            plate_img = plate.detect(frame)

            if plate_img is not None:

                plate_detected = True
                print("📷 License Plate Detected")

                processed_img = cv2.bilateralFilter(plate_img, 11, 17, 17)

                # 🔥 Plate API
                vehicle_number = api.read(processed_img)

                # 🔁 fallback OCR
                if not vehicle_number:
                    print("⚠️ API failed → using OCR")
                    vehicle_number = ocr.read(processed_img)

                print("🚗 Plate:", vehicle_number)

                # 🔥 SAVE TO DB
                cursor.execute(
                    "INSERT INTO violations (plate_number, violation_type, timestamp) VALUES (%s, %s, %s)",
                    (vehicle_number, "NO_HELMET", datetime.now())
                )
                db.commit()

                # 🔥 🔥 NEW: SEND SMS
                mobile = get_owner_mobile(vehicle_number)

                if mobile:
                    print("📞 Sending SMS to:", mobile)
                    send_sms(mobile, vehicle_number)
                else:
                    print("⚠️ No mobile found for this plate")

            else:
                print("❌ No plate detected")

        return jsonify({
            "vehicle_number": vehicle_number,
            "violation": result["violation_detected"],
            "plate_detected": plate_detected,
            "confidence": 0.95,
            "timestamp": str(datetime.now())
        })

    except Exception as e:
        print("❌ Error:", e)
        return jsonify({"error": str(e)})
# ─────────────────────────────────────
# 🔥 GET ALL VIOLATIONS
# ─────────────────────────────────────
@app.route("/violations", methods=["GET"])
def get_violations():

    cursor.execute("SELECT * FROM violations ORDER BY timestamp DESC")
    data = cursor.fetchall()

    result = []
    for row in data:
        result.append({
            "id": row[0],
            "plate": row[1],
            "type": row[2],
            "time": str(row[3])
        })

    return jsonify(result)


# ─────────────────────────────────────
# RUN SERVER
# ─────────────────────────────────────
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
import cv2
import time
from datetime import datetime
from pathlib import Path
from ultralytics import YOLO


class HelmetDetector:

    def __init__(self, model_path="models/helmetmodel/best.pt"):

        # Load YOLO model
        self.model = YOLO(model_path)

        # Print class names (for debugging)
        print("Model classes:", self.model.names)

        # Output directory for violations
        self.output_dir = Path("output/violations")
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def detect(self, frame):

        results = self.model(frame)

        violation = False

        for r in results:

            if r.boxes:

                for box in r.boxes:

                    cls = int(box.cls[0])
                    label = self.model.names[cls]

                    # Normalize label
                    label_lower = label.lower().replace("-", " ").replace("_", " ")

                    # Detect violation
                    if "helmet" in label_lower and ("no" in label_lower or "without" in label_lower):

                        violation = True

                        x1, y1, x2, y2 = map(int, box.xyxy[0])

                        # Draw bounding box
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)

                        cv2.putText(
                            frame,
                            label,
                            (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            0.8,
                            (0, 0, 255),
                            2
                        )

        path = None

        if violation:
            path = self._save(frame)

        return {
            "violation_detected": violation,
            "frame": frame,
            "saved_image_path": path
        }

    def _save(self, frame):

        ts = datetime.now().strftime("%Y%m%d_%H%M%S")

        path = self.output_dir / f"violation_{ts}.jpg"

        cv2.imwrite(str(path), frame)

        return str(path)

    def process_video(self, source=0, location="Camera"):

        from plate_detection.detect_plate import PlateDetector
        from ocr.read_plate import PlateOCR
        from api.send_to_backend import BackendClient

        cap = cv2.VideoCapture(source)

        plate = PlateDetector()
        ocr = PlateOCR()
        backend = BackendClient()

        while cap.isOpened():

            ret, frame = cap.read()

            if not ret:
                break

            result = self.detect(frame)

            if result["violation_detected"]:

                plate_img = plate.detect(frame)

                number = ""

                if plate_img is not None:
                    number = ocr.read(plate_img)

                if number:

                    backend.send_violation(
                        vehicle_number=number,
                        violation_type="NO_HELMET",
                        location=location,
                        image_path=result["saved_image_path"]
                    )

            cv2.imshow("Helmet Detection", frame)

            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

        cap.release()
        cv2.destroyAllWindows()
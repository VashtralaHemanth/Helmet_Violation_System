import cv2
from ultralytics import YOLO
from pathlib import Path


class PlateDetector:

    def __init__(self, model_path="models/platemodel/best.pt"):

        if Path(model_path).exists():

            self.model = YOLO(model_path)

            print("[PlateDetector] Model loaded")

        else:

            self.model = None

            print("[PlateDetector] YOLO model missing, using contour method")

    def detect(self, frame):

        if self.model:

            results = self.model(frame)

            for r in results:

                if r.boxes:

                    for box in r.boxes:

                        x1, y1, x2, y2 = map(int, box.xyxy[0])

                        # add padding around plate
                        padding = 20

                        x1 = max(0, x1 - padding)
                        y1 = max(0, y1 - padding)
                        x2 = min(frame.shape[1], x2 + padding)
                        y2 = min(frame.shape[0], y2 + padding)

                        plate = frame[y1:y2, x1:x2]

                        # show cropped plate for debugging
                        cv2.imshow("Detected Plate", plate)
                        cv2.waitKey(1)

                        return plate

        return self._contour_detect(frame)

    def _contour_detect(self, frame):

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        edges = cv2.Canny(gray, 30, 200)

        contours, _ = cv2.findContours(edges, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

        contours = sorted(contours, key=cv2.contourArea, reverse=True)[:20]

        for c in contours:

            x, y, w, h = cv2.boundingRect(c)

            aspect = w / float(h)

            if 2 < aspect < 6 and w > 60:

                plate = frame[y:y+h, x:x+w]

                cv2.imshow("Contour Plate", plate)
                cv2.waitKey(1)

                return plate

        return None
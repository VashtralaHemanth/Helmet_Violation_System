import cv2
import easyocr
import re
import numpy as np


class PlateOCR:

    PLATE_PATTERN = re.compile(r'[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}')

    def __init__(self):
        self.reader = easyocr.Reader(['en'], gpu=False)

    def read(self, plate_img):

        if plate_img is None:
            return ""

        # resize large
        plate_img = cv2.resize(plate_img, None, fx=4, fy=4)

        # convert to gray
        gray = cv2.cvtColor(plate_img, cv2.COLOR_BGR2GRAY)

        # remove noise
        gray = cv2.bilateralFilter(gray, 11, 17, 17)

        # sharpen
        kernel = np.array([[0,-1,0],
                           [-1,5,-1],
                           [0,-1,0]])

        gray = cv2.filter2D(gray, -1, kernel)

        # save debug image
        cv2.imwrite("debug_plate.jpg", gray)

        # run OCR
        results = self.reader.readtext(gray)

        text = ""

        for bbox, detected_text, confidence in results:
            if confidence > 0.2:
                text += detected_text

        text = re.sub(r'[^A-Z0-9]', '', text.upper())

        print("OCR Raw:", text)

        match = self.PLATE_PATTERN.search(text)

        if match:
            return match.group(0)

        return text
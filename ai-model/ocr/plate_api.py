import requests
import os
import cv2
import time


class PlateAPI:

    def __init__(self):
        # ✅ FIXED: correct env variable name
        self.api_key = os.getenv("PLATE_API_KEY")

        # 🔥 Debug (remove later)
        print("Loaded API KEY:", self.api_key)

    def read(self, plate_img):

        if plate_img is None:
            return ""

        # Resize for better accuracy
        plate_img = cv2.resize(plate_img, (400, 200))

        temp_path = f"temp_{time.time()}.jpg"
        cv2.imwrite(temp_path, plate_img)

        try:
            url = "https://api.platerecognizer.com/v1/plate-reader/"

            with open(temp_path, "rb") as f:
                response = requests.post(
                    url,
                    files={"upload": f},
                    headers={
                        "Authorization": f"Token {self.api_key}"
                    }
                )

            data = response.json()
            print("[API RESPONSE]", data)

            if data.get("results"):
                return data["results"][0]["plate"].upper()

            return ""

        except Exception as e:
            print("[API ERROR]", e)
            return ""

        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)
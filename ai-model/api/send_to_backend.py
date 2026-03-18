import requests
import json
from pathlib import Path


class BackendClient:

    def __init__(self):

        self.base_url = "http://localhost:8080"
        self.endpoint = "/api/violations"

        self.queue_file = Path("output/failed_queue.json")

        if not self.queue_file.exists():
            self.queue_file.write_text("[]")

    def health_check(self):

        try:
            r = requests.get(self.base_url)
            return r.status_code < 500
        except:
            return False

    def send_violation(self, vehicle_number, violation_type, location, image_path):

        payload = {
            "vehicleNumber": vehicle_number,
            "violationType": violation_type,
            "location": location,
            "imageUrl": image_path
        }

        try:

            url = self.base_url + self.endpoint

            response = requests.post(url, json=payload)

            if response.status_code in [200, 201]:
                print("[Backend] Violation sent:", vehicle_number)
                return response.json()

            else:
                print("[Backend] Failed:", response.text)
                self._queue(payload)

        except Exception as e:

            print("[Backend] Connection error:", e)
            self._queue(payload)

        return None

    def _queue(self, payload):

        queue = json.loads(self.queue_file.read_text())

        queue.append(payload)

        self.queue_file.write_text(json.dumps(queue, indent=2))

        print("[Backend] Stored violation locally")

    def retry_failed_queue(self):

        queue = json.loads(self.queue_file.read_text())

        remaining = []

        for payload in queue:

            try:
                response = requests.post(self.base_url + self.endpoint, json=payload)

                if response.status_code not in [200, 201]:
                    remaining.append(payload)

            except:
                remaining.append(payload)

        self.queue_file.write_text(json.dumps(remaining, indent=2))
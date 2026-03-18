from twilio.rest import Client
import os

client = Client(
    os.getenv("TWILIO_SID"),
    os.getenv("TWILIO_TOKEN")
)

def send_sms(number, plate):

    message = client.messages.create(
        body=f"🚨 Helmet Violation Detected\nVehicle: {plate}",
        from_=os.getenv("TWILIO_PHONE"),
        to=number
    )

    print("📩 SMS Sent:", message.sid)
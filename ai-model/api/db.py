import mysql.connector
import os
from dotenv import load_dotenv

# 🔥 FORCE load .env
load_dotenv()

# 🔥 DEBUG
print("DB PASSWORD FROM ENV:", os.getenv("DB_PASSWORD"))

db = mysql.connector.connect(
    host="localhost",
    port=3307,
    user="root",
    password=os.getenv("DB_PASSWORD"),
    database="traffic_system"
)

cursor = db.cursor()
import streamlit as st
import requests

st.title("Helmet Violation Detection System")

uploaded_file = st.file_uploader("Upload an Image", type=["jpg","png","jpeg"])

if uploaded_file is not None:

    st.image(uploaded_file, caption="Uploaded Image", use_column_width=True)

    response = requests.post(
        "http://localhost:5000/detect",
        files={"file": uploaded_file.getvalue()}
    )

    data = response.json()

    st.subheader("Detection Result")

    if data["violation"]:
        st.error("🚨 Helmet Violation Detected")
    else:
        st.success("✅ No Helmet Violation")

    if data["plate_detected"]:
        st.info("📷 License Plate Detected")
    else:
        st.warning("⚠ No License Plate Detected")

    if data["vehicle"]:
        st.success(f"🔢 Plate Number: {data['vehicle']}")
    else:
        st.warning("⚠ OCR could not read plate")

    st.write("Time:", data["time"])
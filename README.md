# 🖐️ PalmSecure: Palmprint Verification App (Final Year Project)

PalmSecure is a biometric authentication system designed for **contactless palmprint verification**. This project leverages **React Native (Expo)** for the mobile frontend, **Supabase** for database & storage management, and a **Python-based CCNet model backend** for feature extraction & identity verification.

---

## 📲 Project Modules & Features

### ✅ User Verification Module:
- Capture palm images using the mobile camera.
- Upload images to Supabase Storage.
- Trigger backend API to extract palmprint features.
- Compare features with database vectors using cosine similarity.
- Display verification result with real-time feedback.

### ✅ Admin Registration Module:
- Register new users with Name, Roll Number, and Palm images.
- Upload multiple palm images for feature diversity.
- Trigger feature extraction API post-upload.
- Store extracted feature vectors (fv1–fv4) in Supabase Database.
- Delete uploaded images after successful registration.

### ✅ Backend API (Python FastAPI):
- Download images from Supabase for feature extraction.
- Use CCNet model to extract palmprint feature vectors.
- Perform cosine similarity comparison against stored vectors.
- Return matching user information (Name, Roll Number) or failure.
- Clean up temporary files post-processing.

### ✅ Live Logs & UI Feedback:
- Show terminal-like logs in frontend for uploads, deletions, verifications.
- Display user-friendly success/failure screens.
- Loading animations during processing.

### ✅ Secure Access & Policies:
- Supabase RLS policies for data protection.
- Only authenticated actions allowed for uploads & deletions.
- Backend cleans up temp files & Supabase images after usage.

---

## 🏗️ Project Structure

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

```
PalmSecure-App/
├── Frontend/                    # React Native app
│   ├── app/                     # App screens & components
│   │   ├── VerifyPalm.js
│   │   ├── AddUser.js
│   │   └── utils/               # Supabase client & helpers
│   ├── assets/                  # Icons, logos, images
│   ├── package.json             # Frontend dependencies
│   ├── app.config.js            # Expo app config
│   └── .env                     # Frontend env variables
│
├── verify-backend/             # FastAPI backend
│   ├── main.py                  # FastAPI app entry point
│   ├── ccnet\_model.py           # CCNet model loader
│   ├── feature\_utils.py         # Feature extraction & comparison logic
│   ├── supabase\_utils.py        # Supabase integration
│   └── requirements.txt         # Backend dependencies
│
├── README.md                    # Project documentation
└── .gitignore                   # Global gitignore settings
```

---

## 🛠️ Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/PalmSecure.git
cd PalmSecure-App
```

### 2️⃣ Install Frontend Dependencies

```bash
cd Frontend
npm install
```

### 3️⃣ Set Up Environment Variables

Create a `.env` file in the **Frontend** folder:

```
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
API_BASE_URL=http://your-backend-url
```

### 4️⃣ Run the App

```bash
npx expo start
```

Access using:

* 📱 Expo Go on physical device
* 🖥️ Android Emulator
* 🍏 iOS Simulator

---

## ⚙️ Backend API (FastAPI)

### 1️⃣ Install Backend Requirements

```bash
cd ../verify-backend
pip install -r requirements.txt
```

### 2️⃣ Start the Backend Server

```bash
uvicorn main:app --reload
```

### 🔑 Key Endpoints

| Endpoint                 | Description                     |
| ------------------------ | ------------------------------- |
| `POST /verify_palm`      | Verifies uploaded palm image    |
| `POST /extract_features` | Extracts & stores user features |

---

## 🧹 Useful Commands

* Clear Expo cache:

  ```bash
  npx expo start -c
  ```

* Trigger feature extraction API after user registration.

* Backend automatically deletes temporary files and Supabase images.

---

## 📝 Technologies Used

| Frontend                        | Backend                    | Database & Storage   |
| ------------------------------- | -------------------------- | -------------------- |
| React Native (Expo)             | Python FastAPI             | Supabase             |
| Expo Camera & Image Manipulator | CCNet (PyTorch)            | Supabase Storage     |
| Tailwind-like Styling           | Cosine Similarity Matching | Supabase Users Table |

---

## 📈 Workflow Summary

### 👤 User Verification Flow

1. Capture palm image
2. Upload to Supabase
3. Backend verifies features
4. Result shown on app

### 👨‍💼 Admin Registration Flow

1. Upload 4 palm images
2. Trigger `/extract_features` API
3. Feature vectors stored (fv1–fv4)
4. Temporary images deleted

### 🔒 Security & Cleanup

* Supabase RLS policies
* Backend cleans temp files and Supabase uploads

---

## 🧑‍💻 Team Members

* Muhammad Salar (Lead Developer)
* Muhammad Hamza
* Talha Bilal
* **Supervisor**: Dr. Atif Tahir

---

## 📚 References

* [Supabase Documentation](https://supabase.com/docs)
* [Expo Documentation](https://docs.expo.dev/)
* [React Native Docs](https://reactnative.dev/docs/getting-started)
* [FastAPI Documentation](https://fastapi.tiangolo.com/)
* [CCNet Paper: "CCNet: A Comprehensive Competition Network for Palmprint Recognition"](https://ieeexplore.ieee.org/document/10223233)

---

## 📃 License

This project is developed for **FAST NUCES Karachi** (FYP 2025).

---

## ⭐ If you found this project helpful, consider giving it a ⭐ on GitHub!
```


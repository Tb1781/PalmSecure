Got it. Below is the **complete and detailed README.md file** for your project — fully reflecting all the work you've done (Frontend, Supabase, Backend API, Palmprint Verification, Admin module, etc.).

---

## ✅ Complete `README.md` File (Code Version):

```markdown
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
├── app/                         # Main app screens & components
│   ├── VerifyPalm.js             # Palm verification UI & logic
│   ├── AddUser.js                # Admin user registration screen
│   └── utils/                    # Supabase client & API helpers
├── assets/                       # Icons, images, app logos
├── .gitignore                    # Ignored files config
├── README.md                     # This documentation
├── package.json                  # Project dependencies & scripts
├── app.config.js                 # Expo app config
└── .env                          # Environment variables (local only)

````

---

## 🛠️ Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/PalmSecure.git
cd PalmSecure
````

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Variables

Create a `.env` file with:

```
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
API_BASE_URL=http://your-backend-url
```

### 4️⃣ Run the App

```bash
npx expo start
```

Access via:

* 📱 Expo Go (physical device)
* 🖥️ Android Emulator
* 🍏 iOS Simulator s

---

## ⚙️ Backend API (FastAPI)

### Start Backend Server:

```bash
uvicorn main:app --reload
```

### Key Endpoints:

* `POST /verify_palm`: For palmprint verification.
* `POST /extract_features`: For feature extraction & database update.

---

## 🧹 Useful Commands

* Reset Expo project cache:

  ```bash
  npx expo start -c
  ```
* Run feature extraction API after user image upload.
* Clean up Supabase bucket & temp directories after registration.

---

## 📝 Technologies Used

| Frontend                        | Backend                    | Database & Storage        |
| ------------------------------- | -------------------------- | ------------------------- |
| React Native (Expo)             | Python FastAPI             | Supabase                  |
| Expo Camera & Image Manipulator | CCNet Feature Extraction   | Supabase Storage          |
| Tailwind for Styling            | Cosine Similarity Matching | Supabase DB (Users Table) |

---

## 📈 Workflow Summary

1. **User Verification Flow**:

   * Capture palm → Upload to Supabase → Backend API verifies → Result shown in app.

2. **Admin User Registration Flow**:

   * Upload multiple palm images → Extract features → Store vectors in DB → Cleanup temp data.

3. **Security & Cleanup**:

   * RLS policies on Supabase.
   * Backend auto-deletes temporary files & images.

---

## 🧑‍💻 Team Members

* Muhammad Salar (Lead Developer)
* Muhammad Hamza
* Talha Bilal
* Supervisor: Dr Atif Tahir

---

## 📚 References

* [Supabase Documentation](https://supabase.com/docs)
* [Expo Documentation](https://docs.expo.dev/)
* [CCNet: Comprehensive Convolutional Network Paper](https://arxiv.org/abs/1810.11786)
* [React Native Docs](https://reactnative.dev/docs/getting-started)
* [FastAPI Documentation](https://fastapi.tiangolo.com/)

---

## 📃 License

This project is developed for **educational & academic purposes** (FYP 2025).

---

## ⭐ If you found this project helpful, consider giving it a ⭐ on GitHub!



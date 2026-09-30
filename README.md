# IIT Madras - Daily Study Planner & Tracker App 🎓📱

A modern, high-performance study planner and progress tracker web application & PWA built specifically for IIT Madras students with a clean White, Gray, and Pink theme.

---

## ✨ Features

- **Daily Study Tasks & Planner:** Schedule and track study sessions with checkbox completion, priority levels, and subjects.
- **Duration Tracking:** Enter study duration in Hours (hr), Minutes (min), and Seconds (sec).
- **Daily Track Sticker Gallery:** Instagram-grid style daily stickers capturing 24 hours of study activity. Click any sticker card to view full topic breakdown and study log.
- **Custom Subjects:** Create custom subjects with personalized emojis and color badges.
- **Pomodoro Focus Timer:** Integrated Pomodoro study timer with break intervals and audio alerts.
- **Google Authentication:** Sign in / Register with Google OAuth or email, complete with user avatars and profile management.
- **Progressive Web App (PWA) & Mobile App Shell:**
  - Installable directly to Android, iOS, Mac, or Windows devices with 1-click.
  - Native bottom navigation bar with haptic touch feedback.
  - Desktop Phone Simulator View mode.
- **Dual-Database Resilience:**
  - **MongoDB** cloud/local database synchronization.
  - Automatic fallback to **SQLite** (`better-sqlite3`) and browser cache for 0ms load time and offline capability.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Optional: MongoDB running locally or MongoDB Atlas connection string

### 2. Installation
```bash
git clone https://github.com/Ankit-Panday258/iitm-study-tracker.git
cd iitm-study-tracker
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/iitm_study_tracker
PORT=3000
# Optional: Google OAuth Client ID
# VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 4. Running the App
```bash
npm run dev
# or
npx vite --port 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Backend:** Express.js, Mongoose, better-sqlite3
- **Mobile / PWA:** Web App Manifest, Service Worker (`sw.js`), Capacitor config
- **Authentication:** Google Identity Services (GSI), JWT Decode

---

## 📄 License
MIT License

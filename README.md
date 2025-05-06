# Event-US Platform Frontend

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Event-US is react-based frontend for an events booking platform, integrated with Firebase Auth, Firestore, and Firebase Hosting.  
Supports user authentication (email/password), role-based access (user vs. staff), favourites, bookings, and Google Calendar integration.

---

## 🚀 Features

- **User Authentication**

  - Sign up / Login / Logout via Firebase Auth
  - Profile management: update name, password, photo

- **Role-Based Access**

  - Regular users can browse, favourite, book events, view booked events and add them to their calendars.
  - Staff users can create, edit, and delete events; register new members of staff

- **Events Management**

  - View event list and details
  - Add/remove “favourites” per user
  - Book events; view & cancel booked events

- **Calendar Integration**

  - “Add to Google Calendar” link on confirmation

  - **Profile setting management**

  - “Update information - user information, display name and password.

- **Responsive UI**

  - Mobile-friendly layouts
  - Dark/light theming via CSS

- **Firebase Hosting**
  - Easy deploy & continuous styling tweaks

---

## 🔧 Tech Stack

- **Framework:** React (Vite)
- **Routing:** React Router v6
- **State & Effects:** React Hooks
- **Styling:** Plain CSS modules
- **Backend:** Firebase
  - Auth
  - Firestore
  - Hosting

---

## 📦 Installation

1. **Clone**

   ```bash
   git clone git@github.com:serk03/events_platform_frontend.git
   cd events_platform_frontend

   ```

2. **Firebase Setup**

- Go to the Firebase console and create (or select) your project.

- In Project settings → General, under “Your apps,” register a new Web app and copy the firebaseConfig snippet.

  ```bash
   src/firebase.js
  import { initializeApp } from "firebase/app";
  import { getAuth }      from "firebase/auth";
  import { getFirestore } from "firebase/firestore";
  const firebaseConfig = {
  apiKey: "<YOUR_API_KEY>",
  authDomain: "<YOUR_AUTH_DOMAIN>",
  projectId: "<YOUR_PROJECT_ID>",
  storageBucket: "<YOUR_STORAGE_BUCKET>",
  messagingSenderId: "<YOUR_SENDER_ID>",
  appId: "<YOUR_APP_ID>",
  };
  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);
  ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

4. **Environment Variables**

   -Create a file called .env.local (or .env) in the root of the project.

   ```bash
   VITE_STAFF_TOKEN=your_staff_token_here
   ```

## 📁Project Structure

- src/components/ # Reusable UI: EventCard, NavBar, ProtectedRoute
- src/pages/ # Top-level routes: Home, Login, Register, Profile, Events…
- src/css/ # Component & page styles
- src/firebase.js # Firebase initialization
- src/App.jsx # Routes & global effects
- src/main.jsx # Entry point

## 💻Deployment

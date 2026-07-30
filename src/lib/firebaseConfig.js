/**
 * Firebase web config — the ONE file to edit for Firebase settings.
 *
 * Values are prefilled from android/app/google-services.json (project `hhtaware`).
 * NOTE: `appId` below is the ANDROID app id. It works for Firestore/Auth in
 * practice, but the clean path is to register a **Web App** in the Firebase
 * console (Project settings → Your apps → Add app → Web) and paste its
 * `appId` (looks like `1:499068781512:web:xxxxxxxxxxxx`) here.
 * See FIREBASE_SETUP.md at the repo root for the full checklist.
 */
export const firebaseConfig = {
  apiKey: 'AIzaSyCyHbWVZMWp7Nujh4n5YUKdTmRDiqOIJ_s',
  authDomain: 'hhtaware.firebaseapp.com',
  projectId: 'hhtaware',
  storageBucket: 'hhtaware.firebasestorage.app',
  messagingSenderId: '499068781512',
  appId: '1:499068781512:android:4176be35f672680e4cf6fd', // ← replace with the Web App id
};

export default firebaseConfig;

# Firebase setup (Firestore + Anonymous Auth)

The app works **fully without any of this** — if Firestore/Auth are not set up
(or the device is offline), it silently falls back to the bundled research data
and localStorage. This checklist just "lights up" the cloud features.

Firebase project: **hhtaware** (already exists — it powers the Android
Crashlytics/Analytics/FCM plugins via `android/app/google-services.json`).

## 1. Enable Firestore

1. [Firebase console](https://console.firebase.google.com/) → project **hhtaware** → **Build → Firestore Database** → **Create database**.
2. Choose **Production mode** (our rules below lock it down properly).
3. Pick a region close to your users (e.g. `us-central1` or `asia-south1`) — this cannot be changed later.

## 2. Enable Anonymous sign-in

1. Console → **Build → Authentication** → **Get started** (if first time).
2. **Sign-in method** tab → **Anonymous** → toggle **Enable** → Save.

## 3. Publish the security rules

1. Console → **Firestore Database → Rules** tab.
2. Paste the entire contents of [`firestore.rules`](./firestore.rules) (repo root), replacing what's there.
3. Click **Publish**.

Summary of the rules: `research_updates` is world-readable / nobody-writable
(you add docs via the console), `users/{uid}` is private to its owner, and
everything else is denied.

## 4. Register a Web App (for the correct web `appId`)

1. Console → **Project settings** (gear) → **Your apps** → **Add app** → **Web** (`</>` icon).
2. Nickname e.g. `hht-aware-web`; no hosting needed. Register.
3. Copy the `appId` from the shown config (looks like `1:499068781512:web:xxxxxxxxxxxx`).
4. Paste it into **`src/lib/firebaseConfig.js`**, replacing the Android `appId`
   currently there. (The Android id happens to work for Firestore/Auth, but the
   web registration is the clean, supported path.)

## 5. Add research updates to Firestore

Collection: **`research_updates`**. Document id convention: **the update id as
a string** (e.g. doc id `"23"` for update id `23`). Fields mirror the bundled
`src/data/research.js` shape **verbatim**:

| Field          | Type   | Example |
| -------------- | ------ | ------- |
| `id`           | number | `23` — must be unique and NOT collide with bundled ids 1–22 |
| `date`         | string | `"2026-07"` (YYYY-MM, or YYYY-MM-DD) |
| `category`     | string | one of: `Treatments`, `Genetics`, `Nosebleed Relief`, `Screening`, `Clinical Trials`, `Community` |
| `emoji`        | string | `"💊"` |
| `title`        | string | headline |
| `plain`        | string | long plain-language paragraph |
| `whyItMatters` | string | one-sentence patient relevance |
| `stage`        | string | `"Early research"` \| `"News"` \| `"Guideline"` \| `"In trials"` |
| `source`       | string | free-text source name |
| `url`          | string | full `https://` link |

Console path: **Firestore Database → Data → Start collection** →
Collection ID `research_updates` → Document ID `23` → add the fields above.

That's it — no redeploy needed for new updates; the app merges remote docs with
the bundled list at runtime.

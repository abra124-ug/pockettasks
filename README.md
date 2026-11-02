# PocketTasks

A lightweight, offline-friendly task manager built with React, Vite, Tailwind CSS and Capacitor.
Package ID: `com.pockettasks.app` · Version 1.0.0

## Run locally (Alpine / Acode terminal)

```sh
npm install
npm run dev          # open http://localhost:5173 in the phone browser
```

## Build the APK with GitHub Actions

```sh
npm install                      # creates package-lock.json (commit it)
npx cap add android              # once; commit the android/ folder
git init && git add . && git commit -m "PocketTasks v1.0.0"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

Every push to `main` (or a manual run from the Actions tab) builds a debug APK.
Download the `PocketTasks-debug-apk` artifact, extract the ZIP and install `app-debug.apk`.

If the `android/` folder is not committed, the workflow adds it automatically.

## Notes
- Tasks are stored with Capacitor Preferences (localStorage in the browser).
- Theme (light/dark/system) is stored in localStorage.
- Palette: teal `#0F9E99`, orange `#F97316`, white. No gradients.

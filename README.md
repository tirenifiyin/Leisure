# Ìràwọ̀ — Daily Planner

A playful, mobile-first planner you can install on your phone as a Progressive Web App (PWA). No Play Store listing or account is needed. Tasks are saved in the browser on the device where you created them, and the app shell works offline after the first visit.

## Run locally

1. Install Node.js (LTS) if it is not already installed.
2. In this project folder, run `npm install`.
3. Run `npm run dev` to start the development server.
4. Open the local address Vite prints in your browser.

To make the app available to a phone on the same Wi-Fi network, use the Network address printed by Vite and open it on your phone. Keep the development server running. Service workers require a secure context: localhost is supported, but a phone opening a plain HTTP LAN address may not allow PWA installation or offline caching.

## Install on your phone without the Play Store

For reliable installation and offline use, build and deploy the static site to any HTTPS-capable static web host you control. Build with `npm run build`; the deployable site is the `dist` folder. A custom domain is optional. Open the HTTPS site on your phone, then:

- **Android / Chrome:** open the browser menu and choose **Install app** or **Add to Home screen**.
- **iPhone / iPad / Safari:** tap **Share**, then **Add to Home Screen**.

The hosted site is only needed to first visit/install and receive updates. Once cached, the app shell opens offline. Task data is local to each browser/device and does not sync between devices. Do not clear the browser's site data if you want to keep saved tasks.

## Reminders and notifications

Tasks can be assigned to any date, with an optional deadline and reminder time. Notification permission is requested by the browser when you add a reminder (or through **Enable reminders**). Browser-based reminders are checked while the app is open; notification support and delivery while the app is in the background vary by browser and operating system. Reliable reminders when the app is closed require a push-notification service and a server, which this no-backend app does not use. Use HTTPS for notification permission.

## Features

- Monthly calendar navigation and date-specific tasks.
- Optional task deadlines and browser notification reminders.
- Day/night themes and playful cartoon-inspired layout.
- Sudoku and mini crossword games.
- Weekly wrap with a completion-based productivity rating.
- Local browser storage; no account or backend.
- Responsive touch-friendly layout and offline app shell.

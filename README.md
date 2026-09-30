<div align="center">

# 📊 MIUI BMI Calculator & Health Tracker

### Progressive Web App (PWA) & Visual Trend Analytics

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://bmi-ui-calculator.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/razazaheer12/BMI-Calculator)
[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg?style=for-the-badge)](LICENSE)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://bmi-ui-calculator.vercel.app/)
[![React + TypeScript](https://img.shields.io/badge/React_19-TypeScript-3178C6?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Offline First](https://img.shields.io/badge/Offline-First-22C55E?style=for-the-badge&logo=service-worker)](https://web.dev/offline/)

</div>

---

## 🌟 Overview 

A sleek, **Xiaomi MIUI / HyperOS-inspired** BMI calculator that feels native on every device. Every interaction is crafted for fluidity — smooth range sliders, animated screen transitions powered by **Motion (Framer Motion)**, ambient glow lighting, and dynamic health badges that instantly color-code your result.

The app ships in MIUI's signature **dark aesthetic** with a pure-black canvas, vibrant accent gradients, and a **glassmorphism** surface language.

> 🔒 **Privacy-First, Zero Backend** — There is no server, no database, and no account. All calculations and history are stored **exclusively in your browser's LocalStorage**. Your health data never leaves your device.

---

## ✨ Key Features

- 🧮 **Accurate BMI Calculation** — Instant gauge pointer, category feedback (Underweight / Normal / Overweight / Obese), suggested weight range, and weight-difference analysis based on MIUI/Asian standard thresholds.
- 📈 **Interactive History & Trend Line Chart** — Powered by **Recharts** with custom hover tooltips; track up to 30 past measurements and visualize your BMI trajectory over time.
- 📱 **Progressive Web App (PWA)** — Installable on **Android, iOS & Desktop** via `vite-plugin-pwa`. Service Worker offline caching means the app works with **zero connectivity**, complete with an offline status toast.
- 💾 **LocalStorage State Retention** — Your last-used age, gender, height, and weight are remembered as defaults. Full data management: select, delete, or **clear entire history** in one tap.
- 🎚️ **Smooth Interactive Sliders** — MIUI-style range inputs with unit toggles (**cm ⇄ ft/in**, **kg ⇄ lbs**) that convert values on the fly.
- 🌗 **Responsive & Mobile-First Glassmorphism Design** — Fluid layout from phone to desktop, animated page transitions, ambient background lighting on large screens, and gender-select iconography.
- ℹ️ **Built-in BMI Knowledge Modal** — Category reference table explaining each BMI range without leaving the app.

---

## 🛠️ Tech Stack

| Layer        | Technology                                        |
| ------------ | ------------------------------------------------- |
| Framework    | **React 19** + **Vite 8**                         |
| Language     | **TypeScript**                                    |
| Styling      | **Tailwind CSS v4** + **Lucide React** icons      |
| Animation    | **Motion** (Framer Motion)                        |
| Charts       | **Recharts 3**                                    |
| PWA          | **vite-plugin-pwa** (Web App Manifest + Workbox Service Worker) |
| Storage      | **Browser LocalStorage** (no backend)             |
| Deployment   | **Vercel**                                        |

---

## 📁 Project Structure

```
BMI-Calculator/
├── public/                      # Static PWA assets
│   ├── icon.svg                 # App icon (SVG)
│   ├── apple-touch-icon.png     # iOS home screen icon
│   ├── pwa-192x192.png          # PWA icon (any)
│   ├── pwa-512x512.png          # PWA icon (any)
│   └── pwa-maskable-512x512.png # PWA icon (maskable)
├── src/
│   ├── components/
│   │   ├── BMIInputScreen.tsx   # Sliders, unit toggles, gender/age inputs
│   │   ├── BMIResultScreen.tsx  # Gauge, category badge, weight analysis
│   │   ├── BMIHistoryModal.tsx  # Stored measurement list + data management
│   │   ├── BMIInfoModal.tsx     # BMI category reference table
│   │   ├── BMITrendsChart.tsx   # Recharts trend line with custom tooltips
│   │   ├── GenderIcons.tsx      # Custom male/female SVG icons
│   │   ├── OfflineIndicator.tsx # Offline status toast
│   │   └── PWAInstallButton.tsx # Native install prompt UI
│   ├── hooks/
│   │   └── usePWAInstall.ts     # beforeinstallprompt handling
│   ├── types/
│   │   └── bmi.ts               # Shared TypeScript interfaces
│   ├── utils/
│   │   └── bmiCalculator.ts     # BMI math, thresholds, unit conversions
│   ├── App.tsx                  # Screen routing + LocalStorage state
│   ├── main.tsx                 # Entry point
│   └── index.css                # Tailwind + global styles
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts               # Vite + Tailwind + PWA plugin config
```

---

## 🚀 Local Setup & Installation

**Prerequisites:** [Node.js](https://nodejs.org/) 18+ and npm (or Bun).

```bash
# 1. Clone the repository
git clone https://github.com/razazaheer12/BMI-Calculator.git

# 2. Navigate into the project
cd BMI-Calculator

# 3. Install dependencies
npm install

# 4. Start the dev server (http://localhost:3000)
npm run dev
```

### Available Scripts

| Command           | Description                                   |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Start dev server on port **3000** (PWA enabled in dev) |
| `npm run build`   | Production build with generated Service Worker |
| `npm run preview` | Preview the production build locally         |
| `npm run lint`    | Type-check the project (`tsc --noEmit`)      |

---

## 🌐 Deployment

The app is deployed on **[Vercel](https://bmi-ui-calculator.vercel.app/)** and updates automatically on every push to the repository.

To deploy your own instance:

1. Push your fork to GitHub.
2. Import the project in [Vercel](https://vercel.com/new) — Vite is auto-detected, no configuration needed.
3. Deploy. The `vite-plugin-pwa` build generates the manifest and Service Worker automatically, so PWA installability works out of the box.

---

## 📄 License & Credits

<div align="center">

This project is distributed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
Free to use, modify, and distribute with attribution.

---

**Designed & Developed by [Raza Zaheer](https://github.com/razazaheer12)**

⭐ *If you found this project helpful, consider giving it a star on GitHub!*

[Live Demo](https://bmi-ui-calculator.vercel.app/) · [Report a Bug](https://github.com/razazaheer12/BMI-Calculator/issues) · [Request a Feature](https://github.com/razazaheer12/BMI-Calculator/issues)

</div>

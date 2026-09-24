# MIUI BMI Calculator - Design & Technology Specification (DESIGN.md)

Yeh document hamare **MIUI / HyperOS inspired BMI Calculator Web App** ki mukammal technical architecture, UI theme, colors, typography aur device compatibility ko define karta hai.

---

## 1. Technologies & Languages (Tech Stack)

Is app ko banane ke liye modern aur high-performance web technologies use ki gayi hain taake yeh Redmi 13C aur har device par bilkul 120Hz native app ki tarah smooth chale:

| Component | Technology | Wajah / Faida |
|---|---|---|
| **Framework** | **React 19 (TypeScript)** | Fast rendering, modular component structure, type-safe clean code |
| **Bundler & Build Tool** | **Vite 8** | Near-instant load time, optimized bundle size |
| **Styling & Theme** | **Tailwind CSS v4** | Hardware-accelerated transitions, precise pixel control, zero runtime CSS overhead |
| **PWA Engine** | **vite-plugin-pwa (Workbox)** | Offline caching, standalone WebAPK support for Redmi 13C (Chrome / Browser installable) |
| **Micro-Animations** | **Motion (Framer Motion)** | Smooth gauge transitions, bubble callout movement, screen transitions |
| **Icons** | **Lucide React + Custom SVG** | Native MIUI style male/female silhouettes, arrows, metric icons |
| **Data Persistence** | **Browser LocalStorage (Zero-Login)** | Koi sign-in / registration ki zaroorat nahi. History user ke apne mobile device par save rehti hai |

---

## 2. Color Palette (Xiaomi MIUI Dark Mode)

Screenshot ke bilkul mutabiq deep AMOLED black aur signature Xiaomi orange color palette:

| Color Name | Hex Code | Usage |
|---|---|---|
| **AMOLED Pitch Black** | `#000000` | Main application background (Redmi 13C screen battery saver) |
| **Card / Surface Dark** | `#161618` / `#1c1c1e` | Active gender toggle container, history cards |
| **Divider / Border** | `#27272a` (zinc-800) | Input underlines, section dividers |
| **Xiaomi Signature Orange** | `#ff6900` / `#f97316` | Main "Calculate" button, Active Male icon, Primary accents |
| **Inactive Toggle Grey** | `#2a2a2e` background / `#71717a` icon | Inactive Female/Male toggle icon container |
| **Text Primary (White)** | `#ffffff` | Age, Height, Weight numbers, BMI result score |
| **Text Secondary (Muted)** | `#9ca3af` / `#a1a1aa` | Labels ("Height (cm)", "Gender: Male") |
| **Text Description (Dim)** | `#71717a` | "About BMI" paragraph, footnotes |

### BMI Category Spectrum Colors (Continuous Gradient Bar):
1. **Underweight (< 18.5)**: `#38bdf8` (Cyan Blue)
2. **Normal (18.5 – 24.0)**: `#22c55e` (Vibrant Emerald Green)
3. **Overweight (24.0 – 28.0)**: `#f59e0b` (Warm Amber / Gold)
4. **Obese (≥ 28.0)**: `#f97316` / `#ef4444` (Deep Orange-Red)

---

## 3. Typography & Sizing

- **Font Family**: MiSans / System Native Font (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`)
- **Large BMI Result**: `text-7xl` ya `text-8xl` (Font Weight: 800 Black), super crisp numbers
- **Input Numbers**: `text-3xl` / `text-4xl` (Font Weight: 600 Semi-bold)
- **Labels**: `text-sm` / `text-base` (Font Weight: 400 Regular, muted grey)
- **Pill Badges**: `text-xs` (Font Weight: 600 Bold, uppercase tracking)

---

## 4. BMI & Suggested Weight Formulas (MIUI Standard)

Screenshots ke data analysis se Xiaomi Calculator ka exact mathematical formula replicate kiya gaya hai:

1. **BMI Formula**:
   $$\text{BMI} = \frac{\text{Weight (kg)}}{(\text{Height in meters})^2}$$
   - *Example*: $64 \div (1.8886)^2 = 17.93 \approx 17.9$ (Underweight)
   - *Example*: $65 \div (1.8288)^2 = 19.44 \approx 19.4$ (Normal)

2. **Suggested Healthy Weight Range (18.5 to 24.0 BMI)**:
   - $\text{Minimum Weight} = 18.5 \times (\text{Height in meters})^2$
   - $\text{Maximum Weight} = 24.0 \times (\text{Height in meters})^2$
   - *Example for 188.86 cm*: $18.5 \times 1.8886^2 = 65.98 \approx 66.0 \text{ kg}$, $24.0 \times 1.8886^2 = 85.6 \text{ kg}$ $\rightarrow$ **66.0 ~ 85.6 kg** (Exact match with Screenshot 2!).
   - *Example for 182.88 cm*: $18.5 \times 1.8288^2 = 61.87 \approx 61.9 \text{ kg}$, $24.0 \times 1.8288^2 = 80.27 \approx 80.3 \text{ kg}$ $\rightarrow$ **61.9 ~ 80.3 kg** (Exact match with Screenshot 3!).

---

## 5. Responsive & PWA Execution for Redmi 13C

- **Redmi 13C Mobile Screen**: Full viewport immersion (`min-h-[100dvh]`), native header, large tactile touch targets, Xiaomi-standard keypad / input interactions, PWA install prompt button.
- **Laptop & Desktop Screens**: Clean, centered, responsive web app container (`max-w-xl mx-auto`) with subtle ambient dark lighting. Har device screen (mobile, tablet, laptop, PC) par naturally fit hota hai bina kisi artificial device preview buttons ya fake mobile frame borders ke.
- **Gender Section Alignment**: Gender label aur Male/Female selection squircle cards right-aligned hain, jo Height aur Weight ke unit switches ke sath vertically perfectly synchronized hain.
- **PWA Features**:
  - `manifest.json` configured with `display: "standalone"`, `theme_color: "#000000"`, `background_color: "#000000"`.
  - Service worker precaching for complete offline capability (bina internet ke bhi chalega).
  - In-app install banner & button ("Install App" on Android Redmi 13C).

---

## 6. WHO & BMI Educational Slide-up Modal

Result screen par ek interactive **Info / WHO Standards** button diya gaya hai jo smooth slide-up bottom sheet modal open karta hai:
- **BMI Definition**: Body Mass Index ka formula aur wazan-o-qad ka scientific taaluq.
- **WHO Weight Ranges Table**:
  1. **Underweight**: $< 18.5$
  2. **Normal Weight**: $18.5 - 24.9$
  3. **Overweight**: $25.0 - 29.9$
  4. **Obese**: $\ge 30.0$
- **Live User Highlight**: User ka current BMI range table mein glowing badge ke sath highlight hota hai.
- **Medical Note**: Athletes aur muscle mass limitations ki wazahat.

# 💎 AlertWise: Next-Level Frontend Architectural Prompt

This prompt is engineered for elite code generation. It focuses on the **architectural integrity**, **motion design**, and **premium aesthetics** of the AlertWise platform.

---

## 🏛️ The Architectural Vision

Build a **Next.js 14+ (App Router)** frontend for AlertWise that feels like a flagship SaaS product (Vercel/Linear). The codebase must be modular, type-safe, and optimized for both performance and emergency usability.

### 🚫 Strict Constraints

1. **Zero `globals.css`**: Every style must be either in `tailwind.config.ts` or as inline utility classes.
2. **Monochrome Luxury**: Use a strict Black & White palette with 10 shades of grey for depth.
3. **Motion First**: UI is not static; it lives and breathes through Framer Motion.

---

## 🎨 Design System: The Blackstone Specs

### Atoms (Tailwind Config)

- **Colors**:
  - `background`: `#000000` (Dark) / `#FFFFFF` (Light)
  - `foreground`: `#FFFFFF` / `#000000`
  - `accents`: `#111111`, `#333333`, `#888888`, `#EAEAEA`
  - `danger`: `#FF0000` (Used only for SOS and Critical Alerts)
- **Borders**: `1px solid rgba(255, 255, 255, 0.1)` (Vercel-style subtle borders).
- **Glassmorphism**: `backdrop-blur-md bg-black/40` for navigation and cards.

---

## 🕹️ Component Breakdown & Motion Specs

### 1. The "Vortex" Hero Section

- **Implementation**: A 3D-feeling grid background (SVG/CSS) with a central glow.
- **Motion**: Headline text uses a "staggered character" entrance animation.
- **CTA**: A button with a "border-trace" animation on hover using `framer-motion`.

### 2. The Disaster Theory Engine (`/learn`)

- **Structure**: A sidebar with hazard categories and a main content area.
- **Rich Text**: Render markdown with a custom `prose` implementation that is strictly Monochrome.
- **Micro-Interaction**: Hovering over a survival tip reveals a "Copy to Clipboard" icon with a spring-loaded animation.

### 3. The "Pulse" Quiz System (`/quiz`)

- **State Machine**: Use `Zustand` to manage `currentQuestion`, `answers`, `score`, and `UIState` (Idle, Active, Result).
- **Animation**: When switching questions, the old question slides out to the left, and the new one slides in from the right (AnimatePresence).
- **Result Dashboard**: Use **Recharts** with a monochrome theme to show preparedness over time.

### 4. The "Zenith" SOS Module (High Accuracy)

- **Location Logic**: Use a custom `useGeolocation` hook. Display lat/long in a monospace font (Courier/Geist Mono).
- **The Button**: A massive button with a `scale: [1, 1.05, 1]` pulsing loop.
- **Emergency Flow**:
  1. Trigger -> `vibrate` device.
  2. Simulate "Secure Tunnel Established" animation.
  3. Show a pulse map with a wave effect expanding from user's location.

---

## 📝 The Master Instruction

"Act as a Principal Frontend Architect. Build the **AlertWise** frontend using Next.js 14.

**STYLING**: You are strictly forbidden from creating a `globals.css` file. Inject all base styles (like smooth scrolling and default background/text colors) directly into the Root Layout component using Tailwind's `className` on the `body` and `html` tags. Configure the `tailwind.config.ts` to include a custom 'edge' color for borders.

**COMPONENTS**:

- Build a `Navbar` that is fixed with a `sticky` glassmorphism effect.
- Build a `LayoutWrapper` that handles staggered entrance animations for all child pages.
- Create a `HazardCard` component that uses `whileHover={{ y: -5 }}` and a subtle outer glow.

**FEATURES**:

- Implement the `/sos` page as a dark-mode-only dashboard with a massive technical button.
- Implement the `/learn` section using a vertical navigation drawer on mobile and a sidebar on desktop.
- Implement a `QuizResult` component that uses `framer-motion` to count numbers up from 0 to the final score.

Ensure every component is fully responsive and uses ARIA labels for accessibility. The final result should look like a Vercel-designed emergency response system."

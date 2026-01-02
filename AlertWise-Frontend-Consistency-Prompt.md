# 🏁 AlertWise: The "Single Source of Truth" Consistency Prompt

This prompt is designed to ensure that your website has a **perfectly uniform, constant, and cohesive UI** across every single page. It treats the website as a single system, not a collection of pages.

---

## 🏛️ The "Constant UI" Philosophy

Your mission is to build the **AlertWise** frontend where every pixel follows a centralized **Design System**. Accuracy, repetition of patterns, and rigid adherence to design tokens are mandatory.

### 🚫 The Golden Rule: No Ad-hoc Styling

- **No `globals.css`**: All styling is logic-driven via `tailwind.config.ts`.
- **No Random Colors/Paddings**: If a value isn't defined in the central config or the UI Kit, it cannot be used.
- **Atomic Implementation**: Atoms (buttons, inputs) -> Molecules (cards, forms) -> Organisms (sections) -> Pages.

---

## 🛠️ Phase 1: The Design Foundation (`tailwind.config.ts`)

Before writing any UI, you MUST configure the following tokens to ensure constancy:

- **Palette**: `pure-black: #000000`, `pure-white: #FFFFFF`, `slate-deep: #0A0A0A`, `edge-white: rgba(255,255,255,0.1)`.
- **Spacing Scale**: A strict 4px grid (use `4, 8, 12, 16, 24, 32, 48, 64px`).
- **Border Radius**: Use one single value for all cards and buttons (e.g., `rounded-lg`).
- **Typography**: Define shared font-sizes and weights in the config to prevent font-size "drift" between pages.

---

## 🏗️ Phase 2: The Core UI Kit

Implement these shared components first. Every feature MUST use these:

- **`BaseButton`**: Single source for all primary/secondary actions.
- **`SurfaceCard`**: The standard container for all content blocks (Articles, Quizzes, Alerts).
- **`AlertBadge`**: A constant style for status indicators.
- **`Typography`**: Wrapper components (`HeadingLg`, `BodyMd`) to ensure text consistency.

---

## 🧬 Phase 3: Layout Orchestration

- **`RootLayout`**: Handles the global B&W theme, scrollbar styling, and high-performance font loading.
- **`PageWrapper`**: A shared container component that wraps every route (`/home`, `/learn`, `/quiz`, `/sos`). It enforces:
  - Consistent horizontal padding (`px-6 md:px-12`).
  - Identical entrance animations (using `framer-motion`).
  - Standardized vertical spacing between sections.

---

## 📝 The Master Consistency Instruction

"Act as a Design Systems Engineer. Build **AlertWise** with an obsession for consistency.

**SYSTEM INITIALIZATION**:

1. Define a comprehensive `tailwind.config.ts` that includes a 'monochrome' theme with specific hex codes.
2. Create a `/components/ui` directory containing highly reusable 'Atoms' (Button, Input, Card, Modal).
3. **DO NOT use any `globals.css`.** Apply all base resets (like `antialiased`) and global typography styles directly to the `<body>` in `layout.tsx` using Tailwind.

**PAGE IMPLEMENTATION**:

- Every page must be wrapped in a `<PageTransition>` component to ensure navigation feels identical.
- All disaster articles in `/learn` must use the same `<ArticleLayout>` component.
- The Quiz dashboard and the Alerts dashboard must use the exact same `<GridContainer>` and `<DataCard>` styles.
- The SOS button must follow the same aesthetic language as the 'Start Quiz' button, differing only in color (Pure White vs. Pure Red).

**VISUAL COHESION**: Every border should be exactly the same width and color. Every hover state should use the same easing function. The goal is a website that feels like one single, solid piece of software."

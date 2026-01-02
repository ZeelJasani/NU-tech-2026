# Admin Panel Implementation Instructions

To integrate the admin panel into your AlertWise project, place the files in this folder into your `src` directory as follows:

### 📁 Application Routes (`src/app/`)

- `app/admin/layout.tsx` -> `src/app/admin/layout.tsx`
- `app/admin/page.tsx` -> `src/app/admin/page.tsx`

### 📁 Components (`src/components/`)

- `components/admin/Overview.tsx` -> `src/components/admin/Overview.tsx`
- `components/admin/DrillManagement.tsx` -> `src/components/admin/DrillManagement.tsx`
- `components/admin/StudentTracking.tsx` -> `src/components/admin/StudentTracking.tsx`
- `components/admin/Analytics.tsx` -> `src/components/admin/Analytics.tsx`
- `components/admin/ModuleManagement.tsx` -> `src/components/admin/ModuleManagement.tsx`

---

### 🔧 Integration Steps

1. **Navbar Link**:
   Add the following `Link` component to your `src/components/Navbar.tsx` inside the main navigation section:

   ```tsx
   <Link
       href="/admin"
       className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] hover:text-primary transition-colors"
   >
       Admin
   </Link>
   ```

2. **Dependencies**:
   Ensure you have `lucide-react` and `framer-motion` installed:

   ```bash
   npm install lucide-react framer-motion
   ```

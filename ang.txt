# Angular-First-prog

### Angular + Tailwind CSS Project Overview

**Project Type:**

- Angular frontend application using standalone components
- Routing handled through a dedicated `app.routes.ts` file

**Styling Setup:**

- Tailwind CSS integrated via PostCSS with the plugin `@tailwindcss/postcss`
- Tailwind styles imported globally in `src/style.css` using:

  ```css
  @import "tailwindcss";
  ```

- Component-specific styles in individual CSS files (e.g., `app.css`)

**PostCSS Configuration:**

- PostCSS config file named `postcssrc.json` located in the project root with:

  ```json
  {
    "plugins": {
      "@tailwindcss/postcss": {}
    }
  }
  ```

**Project Folder Structure:**

```
src/
├── index.html                <-- Main HTML file
├── main.ts                  <-- Angular bootstrap entry
├── style.css                <-- Global styles, imports Tailwind CSS
└── app/
    ├── app.ts               <-- Root AppComponent (standalone)
    ├── app.routes.ts        <-- Routing config (includes paths like 'tailwind')
    ├── app.config.ts        <-- Application-level config
    ├── app.html             <-- Root component template
    ├── app.css              <-- Root component CSS styles
    ├── app.spec.ts          <-- Tests for AppComponent
```

**Build & Serve:**

- Angular CLI or custom build scripts used to build and serve the app
- Tailwind utilities available globally via `style.css`

---

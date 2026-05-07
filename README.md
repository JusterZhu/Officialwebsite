# TSLH Official Website

TSLH Official Website is a high-end enterprise homepage built with the Next.js App Router. It uses bilingual markdown content, a cinematic scroll-driven PNG frame sequence, GSAP animations, Lenis smooth scrolling, and Tailwind CSS.



---

## Key Features

*   **Premium Scroll Animations**: Built with GSAP and ScrollTrigger for a cinematic, depth-filled experience (parallax, scaling, and entrance effects).
*   **Smooth Scroll Logic**: Integrated with `lenis` for buttery-smooth scrolling that enhances the user journey.
*   **Interactive Components**: Elegant hover states and micro-animations using Framer Motion.
*   **Performance First**: Optimized with Next.js 16+ and modern web standards.
*   **Responsive Excellence**: Fully responsive design tailored for mobile, tablet, and desktop viewports.
*   **Visual Storytelling**: A layered "hero" section that mimics a cockpit/window view, pulling users into the experience.

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Animation**: [GSAP](https://gsap.com/) & [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- **Gestures/Transitions**: [Framer Motion](https://www.framer.com/motion/)
- **Smooth Scroll**: [Lenis](https://lenis.darkroom.engineering/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## Project Structure

```text
src/
├── app/            # Next.js App Router (Layouts, Pages, Providers)
├── content/        # Bilingual markdown content
├── lib/            # Markdown/content loading utilities
└── components/     # Reusable UI components
    ├── SmoothScrollHero.jsx
    ├── FloatingButton.jsx
    └── Navbar.jsx

frames/             # PNG sequence served by /frames/[frame]
src/assets/images/  # Homepage image assets
web.config.json     # Web host and port configuration for development/production startup
```

---

## Getting Started

### Prerequisites

- Node.js 20.19.0 or newer
- npm 10 or newer

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/JusterZhu/TSLH.Officialwebsite.git
   cd TSLH.Officialwebsite
   ```

2. **Install dependencies**:
   ```bash
   npm ci
   ```
   `npm ci` installs the exact dependency versions from `package-lock.json`, which keeps local, CI, and production builds reproducible.

3. **Configure the web address and port**:
   Edit `web.config.json` before starting the website:
   ```json
   {
     "host": "0.0.0.0",
     "port": 3000
   }
   ```
   Use `host` as the server bind address. Keep `0.0.0.0` for server deployment, or use `127.0.0.1` for local-only access. Change `port` to the port you want to open.

4. **Run the development server for local development**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to `http://localhost:3000` when using the default port, or replace `3000` with the port configured in `web.config.json`.

### Production Build and Launch

`npm run build` only compiles the Next.js production build into `.next`; it does not start a web server. To compile and launch the production app locally or on a Node.js server, run:

```bash
npm ci
npm run build
npm run start
```

Then open `http://<server-ip>:<port>` using the port configured in `web.config.json`. In production, keep the `frames/` directory beside `package.json` because the `/frames/[frame]` route reads PNG frames from that path at runtime.

### Release and Startup Checks

Before releasing, run:

```bash
npm run lint
npm run build
npm audit
```

The project reads the web bind address and port from `web.config.json`. The `engines` field in `package.json` documents the Node.js version required by Next.js, and dependencies are pinned/overridden to patched versions to avoid known release-time audit findings.

---

## Implementation Notes

- **Scroll Pinning**: The main hero section uses GSAP `pin` to hold the view while internal animations (like scaling the "window") occur.
- **GSAP Context**: Uses `@gsap/react` for safe cleaning of animations in React's development mode.
- **Z-Index Strategy**: Specific layering in `SmoothScrollHero.jsx` ensures the logo remains interactive while the "sky" moves behind it.

ROLE
You are a senior creative frontend engineer and UI/UX designer. Upgrade my existing portfolio (live: https://kishore-portfolio-k36z.vercel.app/) into a premium, 2027-grade "AI Full Stack Developer" portfolio. Keep my current stack (React/Next.js, Tailwind, Three.js/WebGL, Vercel). First read the codebase, summarize the current architecture, then implement the changes below. Don't rewrite things that already work.

1. IDENTITY & CONTENT UPDATES
- Name/title: "Kishore C — AI Full Stack Developer" (replace "Full Stack Developer" everywhere: hero, navbar, meta title/description, OG/Twitter tags).
- Experience: "5+ Years" everywhere (hero stats, About, meta).
- Hero tagline: something like "I build AI-powered products — from pixel to production." Use a typewriter/rotating-word effect: "AI Agents · RAG Systems · Scalable Web Apps · Real-time Platforms".
- Replace the filler stats ("∞ Passion", "100% Dedication") with real ones: 5+ Years Experience, 10+ Projects Shipped, 3 AI-Powered Platforms, 15+ Technologies. Animate them with count-up on scroll.
- Rewrite About in a confident, concise first-person voice. Cover: 5+ years, frontend-first, now building AI agents, RAG pipelines, real-time voice/video (LiveKit, WebRTC), and FastAPI backends. Include a "Currently Building" card (AI agents & workflows, Python + Next.js).
- Add an Experience timeline (see section 4).

2. UI/DESIGN SYSTEM UPGRADE
- Style: dark-first, futuristic "AI-native" look: deep near-black background, subtle gradient mesh, one accent gradient (electric violet → cyan), glassmorphism cards with 1px gradient borders, soft glow on hover, grain/noise overlay at low opacity.
- Typography: pair a modern display font (e.g. Space Grotesk / Sora / Clash Display) with Inter for body, plus a mono font (JetBrains Mono) for tech tags. Fluid type scale with clamp().
- Add a light/dark toggle if it fits, but dark is the default.
- Floating pill navbar with active-section highlighting (scroll-spy), a "Hire Me" CTA with a magnetic hover effect, and a scroll progress bar.
- Custom cursor (small dot + trailing ring that expands over links/cards), disabled on touch devices.
- Fully responsive (mobile-first), WCAG AA contrast, visible focus states, and honor prefers-reduced-motion everywhere.

3. 3D BACKGROUND & SCROLL ANIMATIONS (keep and enhance the existing 3D background)
- Keep the Three.js / React Three Fiber background but make it scroll-driven: camera position, rotation, and color shift per section (e.g. neural-network particle field in Hero → floating geometry in Projects → data-stream/grid in Skills → calm particles in Contact).
- Theme the scene as an AI neural network: nodes and connecting lines that react to mouse movement (parallax) and pulse on section change.
- Performance: lazy-load the canvas, cap DPR at 1.5–2, use instancing for particles, pause rendering when the tab is hidden, and fall back to a static gradient on low-end devices and for reduced-motion users. Target 60fps on mid-range mobile.
- Add smooth scrolling (Lenis) and scroll-triggered animations with GSAP ScrollTrigger or Framer Motion: text split-reveal on headings, staggered card entrances, parallax on images, horizontal-scroll or pinned sections for Projects.
- Page-load intro: short preloader (under 1.5s) with a name/logo reveal, then the hero animates in.
- Micro-interactions: tilt-on-hover cards, animated underline links, button ripple/shine, section dividers that draw in on scroll.

4. EXPERIENCE SECTION (new, timeline UI)
Animated vertical timeline, scroll-revealed:
- Senior Frontend Developer — Articence Inc (Aug 2024 – Present): AI-powered call center app with role-based access (admin/manager/user); AI agent features with real-time interaction using React.js, MUI, WebSockets, Redux/Context; customized WordPress CMS; deployed on AWS; worked with backend, AI, and design teams.
- Frontend Developer — iLearningEngines (Aug 2021 – Apr 2024): e-learning platform for education and enterprise (student/teacher/admin); React.js frontend plus Node.js + PostgreSQL contributions for assessments, courses, surveys; Figma UI/UX; data-driven student progress insights.
- Back Office Executive — Toplights Labels (Nov 2020 – Apr 2021): technical support and a ReactJS label-selecting tool.
Show tech chips per role and a one-line impact statement each.

5. SKILLS SECTION REDESIGN
- Remove the percentage bars. Use grouped, filterable skill cards or an interactive orbit/tech-sphere (3D or CSS) with category tabs: Frontend, Backend, Database, AI & ML, DevOps & Tools.
- Frontend: React.js, Next.js 14, React Native, TypeScript, JavaScript, Tailwind, SCSS, MUI, Redux, Zustand, TanStack Query, Webpack, Jest, Cypress.
- Backend & DB: Node.js, Python, FastAPI, REST, WebSockets, PostgreSQL, PostGIS, MongoDB, MySQL, Redis, Elasticsearch.
- AI & ML: Anthropic Claude API, Google Gemini, LLM architectures, RAG, AI agents & workflows, structured output/data extraction, NLP/NLU, AI safety & guardrails.
- Real-time & Integrations: WebRTC, VoIP, LiveKit, Google OAuth, Azure MSAL, Stripe, Razorpay, Google Cloud APIs.
- DevOps & Tools: Docker, AWS, Linux, CI/CD, GitLab/GitHub, Jira, Postman.
- Hover reveals a short "what I built with it" tooltip.

6. PROJECTS SECTION (featured + grid)
Order: new AI projects first and marked "Featured", then the rest. Each card needs a screenshot/preview, a short description, a tech-chip row, a Live Demo button, a GitHub link only if the repo is mine, and a detail modal or page with problem → solution → stack → outcome.
- GlobalReach — B2B Lead Discovery & Outreach CRM: enterprise-ready B2B client acquisition platform for lead prospecting and sales pipeline tracking. Stack: Next.js 14, TypeScript, FastAPI, PostgreSQL, PostGIS, Redis, Elasticsearch, Docker. Live: https://www.getyourclientsb2b.com/
- AI-Powered Social Media & Marketing Automation Platform: autonomous multi-channel marketing and growth engine for acquiring B2B clients at scale. Stack: Next.js 14, React 18, TypeScript, TailwindCSS, TanStack Query v5, Recharts, Zod; FastAPI, Pydantic v2, SQLAlchemy 2.0, Alembic. Live: https://growth.getyourclientsb2b.com/
- AI-Powered Call Center App (Articence) — https://demo.articence.com/
- Dynamic Online Learning Platform (iLearning) — https://production.aaisolutions.dev/login
- Clinic Management Web & Mobile App (Next.js, React Native, Node.js, MySQL) — https://clinicmanagement.sitemanagershub.com/login
- E-Commerce Web App — https://shop.gsgroup.co/login
- Staff Management App (Next.js, role-based access control)
- E-Medicine Search & Buy App — https://cappsule.vercel.app/
- Drop or merge weak entries (e.g. the duplicate Articence cards and Movie Watchlists) unless they add value.
- FIX: remove or replace the incorrect GitHub links currently pointing to other people's repos (diegotellezc/EasyShop, academloShop, landing-accio-vocabulary). Link only repos that belong to github.com/KishoreReact, otherwise hide the button.
- SCREENSHOTS: use the images I place in /public/images/projectsImages/ (globalreach.png, growth-platform.png). Use next/image with blur placeholders and lazy loading, show them in a browser-frame or device-mockup with a hover-tilt effect and a lightbox gallery. If a file is missing, use a styled placeholder and list the missing files in your final report. Don't invent images.

7. EXTRAS TO STAND OUT AS "2027 AI-NATIVE"
- Add an "Ask my AI" chat widget (floating button) that answers questions about my experience, skills, and projects, powered by the Anthropic Claude API through a Next.js API route (key in env vars, rate-limited, system prompt grounded only in my resume data, safe fallback if the API fails).
- Add a "Download Resume" button (PDF) and a "Book a call" CTA.
- Contact form wired to a real backend (Resend/EmailJS or a Next.js route) with validation (Zod), a success animation, and spam protection.
- Add a short "How I work with AI" section: agents, RAG, guardrails, evals.
- Tech-chip marquee or logo strip of tools I use.

8. SEO, PERFORMANCE & QUALITY
- Update metadata, OG image (auto-generated with name + title), JSON-LD Person schema, sitemap, and robots.
- Lighthouse targets: Performance 90+, Accessibility 95+, SEO 100. Code-split heavy 3D/animation code, optimize images (WebP/AVIF), and preload fonts.
- Keep the code clean: typed components, a single content/data file (e.g. data/portfolio.ts) for all text, projects, and skills so I can edit without touching components.

DELIVERABLES
1. Short audit of the current site (what you kept, changed, removed).
2. The implemented upgrade, committed in logical steps.
3. A final summary listing the new dependencies, env vars needed (e.g. ANTHROPIC_API_KEY), missing assets, and how to run and deploy to Vercel.
Ask me before making any breaking decision (e.g. a framework migration). Otherwise proceed.
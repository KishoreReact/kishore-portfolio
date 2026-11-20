export const siteConfig = {
  name: "Kishore",
  fullName: "Kishore C",
  title: "AI Full Stack Developer",
  tagline: "I build AI-powered products — from pixel to production.",
  bio: "I'm a frontend-first engineer with 5+ years building scalable web products. Today I build AI agents, RAG pipelines, real-time voice/video platforms (LiveKit, WebRTC), and FastAPI backends that go from prototype to production. I care deeply about clean architecture, great UX, and shipping fast.",
  bioLine2:
    "Currently at Articence, architecting an AI-powered call center platform — real-time WebSocket streams, role-based dashboards, and LLM-driven conversation analysis. Previously built e-learning infra at iLearningEngines serving thousands of students.",
  location: "Palakkad, Kerala, India",
  phone: "+919048898225",
  yearsExperience: 5,
  projectsCompleted: 10,
  aiPlatforms: 3,
  technologiesCount: 15,
  email: "kishorekichan12@gmail.com",
  profileImage: "/images/kishore.anime.jpg",
  resumeUrl: "/Kishore_Resume.pdf",
  bookingUrl: "https://calendly.com/kishorekichan12",

  // 3D Model - drop a .glb file in /public/models/ and set path here
  heroModelPath: null as string | null,

  social: {
    github: "https://github.com/KishoreReact",
    linkedin: "https://www.linkedin.com/in/kishore-c-95742712a/",
    instagram: "https://www.instagram.com/kishore_kichuzz_/",
  },

  emailjs: {
    serviceId: "service_gx4ygxm",
    templateId: "template_chj386o",
    publicKey: "7cChOnv_WL66z7-xo",
  },

  // ── Experience timeline ──────────────────────────────────────────────────────
  experience: [
    {
      id: 1,
      role: "Senior Frontend Developer",
      company: "Articence Inc",
      period: "Aug 2024 – Present",
      impact:
        "Architected AI call-center platform with real-time WebSocket streams & LLM-driven analytics serving enterprise clients.",
      description:
        "AI-powered call center app with role-based access (admin/manager/user); AI agent features with real-time interaction; customized WordPress CMS; deployed on AWS; collaborated with backend, AI, and design teams.",
      tech: ["React.js", "MUI", "WebSockets", "Redux", "Context API", "AWS", "AI Agents"],
      type: "current" as const,
    },
    {
      id: 2,
      role: "Frontend Developer",
      company: "iLearningEngines",
      period: "Aug 2021 – Apr 2024",
      impact:
        "Built education & enterprise e-learning platform used by thousands; drove student progress insights through data visualizations.",
      description:
        "React.js frontend for a multi-tenant e-learning platform (student/teacher/admin roles); contributed to Node.js + PostgreSQL backend for assessments, courses, and surveys; Figma UI/UX design collaboration.",
      tech: ["React.js", "Node.js", "PostgreSQL", "Figma", "TypeScript"],
      type: "past" as const,
    },
    {
      id: 3,
      role: "Back Office Executive",
      company: "Toplights Labels",
      period: "Nov 2020 – Apr 2021",
      impact: "Delivered a ReactJS label-selector tool that cut manual processing time by ~40%.",
      description:
        "Technical support and development of a ReactJS label-selecting tool for internal operations.",
      tech: ["React.js", "JavaScript"],
      type: "past" as const,
    },
  ],

  // ── Skills (grouped, no percentages) ────────────────────────────────────────
  skills: [
    // Frontend
    { name: "React.js", category: "Frontend", tooltip: "Built 5+ production apps, real-time dashboards" },
    { name: "Next.js 14", category: "Frontend", tooltip: "App Router, SSR/SSG, API routes, Edge" },
    { name: "TypeScript", category: "Frontend", tooltip: "Typed every project since 2022" },
    { name: "JavaScript", category: "Frontend", tooltip: "ES2024, async patterns, Proxy, WeakMap" },
    { name: "Tailwind CSS", category: "Frontend", tooltip: "Design systems, glassmorphism, animations" },
    { name: "SCSS / CSS", category: "Frontend", tooltip: "BEM, variables, complex animations" },
    { name: "MUI", category: "Frontend", tooltip: "Themed MUI for Articence enterprise app" },
    { name: "Redux / Zustand", category: "Frontend", tooltip: "Global state in multi-role dashboards" },
    { name: "TanStack Query", category: "Frontend", tooltip: "v5 — caching, optimistic updates" },
    { name: "React Native", category: "Frontend", tooltip: "Clinic Management mobile app" },
    { name: "Framer Motion", category: "Frontend", tooltip: "3D hero, scroll animations on this site" },
    { name: "Three.js / R3F", category: "Frontend", tooltip: "Neural-network particle field on this site" },
    // Backend & DB
    { name: "Node.js", category: "Backend", tooltip: "REST APIs, WebSocket servers, auth" },
    { name: "Python", category: "Backend", tooltip: "AI pipelines, FastAPI, data extraction" },
    { name: "FastAPI", category: "Backend", tooltip: "GlobalReach & AI Marketing Platform backends" },
    { name: "WebSockets", category: "Backend", tooltip: "Real-time Articence call events" },
    { name: "REST APIs", category: "Backend", tooltip: "Designed & consumed 10+ external APIs" },
    { name: "PostgreSQL", category: "Database", tooltip: "PostGIS for geo queries in GlobalReach" },
    { name: "MySQL", category: "Database", tooltip: "Clinic management system" },
    { name: "Redis", category: "Database", tooltip: "Caching layer in GlobalReach" },
    { name: "MongoDB", category: "Database", tooltip: "Flexible schema for content-heavy apps" },
    { name: "Elasticsearch", category: "Database", tooltip: "Full-text search in GlobalReach" },
    // AI & ML
    { name: "Anthropic Claude API", category: "AI & ML", tooltip: "Structured output, RAG, agents" },
    { name: "Google Gemini", category: "AI & ML", tooltip: "Multimodal prompting experiments" },
    { name: "RAG Pipelines", category: "AI & ML", tooltip: "Vector retrieval + LLM grounded answers" },
    { name: "AI Agents", category: "AI & ML", tooltip: "Tool-calling agents with workflow orchestration" },
    { name: "LLM Architectures", category: "AI & ML", tooltip: "Prompt design, evals, guardrails" },
    { name: "NLP / NLU", category: "AI & ML", tooltip: "Intent classification, entity extraction" },
    // Real-time & Integrations
    { name: "WebRTC", category: "Real-time", tooltip: "P2P video & audio in call center app" },
    { name: "LiveKit", category: "Real-time", tooltip: "Real-time voice/video platform integration" },
    { name: "VoIP", category: "Real-time", tooltip: "SIP/PSTN bridging for Articence" },
    { name: "Google OAuth", category: "Real-time", tooltip: "OAuth2 flows in multiple apps" },
    { name: "Azure MSAL", category: "Real-time", tooltip: "Enterprise SSO for iLearning" },
    { name: "Stripe / Razorpay", category: "Real-time", tooltip: "Payment flows in e-commerce" },
    // DevOps
    { name: "Docker", category: "DevOps", tooltip: "Containerized FastAPI + Next.js stacks" },
    { name: "AWS", category: "DevOps", tooltip: "EC2, S3, deployed Articence production" },
    { name: "Vercel", category: "DevOps", tooltip: "CI/CD for all Next.js projects" },
    { name: "GitLab CI / GitHub", category: "DevOps", tooltip: "Branch strategy, MR workflows" },
    { name: "Linux / Bash", category: "DevOps", tooltip: "Server setup, shell scripting" },
    { name: "Jira / Postman", category: "DevOps", tooltip: "Sprint planning, API testing" },
  ],

  // ── Tech marquee strip ───────────────────────────────────────────────────────
  techMarquee: [
    "React.js", "Next.js 14", "TypeScript", "Python", "FastAPI",
    "Anthropic Claude", "Google Gemini", "RAG", "AI Agents",
    "PostgreSQL", "Redis", "Docker", "AWS", "LiveKit", "WebRTC",
    "Three.js", "Framer Motion", "Tailwind CSS", "Node.js", "Vercel",
  ],
};

export type SiteConfig = typeof siteConfig;

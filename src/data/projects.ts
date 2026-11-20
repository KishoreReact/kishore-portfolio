export interface Project {
  id: number;
  title: string;
  shortDescription: string;
  description: string;
  technologies: string[];
  src: string;
  images: string[];
  demo: string;
  code?: string;         // only set when repo belongs to KishoreReact
  githubOwned: boolean;  // controls whether GH button renders
  featured: boolean;     // AI projects go first
  outcome?: string;      // one-line impact
  tags?: string[];
}

const projects: Project[] = [
  // ── FEATURED AI Projects ───────────────────────────────────────────────────
  {
    id: 10,
    title: "GlobalReach — B2B Lead Discovery & Outreach CRM",
    shortDescription:
      "Enterprise-grade B2B client acquisition platform for lead prospecting and sales pipeline tracking.",
    description:
      "Full-stack enterprise platform built for B2B lead discovery and sales pipeline management. Features geo-aware lead search with PostGIS, full-text search via Elasticsearch, real-time pipeline updates with Redis pub/sub, and a FastAPI backend containerised with Docker.",
    technologies: ["Next.js 14", "TypeScript", "FastAPI", "PostgreSQL", "PostGIS", "Redis", "Elasticsearch", "Docker"],
    src: "/images/projectsImages/globalreach.svg",
    images: ["/images/projectsImages/globalreach.svg"],
    demo: "https://www.getyourclientsb2b.com/",
    githubOwned: false,
    featured: true,
    outcome: "Live enterprise product — geo-aware lead search, real-time pipeline, full-text filtering.",
    tags: ["AI", "B2B", "CRM", "FastAPI"],
  },
  {
    id: 11,
    title: "AI Marketing Automation Platform",
    shortDescription:
      "Autonomous multi-channel marketing & growth engine for acquiring B2B clients at scale.",
    description:
      "AI-powered social media and marketing automation platform. Autonomous multi-channel campaigns, Recharts analytics dashboard, Pydantic v2 data validation, SQLAlchemy 2.0 ORM with Alembic migrations. Integrates with LinkedIn, email, and social APIs for end-to-end B2B outreach automation.",
    technologies: ["Next.js 14", "React 18", "TypeScript", "TailwindCSS", "TanStack Query v5", "FastAPI", "Pydantic v2", "SQLAlchemy", "Alembic"],
    src: "/images/projectsImages/growth-platform.svg",
    images: ["/images/projectsImages/growth-platform.svg"],
    demo: "https://growth.getyourclientsb2b.com/",
    githubOwned: false,
    featured: true,
    outcome: "Autonomous AI-driven outreach — reduced manual campaign setup from hours to minutes.",
    tags: ["AI", "Automation", "Marketing", "FastAPI"],
  },
  // ── Other Projects ─────────────────────────────────────────────────────────
  {
    id: 4,
    title: "VOC — AI-Powered Call Center App",
    shortDescription:
      "Role-based enterprise call center with AI-driven conversation analysis and real-time WebSocket streams.",
    description:
      "Built at Articence. AI-powered call center application featuring role-based access (admin/manager/user), real-time agent interaction via WebSockets, AI conversation analysis, MUI component library, Redux/Context state management, and AWS deployment.",
    technologies: ["React.js", "MUI", "WebSockets", "Redux", "Python", "PostgreSQL", "AWS"],
    src: "/images/projectsImages/voc1.png",
    images: [
      "/images/projectsImages/voclogin.png",
      "/images/projectsImages/voc1.png",
      "/images/projectsImages/voccall.png",
    ],
    demo: "https://demo.articence.com/",
    githubOwned: false,
    featured: false,
    outcome: "Enterprise-grade AI call center deployed on AWS for Articence.",
    tags: ["AI", "Real-time", "Enterprise"],
  },
  {
    id: 1,
    title: "Dynamic Online Learning Platform",
    shortDescription:
      "Multi-tenant e-learning platform serving students, teachers, and admins.",
    description:
      "Built at iLearningEngines. Full-featured e-learning platform with separate portals for students, teachers, and admins. Features course management, assessments, surveys, and data-driven progress insights. Frontend in React.js; contributed to Node.js + PostgreSQL backend.",
    technologies: ["React.js", "Node.js", "PostgreSQL", "JavaScript", "HTML5", "CSS"],
    src: "/images/projectsImages/ile1.png",
    images: [
      "/images/projectsImages/ilelogin.png",
      "/images/projectsImages/ile1.png",
      "/images/projectsImages/ile2.png",
      "/images/projectsImages/ile3.png",
    ],
    demo: "https://production.aaisolutions.dev/login",
    githubOwned: true,
    code: "https://github.com/KishoreReact",
    featured: false,
    outcome: "Shipped to thousands of learners across education & enterprise.",
    tags: ["Ed-Tech", "Full-Stack"],
  },
  {
    id: 2,
    title: "Clinic Management Web & Mobile App",
    shortDescription:
      "Cross-platform clinic operations app for appointments, staff, and patient records.",
    description:
      "Full-stack clinic management system with separate dashboards for managers, doctors, and patients. Handles appointment scheduling, consultation tracking, staff management, and patient records. Mobile companion built with React Native.",
    technologies: ["Next.js", "React Native", "Node.js", "MySQL", "JavaScript"],
    src: "/images/projectsImages/clinic1.png",
    images: [
      "/images/projectsImages/cliniclogin.png",
      "/images/projectsImages/clinic1.png",
      "/images/projectsImages/clinic2.png",
    ],
    demo: "https://clinicmanagement.sitemanagershub.com/login",
    githubOwned: false,
    featured: false,
    outcome: "Streamlined multi-role clinic ops across web and mobile.",
    tags: ["Healthcare", "Mobile", "Full-Stack"],
  },
  {
    id: 5,
    title: "E-Commerce Web App",
    shortDescription:
      "Food e-commerce platform with cart, wishlist, and seamless checkout.",
    description:
      "Browse a wide variety of food products, add favorites to a wishlist, manage cart, and place orders. Full product catalog with filtering, search, and order history. Backend with authentication and order processing.",
    technologies: ["React.js", "JavaScript", "HTML", "CSS", "Python", "PostgreSQL"],
    src: "/images/projectsImages/shopclues/shopHome.jpeg",
    images: [
      "/images/projectsImages/shopclues/shopLogin.jpeg",
      "/images/projectsImages/shopclues/shopHome.jpeg",
      "/images/projectsImages/shopclues/shop.shop.jpeg",
      "/images/projectsImages/shopclues/shop.detail.jpeg",
      "/images/projectsImages/shopclues/shop.cart.jpeg",
    ],
    demo: "https://shop.gsgroup.co/login",
    githubOwned: false,
    featured: false,
    outcome: "End-to-end e-commerce with cart, wishlist, and checkout.",
    tags: ["E-commerce", "React"],
  },
  {
    id: 6,
    title: "E-Medicine Search & Buy App",
    shortDescription:
      "Healthcare app to browse, search, and purchase medicines.",
    description:
      "MediSearch lets users browse medicine catalogs, search by name or condition, and manage healthcare purchases. Clean UI with React, responsive design, and integration with medicine APIs.",
    technologies: ["React.js", "JavaScript", "HTML5", "CSS"],
    src: "/images/projectsImages/emedi.png",
    images: ["/images/projectsImages/emedi.png"],
    demo: "https://cappsule.vercel.app/",
    githubOwned: false,
    featured: false,
    outcome: "Instant medicine search and seamless purchase flow.",
    tags: ["Healthcare", "React"],
  },
];

export default projects;

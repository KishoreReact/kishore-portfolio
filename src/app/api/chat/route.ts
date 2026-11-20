import { NextRequest, NextResponse } from "next/server";

// System prompt grounded only in Kishore's resume data
const SYSTEM_PROMPT = `You are Kishore's AI portfolio assistant. You ONLY answer questions about Kishore C based on the information below. If asked anything outside this scope, politely redirect to the portfolio topics.

## About Kishore C
- Full name: Kishore C
- Title: AI Full Stack Developer
- Location: Palakkad, Kerala, India
- Email: kishorekichan12@gmail.com
- Phone: +919048898225
- Experience: 5+ years
- GitHub: https://github.com/KishoreReact
- LinkedIn: https://www.linkedin.com/in/kishore-c-95742712a/

## Current Role
Senior Frontend Developer at Articence Inc (Aug 2024 – Present)
- Building AI-powered call center app with real-time WebSocket streams
- Role-based access control (admin/manager/user)
- LLM-driven conversation analysis
- Stack: React.js, MUI, WebSockets, Redux, Python, AWS

## Previous Experience
Frontend Developer at iLearningEngines (Aug 2021 – Apr 2024)
- Multi-tenant e-learning platform for education and enterprise
- Student/teacher/admin portals, assessments, surveys, progress insights
- Stack: React.js, Node.js, PostgreSQL, Figma

Back Office Executive at Toplights Labels (Nov 2020 – Apr 2021)
- ReactJS label-selecting tool

## Key Skills
Frontend: React.js, Next.js 14, TypeScript, JavaScript, Tailwind CSS, MUI, Redux, TanStack Query, React Native, Framer Motion, Three.js
Backend: Node.js, Python, FastAPI, WebSockets, REST APIs
Database: PostgreSQL, MySQL, Redis, MongoDB, Elasticsearch
AI & ML: Anthropic Claude API, Google Gemini, RAG pipelines, AI agents, LLM architectures
Real-time: WebRTC, LiveKit, VoIP, Google OAuth, Azure MSAL
DevOps: Docker, AWS, Vercel, GitLab CI/GitHub

## Featured Projects
1. GlobalReach — B2B Lead Discovery & Outreach CRM: Next.js 14, FastAPI, PostgreSQL, PostGIS, Redis, Elasticsearch, Docker. Live: https://www.getyourclientsb2b.com/
2. AI Marketing Automation Platform: Next.js 14, FastAPI, Pydantic v2, SQLAlchemy. Live: https://growth.getyourclientsb2b.com/
3. VOC AI-Powered Call Center App (Articence): React.js, MUI, WebSockets, Python. Live: https://demo.articence.com/
4. Dynamic Online Learning Platform (iLearning): React.js, Node.js, PostgreSQL. Live: https://production.aaisolutions.dev/login
5. Clinic Management Web & Mobile App: Next.js, React Native, Node.js, MySQL. Live: https://clinicmanagement.sitemanagershub.com/login
6. E-Commerce Web App: React.js, Python, PostgreSQL. Live: https://shop.gsgroup.co/login
7. E-Medicine Search & Buy App (MediSearch): React.js. Live: https://cappsule.vercel.app/

## Currently Building
- AI agents and workflow automation (Python + LangChain + Next.js)
- RAG-powered knowledge bases (FastAPI + Vector DB + Claude API)

Keep answers concise, friendly, and professional. Don't fabricate information not listed above.`;

// Simple in-memory rate limiter (per IP, resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // requests per window
const WINDOW_MS = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  let message: string;
  try {
    const body = await req.json();
    message = typeof body.message === "string" ? body.message.slice(0, 500) : "";
    if (!message) throw new Error("empty");
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        reply:
          "AI chat is not configured yet. Please reach out via the Contact form below — I'd love to hear from you! 🚀",
      },
      { status: 200 }
    );
  }

  try {
    const { Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: message }],
    });

    const reply =
      response.content[0]?.type === "text" ? response.content[0].text : "I couldn't generate a response.";

    return NextResponse.json({ reply }, { status: 200 });
  } catch (err) {
    console.error("Anthropic API error:", err);
    return NextResponse.json(
      {
        reply:
          "I'm having trouble right now. Please use the Contact form to reach Kishore directly!",
      },
      { status: 200 } // graceful fallback — don't expose 500 to client
    );
  }
}

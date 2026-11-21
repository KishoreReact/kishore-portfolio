import { NextRequest, NextResponse } from "next/server";

// System prompt grounded strictly in Kishore's resume and portfolio data
const SYSTEM_PROMPT = `You are Kishore's official AI Portfolio Assistant powered by Google Gemini.
Your purpose is to answer questions about Kishore C accurately, concisely, and professionally based on his resume and verified technical portfolio.

## Profile of Kishore C:
- Name: Kishore C
- Title: AI Full Stack Developer
- Location: Palakkad, Kerala, India
- Email: kishorekichan12@gmail.com | Phone: +91 9048898225
- Experience: 5+ Years in Full-Stack & AI Engineering
- Current Role: Senior Frontend Developer at Articence Inc (Aug 2024 – Present)
- GitHub: https://github.com/KishoreReact
- LinkedIn: https://www.linkedin.com/in/kishore-c-95742712a/

## Core Highlights & Metrics:
- 5+ Years Experience (Frontend-first engineer turned AI builder)
- 10+ Production Projects Shipped
- 3 AI-Powered Platforms in production
- 15+ Core Technologies mastered

## Work History:
1. Articence Inc (Aug 2024 – Present) | Senior Frontend Developer
   - Architected AI-powered call center platform with role-based access (admin, manager, user).
   - Real-time agent interaction using WebSockets, WebRTC, and LiveKit.
   - Integrated LLM-driven conversation analysis, sentiment tracking, and automated summaries.
   - Tech: React.js, MUI, WebSockets, Redux/Context, Python, AWS.
2. iLearningEngines (Aug 2021 – Apr 2024) | Frontend Developer
   - Multi-tenant e-learning platform serving thousands of students and enterprise clients.
   - Built student, teacher, and admin portals; contributed to Node.js + PostgreSQL backend for assessments, courses, and surveys.
   - Tech: React.js, TypeScript, Node.js, PostgreSQL, Figma.
3. Toplights Labels (Nov 2020 – Apr 2021) | Back Office Executive
   - Technical support and ReactJS label-selector tool cutting operational time by 40%.

## Featured AI & Full-Stack Projects:
1. GlobalReach — B2B Lead Discovery & Outreach CRM (Live: https://www.getyourclientsb2b.com/)
   - Enterprise B2B platform with PostGIS geo-filtering, Elasticsearch full-text search, Redis real-time pipeline, and FastAPI backend with Next.js 14.
2. AI Marketing Automation Platform (Live: https://growth.getyourclientsb2b.com/)
   - Autonomous multi-channel B2B marketing engine with FastAPI, Pydantic v2, SQLAlchemy 2.0, TanStack Query v5, and Recharts.
3. VOC AI Call Center (Live: https://demo.articence.com/)
   - Enterprise AI calling and speech analysis platform at Articence.
4. Dynamic Online Learning Platform (Live: https://production.aaisolutions.dev/login)
5. Clinic Management Web & Mobile App (Live: https://clinicmanagement.sitemanagershub.com/login)
6. E-Commerce Web App (Live: https://shop.gsgroup.co/login)
7. MediSearch E-Medicine App (Live: https://cappsule.vercel.app/)

## Tech Stack:
- Frontend: React.js, Next.js 14, TypeScript, Tailwind CSS, MUI, Redux, TanStack Query, Framer Motion, Three.js/R3F, React Native.
- Backend & DB: Python, FastAPI, Node.js, WebSockets, REST APIs, PostgreSQL, PostGIS, Redis, Elasticsearch, MySQL, MongoDB.
- AI & ML: Google Gemini, Anthropic Claude API, RAG Pipelines, AI Agents, Prompt Engineering, Guardrails, Evals.
- Real-time: WebRTC, LiveKit, VoIP, OAuth2, Azure MSAL.
- DevOps: Docker, AWS, Vercel, CI/CD, Linux.

## Guidelines:
- Keep responses friendly, crisp (2-4 sentences or short bullet points), and directly answering the question.
- Do not hallucinate or make up employment or credentials not in this prompt.
- Suggest checking out the Live Demos in the Projects section or booking a call if relevant!`;

// Smart local fallback if API key is not yet set or rate-limited
function getGroundedLocalResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("project") || q.includes("built") || q.includes("work")) {
    return "Kishore has shipped 10+ projects! Key featured AI platforms include:\n• GlobalReach: B2B Lead Discovery CRM with Next.js 14, FastAPI, PostGIS & Elasticsearch.\n• AI Marketing Automation Platform: Autonomous multi-channel growth engine.\n• VOC Call Center: Real-time AI agent & audio analysis built at Articence.\nCheck the Projects section for live demos!";
  }
  if (q.includes("skill") || q.includes("stack") || q.includes("tech")) {
    return "Kishore's core stack covers:\n• Frontend: Next.js 14, React, TypeScript, Tailwind CSS, Three.js\n• Backend & AI: Python, FastAPI, Google Gemini, Anthropic Claude, RAG, AI Agents\n• DB & Real-time: PostgreSQL, PostGIS, Redis, WebSockets, LiveKit, WebRTC\n• Cloud: Docker, AWS, Vercel.";
  }
  if (q.includes("experience") || q.includes("career") || q.includes("background") || q.includes("articence")) {
    return "Kishore has 5+ years of experience. He is currently Senior Frontend Developer at Articence Inc building an AI-powered call center with WebSockets and real-time agent workflows. Previously at iLearningEngines (enterprise e-learning platform with React & Node.js).";
  }
  if (q.includes("hire") || q.includes("available") || q.includes("contact") || q.includes("call")) {
    return "Yes! Kishore is available for high-impact AI full-stack roles and consulting. You can click 'Book a Call' in the navbar or reach him directly at kishorekichan12@gmail.com / +91 9048898225.";
  }
  return "Kishore C is an AI Full Stack Developer with 5+ years of experience building AI agents, RAG pipelines, real-time WebRTC/WebSocket platforms, and scalable Next.js/FastAPI apps. Feel free to ask about his specific projects, tech stack, or experience at Articence!";
}

// In-memory rate limiter (per IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // 20 requests per minute
const WINDOW_MS = 60 * 1000;

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
      { error: "Rate limit reached. Please wait a moment." },
      { status: 429 }
    );
  }

  let message: string;
  try {
    const body = await req.json();
    message = typeof body.message === "string" ? body.message.trim().slice(0, 600) : "";
    if (!message) throw new Error("Empty message");
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Support GEMINI_API_KEY or GOOGLE_API_KEY
  const geminiApiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (geminiApiKey) {
    const candidateModels = ["gemini-3.1-flash-lite", "gemini-3-flash-preview"];
    for (const model of candidateModels) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: SYSTEM_PROMPT }],
              },
              contents: [
                {
                  role: "user",
                  parts: [{ text: message }],
                },
              ],
              generationConfig: {
                maxOutputTokens: 600,
                temperature: 0.6,
              },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return NextResponse.json({ reply: text, model }, { status: 200 });
          }
        } else {
          console.warn(`Gemini API error with ${model} (status ${res.status}):`, await res.text());
        }
      } catch (err) {
        console.error(`Gemini fetch error with ${model}:`, err);
      }
    }
  }

  // Fallback to grounded local intelligence if no key or API error
  const fallbackReply = getGroundedLocalResponse(message);
  return NextResponse.json(
    {
      reply: fallbackReply,
      model: "grounded-resume-engine",
      note: geminiApiKey ? undefined : "Add GEMINI_API_KEY to .env.local for live Gemini responses",
    },
    { status: 200 }
  );
}

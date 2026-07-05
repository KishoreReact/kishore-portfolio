export const siteConfig = {
  name: "Kishore",
  fullName: "Kishore C",
  title: "Full Stack Developer",
  tagline: "Crafting beautiful, performant web experiences from pixel to server.",
  bio: "Hey! I'm based in Palakkad, Kerala, India. I'm a full stack developer with 4+ years of experience bringing ideas to life through clean, functional, and visually stunning code. Passionate about turning complex problems into elegant digital solutions.",
  location: "Palakkad, Kerala, India",
  phone: "+919048898225",
  yearsExperience: 4,
  projectsCompleted: 10,
  email: "kishorekichan12@gmail.com",
  profileImage: "/images/kishore.anime.jpg",

  // 3D Model - drop a .glb file in /public/models/ and set path here
  // Leave null to use the procedural WebGL mesh
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

  skills: [
    { name: "React", level: 95, category: "Frontend" },
    { name: "Next.js", level: 90, category: "Frontend" },
    { name: "TypeScript", level: 85, category: "Frontend" },
    { name: "Node.js", level: 88, category: "Backend" },
    { name: "Python", level: 80, category: "Backend" },
    { name: "PostgreSQL", level: 82, category: "Database" },
    { name: "MySQL", level: 78, category: "Database" },
    { name: "Three.js", level: 70, category: "Creative" },
    { name: "CSS/Tailwind", level: 92, category: "Frontend" },
    { name: "Docker", level: 65, category: "DevOps" },
    { name: "AWS", level: 60, category: "DevOps" },
    { name: "GraphQL", level: 72, category: "Backend" },
  ],
};

export type SiteConfig = typeof siteConfig;

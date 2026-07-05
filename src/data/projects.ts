export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string | string[];
  src: string;
  images: string[];
  demo: string;
  code: string;
  tags?: string[];
}

const projects: Project[] = [
  {
    id: 1,
    title: "iLearning",
    description:
      "Dynamic platform designed to enhance educational experiences through interactive and engaging content delivery.",
    technologies: "Javascript, React, Nodejs, PostgreSQL, HTML5, CSS",
    src: "/images/projectsImages/ile1.png",
    images: [
      "/images/projectsImages/ilelogin.png",
      "/images/projectsImages/ile1.png",
      "/images/projectsImages/ile2.png",
      "/images/projectsImages/ile3.png",
    ],
    demo: "https://aaisolutions.ai/",
    code: "https://github.com/KishoreReact",
    tags: ["React", "Node.js", "PostgreSQL"],
  },
  {
    id: 2,
    title: "Clinic Management",
    description:
      "Clinic management app streamlines operations by enabling seamless management of appointments, consultations, staff, and patient records across different user roles like managers, doctors, and patients.",
    technologies: "Javascript, NextJS, HTML, CSS, NodeJS, MySQL",
    src: "/images/projectsImages/clinic1.png",
    images: [
      "/images/projectsImages/cliniclogin.png",
      "/images/projectsImages/clinic1.png",
      "/images/projectsImages/clinic2.png",
    ],
    demo: "https://clinicmanagement.sitemanagershub.com/login",
    code: "https://github.com/diegotellezc/EasyShop",
    tags: ["Next.js", "MySQL", "Node.js"],
  },
  {
    id: 3,
    title: "Articence AI Calling",
    description:
      "A website that enables AI-powered calls to engage and assist customers efficiently.",
    technologies: "Javascript, HTML, CSS, CMS",
    src: "/images/projectsImages/temp1.png",
    images: [
      "/images/projectsImages/vocwebsite/vochome.png",
      "/images/projectsImages/vocwebsite/voc.phone.png",
      "/images/projectsImages/vocwebsite/voc.web.png",
      "/images/projectsImages/temp1.png",
      "/images/projectsImages/temp2.png",
      "/images/projectsImages/temp3.png",
    ],
    demo: "https://voccall.articence.com/",
    code: "https://github.com/diegotellezc/EasyShop",
    tags: ["AI", "CMS", "JavaScript"],
  },
  {
    id: 4,
    title: "VOC Articence",
    description:
      "Customized data based on your information, pre-configured dashboards and reports, customized templates and question banks, easy help and reference, AI Analysis.",
    technologies: "Javascript, React, HTML, CSS, Python, PostgreSQL",
    src: "/images/projectsImages/voc1.png",
    images: [
      "/images/projectsImages/voclogin.png",
      "/images/projectsImages/voc1.png",
      "/images/projectsImages/voccall.png",
    ],
    demo: "https://demo.articence.com/",
    code: "https://github.com/diegotellezc/EasyShop",
    tags: ["React", "Python", "AI"],
  },
  {
    id: 5,
    title: "Ecommerce Shopclues",
    description:
      "Browse a wide variety of food products, add your favorites to the wishlist, add items to the cart, and place orders seamlessly.",
    technologies: "JavaScript, React, HTML, CSS, Python, PostgreSQL",
    src: "/images/projectsImages/shopclues/shopLogin.jpeg",
    images: [
      "/images/projectsImages/shopclues/shopLogin.jpeg",
      "/images/projectsImages/shopclues/shopHome.jpeg",
      "/images/projectsImages/shopclues/shop.shop.jpeg",
      "/images/projectsImages/shopclues/shop.detail.jpeg",
      "/images/projectsImages/shopclues/shop.cart.jpeg",
      "/images/projectsImages/shopclues/shop.account.jpeg",
    ],
    demo: "https://shop.gsgroup.co/gsglogin.php",
    code: "https://github.com/diegotellezc/EasyShop",
    tags: ["React", "E-commerce", "Python"],
  },
  {
    id: 6,
    title: "MediSearch",
    description:
      "Medicine shopping with MediSearch. Browse, shop, and manage your healthcare needs effortlessly, anytime, anywhere.",
    technologies: "Javascript, React, HTML5, CSS",
    src: "/images/projectsImages/emedi.png",
    images: ["/images/projectsImages/emedi.png"],
    demo: "https://cappsule.vercel.app/",
    code: "https://github.com/diegotellezc/landing-accio-vocabulary",
    tags: ["React", "Healthcare", "API"],
  },
  {
    id: 7,
    title: "Movie Watchlists",
    description:
      "Browse movies and add them to watchlists and share them with friends.",
    technologies: "Javascript, React, HTML5, CSS3",
    src: "/images/projectsImages/movie1.png",
    images: ["/images/projectsImages/movie1.png"],
    demo: "https://authenticate-iota.vercel.app/",
    code: "https://github.com/diegotellezc/academloShop",
    tags: ["React", "Movies", "Social"],
  },
];

export default projects;

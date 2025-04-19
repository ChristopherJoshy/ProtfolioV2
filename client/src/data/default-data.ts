import { Profile, JourneyItem, Skill, Certificate, Project, TechStack } from "@/types";

export const defaultProfile: Profile = {
  id: "default",
  firstName: "Christopher",
  lastName: "Joshy",
  email: "christopherjoshy4@gmail.com",
  phone: "+918075809531",
  bio: "Passionate developer with experience in web development, game programming, and AI. Currently pursuing B.Tech in Computer Science at St. Joseph's College of Engineering and Technology, Palai.",
  location: "Puthenparambil (h), Ponga P.O, Nedumudy, Alappuzha, Kerala 688503",
  avatar: "/images/profile.jpg",
  resume: "/resume/christopher_joshy_resume.pdf",
  github: "https://github.com/ChristopherJoshy",
  linkedin: "https://www.linkedin.com/in/christopher-joshy-272a77290",
  instagram: "https://www.instagram.com/calculatederror",
  website: "",
  titles: ["Web Developer", "AI Integration Specialist", "Prompt Engineer"],
  stats: {
    visitors: 1589,
    githubStars: 15,
    githubCommits: 450,
    githubRepos: 40,
    projectsCompleted: 8
  }
};


export const defaultJourneyItems: JourneyItem[] = [
  {
    id: "journey-1",
    title: "Started Coding Journey",
    description: "Began learning programming fundamentals with Python and created my first applications. Developed a passion for problem-solving through code.",
    date: "2020",
    order: 1
  },
  {
    id: "journey-2",
    title: "Web Development Foundations",
    description: "Learned HTML, CSS, and JavaScript fundamentals. Built responsive websites and interactive web applications.",
    date: "2021",
    order: 2
  },
  {
    id: "journey-3",
    title: "Advanced Programming & Git",
    description: "Mastered version control with Git and GitHub. Developed projects using collaborative workflows and branching strategies.",
    date: "2022",
    order: 3
  },
  {
    id: "journey-4",
    title: "Cloud Computing & AWS",
    description: "Explored cloud services with AWS. Learned about serverless architectures, S3 storage, and EC2 instances for web application deployment.",
    date: "2023",
    order: 4
  },
  {
    id: "journey-5",
    title: "Game Development & AI",
    description: "Expanded into game development using C++ and Unreal Engine. Started exploring machine learning and AI concepts with Python libraries.",
    date: "2024",
    order: 5
  },
  {
    id: "journey-6",
    title: "Full-Stack Development",
    description: "Currently focusing on full-stack development with React, Node.js, and database technologies. Building complete web applications and services.",
    date: "2025",
    order: 6
  }
];

export const defaultSkills: Skill[] = [
  {
    id: "skill-1",
    name: "JavaScript",
    category: "programming",
    proficiency: 90,
    iconName: "fab fa-js",
    color: "#F7DF1E"
  },
  {
    id: "skill-2",
    name: "Java",
    category: "programming",
    proficiency: 85,
    iconName: "fab fa-java",
    color: "#007396"
  },
  {
    id: "skill-3",
    name: "HTML",
    category: "programming",
    proficiency: 85,
    iconName: "fab fa-html5",
    color: "#E34F26"
  },
  {
    id: "skill-4",
    name: "CSS",
    category: "programming",
    proficiency: 80,
    iconName: "fab fa-css3-alt",
    color: "#1572B6"
  },
  {
    id: "skill-5",
    name: "Python",
    category: "programming",
    proficiency: 75,
    iconName: "fab fa-python",
    color: "#3776AB"
  },
  {
    id: "skill-6",
    name: "C",
    category: "programming",
    proficiency: 70,
    iconName: "fas fa-code",
    color: "#A8B9CC"
  },
  {
    id: "skill-7",
    name: "React",
    category: "framework",
    proficiency: 85,
    iconName: "fab fa-react",
    color: "#61DAFB"
  },
  {
    id: "skill-8",
    name: "Node.js",
    category: "framework",
    proficiency: 80,
    iconName: "fab fa-node-js",
    color: "#339933"
  },
  {
    id: "skill-9",
    name: "Three.js",
    category: "framework",
    proficiency: 75,
    iconName: "fas fa-cube",
    color: "#000000"
  },
  {
    id: "skill-10",
    name: "Firebase",
    category: "framework",
    proficiency: 75,
    iconName: "fas fa-fire",
    color: "#FFCA28"
  },
  {
    id: "skill-11",
    name: "Express.js",
    category: "framework",
    proficiency: 70,
    iconName: "fas fa-server",
    color: "#000000"
  },
  {
    id: "skill-12",
    name: "Bootstrap",
    category: "framework",
    proficiency: 80,
    iconName: "fab fa-bootstrap",
    color: "#7952B3"
  },
  {
    id: "skill-13",
    name: "TailwindCSS",
    category: "framework",
    proficiency: 70,
    iconName: "fas fa-wind",
    color: "#06B6D4"
  },
  {
    id: "skill-14",
    name: "Git/GitHub",
    category: "tool",
    proficiency: 85,
    iconName: "fab fa-git-alt",
    color: "#F05032"
  },
  {
    id: "skill-15",
    name: "Prompt Engineering",
    category: "tool",
    proficiency: 90,
    iconName: "fas fa-robot",
    color: "#6E57E0"
  },
  {
    id: "skill-16",
    name: "GPT",
    category: "tool",
    proficiency: 85,
    iconName: "fas fa-brain",
    color: "#10A37F"
  },
  {
    id: "skill-17",
    name: "Claude",
    category: "tool",
    proficiency: 80,
    iconName: "fas fa-comment-dots",
    color: "#7F3FBF"
  },
  {
    id: "skill-18",
    name: "Grok",
    category: "tool",
    proficiency: 75,
    iconName: "fas fa-lightbulb",
    color: "#FF4785"
  },
  {
    id: "skill-19",
    name: "VS Code",
    category: "tool",
    proficiency: 85,
    iconName: "fas fa-code",
    color: "#007ACC"
  },
  {
    id: "skill-20",
    name: "Jupyter Notebook",
    category: "tool",
    proficiency: 70,
    iconName: "fas fa-book-open",
    color: "#F37626"
  }
];

// Tech stacks with icons and descriptions
export const defaultTechStacks: TechStack[] = [
  {
    name: "Web Development",
    icon: "fas fa-globe",
    color: "#6E57E0",
    category: "web",
    description: "HTML, CSS, JavaScript, React, Node.js, Bootstrap"
  },
  {
    name: "AI Integration",
    icon: "fas fa-brain",
    color: "#10A37F",
    category: "ai",
    description: "Google Gemini, OpenAI API, Firebase ML"
  },
  {
    name: "Prompt Engineering",
    icon: "fas fa-comment-dots",
    color: "#7F3FBF",
    category: "ai",
    description: "GPT-4, Claude, Grok, LLM Optimization"
  },
  {
    name: "3D Visualization",
    icon: "fas fa-cube",
    color: "#FF6B6B",
    category: "web",
    description: "Three.js, WebGL, JavaScript Animation"
  },
  {
    name: "Version Control",
    icon: "fas fa-code-branch",
    color: "#6E57E0",
    category: "tools",
    description: "Git, GitHub, Collaborative Development"
  },
  {
    name: "Cloud Services",
    icon: "fas fa-cloud",
    color: "#FF9F43",
    category: "tools",
    description: "Firebase, GitHub Pages, Web Hosting"
  }
];

// YouTube learning channels
export const defaultYoutubeChannels = [
  {
    name: "BroCodez",
    url: "https://youtube.com/@brocodez?si=gstwjXdFVz83oXk5"
  },
  {
    name: "Programming with Mosh",
    url: "https://youtube.com/@programmingwithmosh?si=ijsYoa8k7DsNy5kz"
  },
  {
    name: "Coding Academy",
    url: "https://youtube.com/@codingacademy2020?si=vSX7yqm0XHwcTmJW"
  },
  {
    name: "freeCodeCamp",
    url: "https://youtube.com/@freecodecamp?si=VJMod8EjPzGoRPnz"
  }
];

// Default projects data
export const defaultProjectsData: Project[] = [
  {
    id: "project-1",
    title: "KKNotesV2",
    description: "A premium resource hub for KTU Computer Science Engineering study materials, featuring high-quality notes and curated video tutorials.",
    thumbnailUrl: "/images/kknotes.png",
    projectUrl: "https://christopherjoshy.github.io/KKNotesV2",
    repoUrl: "https://github.com/ChristopherJoshy/KKNotesV2",
    category: "web",
    technologies: ["JavaScript", "HTML", "CSS", "Bootstrap"],
    featured: true,
    stars: 2,
    order: 1
  },
  {
    id: "project-2",
    title: "MaestraMind",
    description: "An AI-powered adaptive learning web application that transforms study notes into personalized learning experiences through Google's Gemini API.",
    thumbnailUrl: "/images/maestramind.png",
    projectUrl: "https://christopherjoshy.github.io/MaestraMind/",
    repoUrl: "https://github.com/ChristopherJoshy/MaestraMind",
    category: "ai",
    technologies: ["JavaScript", "HTML/CSS", "Firebase", "Google Gemini API"],
    featured: true,
    stars: 3,
    order: 2
  }
];

// Default certificates data
export const defaultCertificatesData: Certificate[] = [
  {
    id: "cert-1",
    title: "Applied Artificial Intelligence Workshop",
    issuer: "CareerLink",
    date: "January 25, 2025",
    description: "Participated in an intensive workshop covering AI fundamentals and applications.",
    imageUrl: "",
    certificateUrl: "",
    category: "AI Workshop",
    order: 1
  },
  {
    id: "cert-2",
    title: "24 Hour National-Level Gen.AI Online Hackathon",
    issuer: "CareerLink & amFOSS",
    date: "January 26, 2025",
    description: "Successfully completed a 24-hour hackathon focused on generative AI applications.",
    imageUrl: "",
    certificateUrl: "",
    category: "Hackathon",
    order: 2
  },
  {
    id: "cert-3",
    title: "Java Programming Fundamentals",
    issuer: "Wingspan",
    date: "November 7, 2024",
    description: "Completed comprehensive course on Java programming concepts and implementations.",
    imageUrl: "",
    certificateUrl: "",
    category: "Programming",
    order: 3
  },
  {
    id: "cert-4",
    title: "Data Structures & Algorithms in Python",
    issuer: "Wingspan",
    date: "November 6, 2024",
    description: "Mastered fundamental data structures implementation using Python.",
    imageUrl: "",
    certificateUrl: "",
    category: "Data Structures",
    order: 4
  },
  {
    id: "cert-5",
    title: "HACK-A-ADDICT Drug Combating Hackathon",
    issuer: "IEEE MACE SB & Lions Club",
    date: "January 18-19, 2025",
    description: "Participated in developing solutions for drug abuse prevention and awareness.",
    imageUrl: "",
    certificateUrl: "",
    category: "Social Impact",
    order: 5
  },
  {
    id: "cert-6",
    title: "Corporate Training Session",
    issuer: "CareerLink",
    date: "January 25, 2025",
    description: "Participated in professional development workshop covering industry-specific skills.",
    imageUrl: "",
    certificateUrl: "",
    category: "Corporate",
    order: 6
  }
];

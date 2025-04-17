export type Project = {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  tags: string[];
  demoLink?: string;
  sourceLink?: string;
  featured: boolean;
  category: 'web' | 'mobile' | 'ai' | 'backend' | 'other';
};

export const projects: Project[] = [
  {
    id: "novanest",
    title: "Novanest",
    description: "AI-powered platform connecting entrepreneurs with mentors and investors",
    fullDescription: "Novanest is a web-based platform designed to bridge the gap between entrepreneurs, mentors, and investors. It offers AI-powered business validation, smart mentor matchmaking, and a pitch deck showcase for funding opportunities. Entrepreneurs receive instant guidance via an AI chatbot, while mentors and investors can connect seamlessly. Built with React, Node.js, and MongoDB, Novanest ensures secure authentication and role-based dashboards. Unlike traditional networking platforms, it integrates AI-driven insights and real-time matchmaking, enhancing startup success. With features like direct messaging, industry filters, and dynamic dashboards, Novanest streamlines the startup journey, making networking, learning, and fundraising effortless for innovators.",
    image: "/images/projects/novanest.png",
    tags: ["React", "Node.js", "MongoDB", "AI Integration", "Authentication"],
    sourceLink: "https://github.com/NandaKishore2424/Novanest_AI_Incubation",
    featured: true,
    category: "web"
  },
  {
    id: "rs-chemtutor",
    title: "RS Chemtutor",
    description: "Modern chemistry tutoring platform for students preparing for NEET and JEE",
    fullDescription: "RSChemtutor is a modern, responsive React-based website designed for a specialized chemistry tutor, catering to students from grades VIII-XII, with a focus on NEET and JEE preparation. Built using React 19 and Tailwind CSS, the platform ensures an intuitive, mobile-friendly experience with smooth animations and interactive elements. It features a structured course showcase, student testimonials, and a seamless enrollment system with real-time form validation. SEO optimization enhances visibility, while deployment on Vercel ensures fast performance. With a chemistry-themed design, engaging UI, and efficient navigation, RSChemtutor offers an ideal online presence for high-quality tutoring services.",
    image: "/images/projects/chemtutor.png",
    tags: ["React 19", "Tailwind CSS", "Vercel", "Responsive Design", "SEO"],
    demoLink: "https://rs-chem-tutor.vercel.app/",
    featured: true,
    category: "web"
  },
  {
    id: "quiz-app",
    title: "Quiz Management Application",
    description: "Web platform for seamless quiz creation, participation and assessment",
    fullDescription: "The Quiz Management Application is a web-based platform designed for seamless quiz creation and participation. Users can sign up as Teachers or Students, with Teachers having the ability to create, edit, and manage quizzes, while Students can attempt quizzes, review scores, and compete on a leaderboard. The app supports multiple question types, automatic scoring, and detailed feedback. A question bank allows Teachers to store and reuse questions efficiently. With a responsive HTML, CSS, and JavaScript-based frontend, the platform ensures smooth navigation, interactive quizzes, and a time-bound challenge system, making learning more engaging and structured.",
    image: "/images/projects/novanest.png",
    tags: ["HTML", "CSS", "JavaScript", "Responsive Design", "User Authentication"],
    demoLink: "https://quiz-management-ruby.vercel.app/",
    featured: false,
    category: "web"
  },
  {
    id: "ecoroute",
    title: "Ecoroute AI",
    description: "AI-powered logistics optimization platform for sustainable supply chain management",
    fullDescription: "ECOROUTE AI is an AI-powered logistics optimization platform that enhances supply chain efficiency by minimizing fuel consumption, delays, and costs. It leverages real-time traffic data, vehicle capacity, and demand forecasts to generate the most efficient routes, reducing carbon footprints and improving delivery times. Integrated with IBM Z infrastructure, it ensures high performance, security, and scalability. The AI model, built using Python, scikit-learn, and TensorFlow, achieves a 0.989 R² score, offering precise traffic and distance predictions. With features like real-time decision-making and sustainability-driven routing, ECOROUTE AI transforms logistics into a smarter, eco-friendly, and cost-effective solution.",
    image: "/images/projects/chemtutor.png",
    tags: ["Python", "TensorFlow", "scikit-learn", "IBM Z", "AI/ML"],
    sourceLink: "https://github.com/NandaKishore2424/ECOROUTE_AI",
    featured: true,
    category: "ai"
  }
];
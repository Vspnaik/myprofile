import resumeImg from "@/assets/project-resume.jpg";
import faceImg from "@/assets/project-face.jpg";
import salesImg from "@/assets/project-sales.jpg";
import healthImg from "@/assets/project-health.jpg";
import docsImg from "@/assets/project-docs.jpg";

export const profile = {
  name: "Surya Prakash Vankudothu",
  initials: "SP",
  roles: [
    "AI Engineer",
    "Machine Learning Engineer",
    "Generative AI Developer",
  ],
  tagline:
    "I design and ship production AI systems — LLM applications, RAG pipelines, computer vision models and autonomous agents that solve real business problems.",
  email: "vankudothusuryaprakash@gmail.com",
  linkedin: "https://linkedin.com/in/surya-prakash-vankudothu-845484227/",
  github: "https://github.com/Vspnaik",
  leetcode: "https://leetcode.com/",
  location: "Hyderabad  , Telangana",
};

export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "responsibilities", label: "Responsibilities" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
];

export const focusAreas = [
  {
    title: "LLM Applications",
    body: "Production chat, extraction and reasoning systems built on OpenAI, Gemini and open-weight models.",
  },
  {
    title: "RAG Systems",
    body: "Hybrid retrieval, chunking strategy, re-ranking and evaluation over Milvus, FAISS and pgvector.",
  },
  {
    title: "AI Agents",
    body: "Stateful, tool-calling agents orchestrated with LangGraph and guarded by deterministic workflows.",
  },
  {
    title: "Computer Vision",
    body: "Detection, recognition and VLM fine-tuning with YOLO, DETR, InsightFace and Qwen2.5-VL.",
  },
  {
    title: "Machine Learning",
    body: "End-to-end modelling: feature engineering, training, evaluation and drift-aware monitoring.",
  },
];

export const experience = [
  {
    role: "AI Engineer",
    company: "Ayurzen Pharma Pvt Ltd",
    period: "Jan 2026 — July 2026",
    points: [
      "Developed an AI email automation agent for inbound query triage, drafting, and intelligent routing",
      "Built an AI-powered video generation tool to automate marketing content creation workflows",
      "Conducted extensive research and authored Detailed Project Reports (DPR) for the Pharma Hub project",
      "Designed and optimized the pharma sales website user interface and conversion flow",
      "Integrated Generative AI tools and internal dashboards to streamline business operations and sales",
    ],
  },
  {
    role: "LLM Trainer",
    company: "Deccan AI",
    period: "Nov 2025 — Present",
    points: [
      "Trained LLMs and evaluated outputs (Image, Video, Audio annotations) using RLHF, improving response quality, instruction adherence, and accuracy",
      "Applied rubric-based scoring to assess relevance, truthfulness, groundedness, and tool calling accessibility",
      "Performed detailed prompt analysis, fact-checking, and tool integration testing to minimize hallucinations",
      "Assessed complex prompts and multi-step reasoning chains, providing precise evaluations that improved overall model reliability",
    ],
  },
  {
    role: "Machine Learning Intern",
    company: "FastPix.io",
    period: "June 2025 — July 2025",
    points: [
      "Fine-tuned Qwen2.5-VL for domain-specific visual understanding",
      "Built computer vision models for production inference",
      "Shipped a face recognition system with embedding search",
      "Owned dataset preparation, cleaning and annotation pipelines",
      "Ran distributed model training experiments",
      "Designed evaluation harnesses and benchmark reporting",
    ],
  },
];


export const skillGroups = [
  {
    category: "Programming",
    skills: ["Python", "C++", "SQL"],
  },
  {
    category: "Machine Learning",
    skills: ["PyTorch", "TensorFlow", "Scikit-Learn", "XGBoost"],
  },
  {
    category: "Generative AI",
    skills: [
      "LangChain",
      "LangGraph",
      "LlamaIndex",
      "OpenAI API",
      "Hugging Face",
      "RAG",
      "Vector Databases",
      "Prompt Engineering",
    ],
  },
  {
    category: "Computer Vision",
    skills: ["OpenCV", "YOLO", "DETR", "InsightFace"],
  },
  {
    category: "Backend",
    skills: ["FastAPI", "Flask", "REST APIs"],
  },
  {
    category: "Database",
    skills: ["PostgreSQL", "MongoDB", "Milvus", "FAISS"],
  },
  {
    category: "Cloud & DevOps",
    skills: ["Docker", "Git", "GitHub", "AWS"],
  },
];


export type Project = {
  slug: string;
  title: string;
  description: string;
  image: string;
  category: "Generative AI" | "Computer Vision" | "Automation" | "Analytics";
  tech: string[];
  github: string;
  demo: string;
};

export const projects: Project[] = [
  {
    slug: "ai-powered-talent-scouting-agent",
    title: "AI-Powered Talent Scouting Agent",
    description:
      "An intelligent recruiting agent that ingests Job Descriptions, discovers matching candidates, simulates recruiter outreach, and returns a calibrated shortlist.",
    image: resumeImg,
    category: "Generative AI",
    tech: ["FastAPI", "Streamlit", "PostgreSQL/pgvector", "RRF Fusion", "Cross-Encoder", "Gemini 2.5 Flash", "Explainability"],
    github: "https://github.com/Vspnaik/",
    demo: "https://github.com/Vspnaik/",
  },
  {
    slug: "qwen-multimodal-face-recognition",
    title: "Qwen2.5-VL Multimodal Face & Audio AI",
    description:
      "Fine-tuned Qwen2.5-VL-32B with QLoRA on L40s GPUs for Indian celebrity face recognition, Whisper-large-v3 audio transcription, and Milvus vector RAG.",
    image: faceImg,
    category: "Computer Vision",
    tech: ["Qwen2.5-VL-32B", "QLoRA", "Buffalo-L", "Whisper-large-v3", "PyTorch/CUDA", "Milvus", "FastAPI"],
    github: "https://github.com/Vspnaik/",
    demo: "https://github.com/Vspnaik/",
  },
  {
    slug: "multi-branch-sales-analytics",
    title: "Multi-Branch Sales Analytics & BI Dashboard",
    description:
      "Full-stack retail intelligence platform across 5 branches (Hyderabad & AP) with real-time revenue, P&L profit tracking, tax audits, and salesperson leaderboards.",
    image: salesImg,
    category: "Analytics",
    tech: ["React 18", "TypeScript", "Node.js/Express", "PostgreSQL", "Recharts", "React Query", "Tailwind CSS"],
    github: "https://github.com/Vspnaik/",
    demo: "https://github.com/Vspnaik/",
  },

  {
    slug: "adaclip-denoising-anomaly-detection",
    title: "AdaCLIP-D: Hybrid Denoising Anomaly Detection",
    description:
      "A multi-stage hybrid denoising framework combining spatial U-Net restoration with in-ViT DnCNN modules for robust Zero-Shot Anomaly Detection under severe noise.",
    image: docsImg,
    category: "Computer Vision",
    tech: ["AdaCLIP", "U-Net Denoiser", "DnCNN Modules", "Polarized Self-Attention", "PyTorch", "MVTec AD / VisA"],
    github: "https://github.com/Vspnaik/",
    demo: "https://github.com/Vspnaik/",
  },
];

export const positions = [
  {
    role: "Overall Co-ordinator",
    organization: "Pixxel IITP",
    context: "Photography and film making club of IIT Patna",
  },
  {
    role: "Co-ordinator",
    organization: "Production Committee",
    context: "The Annual Cultural Fest ANWESHA, IIT Patna",
  },
  {
    role: "Co-ordinator and PoC",
    organization: "Events Committee",
    context: "INTER IIT Culturals 7.0, IIT Patna",
  },
  {
    role: "Co-ordinator",
    organization: "Flagship Events Committee",
    context: "Annual tech fest CELESTA",
  },
  {
    role: "Co-ordinator",
    organization: "Events Committee",
    context: "Annual sports fest INFINITO",
  },
];


export const achievements = [
  { label: "AI Projects Completed", value: 14, suffix: "+" },
  { label: "Internship Experience", value: 12, suffix: " mo" },
  { label: "Models Fine-tuned", value: 25, suffix: "+" },
  { label: "GitHub Repositories", value: 10, suffix: "+" },
  { label: "LeetCode Problems Solved", value: 150, suffix: "+" },
];

export const techStack = [
  "Python",
  "PyTorch",
  "LangChain",
  "LangGraph",
  "FastAPI",
  "Docker",
  "AWS",
  "GitHub",
  "OpenAI",
  "HuggingFace",
  "MongoDB",
  "PostgreSQL",
  "Redis",
  "Milvus",
  "FAISS",
];

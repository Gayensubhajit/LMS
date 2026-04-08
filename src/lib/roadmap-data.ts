import { Code2, Cpu, Database, Network, Rocket, ShieldAlert, Workflow, Microscope, Variable, Table, Eye, Package, Layers, Layout, Search, Globe, CheckCircle2, ChevronRight } from "lucide-react";

export const aiRoadmapData = [
  {
    month: "Step 1",
    title: "Programming Fundamentals (Python)",
    duration: "3-4 Weeks",
    description: "Start your journey by mastering Python, the most important language in the AI ecosystem.",
    icon: Code2,
    gradient: "from-blue-500 to-cyan-400",
    skills: ["Python", "Async IO", "Data Structures", "OOP", "Pip"],
    topics: [
      "1. Python Basics: Variables, Loops, Conditionals & Functions",
      "2. Data Structures: Lists, Dictionaries, Sets & Tuples",
      "3. Asynchronous Programming (Async/Await) for API handling",
      "4. Managing Environments (Venv/Conda) & Pip packages",
      "5. Object-Oriented Programming (OOP) for Model Architectures",
      "6. Git & GitHub: Version Control for Pro Developers"
    ]
  },
  {
    month: "Step 2",
    title: "Mathematics for AI",
    duration: "2-3 Weeks",
    description: "Build the theoretical core required to understand how models actually learn.",
    icon: Variable,
    gradient: "from-blue-600 to-indigo-500",
    skills: ["Linear Algebra", "Calculus", "Probability", "Statistics"],
    topics: [
      "1. Linear Algebra: Vectors, Matrices & Matrix Multiplications",
      "2. Calculus: Partial Derivatives & The Chain Rule for Backprop",
      "3. Optimization: Understanding Gradient Descent & Loss Functions",
      "4. Probability: Bayes Theorem & Distributions for sampling",
      "5. Statistics: Mean, Variance & Inferring patterns from data"
    ]
  },
  {
    month: "Step 3",
    title: "Machine Learning Basics",
    duration: "2 Weeks",
    description: "Understand the fundamental types of learning and classical algorithms.",
    icon: Database,
    gradient: "from-indigo-500 to-purple-500",
    skills: ["Supervised Learning", "Unsupervised Learning", "Linear Regression", "Trees"],
    topics: [
      "1. Supervised Learning: Classification vs Regression",
      "2. Unsupervised Learning: Clustering (K-Means) & PCA",
      "3. Classic Algorithms: Logistic Regression & Decision Trees",
      "4. Model Selection: Train-Test Splitting & Cross-Validation",
      "5. Performance Metrics: Precision, Recall, F1 & RMSE"
    ]
  },
  {
    month: "Step 4",
    title: "Data Handling & Engineering",
    duration: "2 Weeks",
    description: "Learn how to clean, manipulate, and prepare data for model consumption.",
    icon: Table,
    gradient: "from-purple-500 to-pink-500",
    skills: ["NumPy", "Pandas", "Data Cleaning", "SQL"],
    topics: [
      "1. NumPy: Vectors and Tensors manipulation",
      "2. Pandas: DataFrames, Filtering, Cleaning & Transformation",
      "3. Data Feature Engineering: Scaling & One-hot Encoding",
      "4. Handling Outliers & Imputing Missing Values",
      "5. SQL Basics: Querying Data for Model Training"
    ]
  },
  {
    month: "Step 5",
    title: "Deep Learning Concepts",
    duration: "3 Weeks",
    description: "Dive into neural architectures that mimic the human brain.",
    icon: Network,
    gradient: "from-pink-500 to-rose-500",
    skills: ["Neural Networks", "CNNs", "RNNs", "Transformers"],
    topics: [
      "1. ANN Architectures: Layers, Weights & Activation Functions",
      "2. CNNs: Convolution, Pooling & Learning Visual Patterns",
      "3. RNNs/LSTMs: Handling Time-Series and Sequential Data",
      "4. The Attention Mechanism: Why Transformers are SOTA",
      "5. Transfer Learning: Fine-tuning Pre-trained Vision/Text Models"
    ]
  },
  {
    month: "Step 6",
    title: "AI Frameworks",
    duration: "2 Weeks",
    description: "Master the industry-standard libraries used to build and train models.",
    icon: Package,
    gradient: "from-rose-500 to-orange-500",
    skills: ["PyTorch", "TensorFlow", "Scikit-Learn"],
    topics: [
      "1. PyTorch: Building Tensors and Dynamic Computation Graphs",
      "2. Scikit-Learn: Pipelines and Traditional Model Training",
      "3. Keras/TensorFlow: Sequential API for Rapid Prototyping",
      "4. Exporting Models: Saving Weights & ONNX formats",
      "5. GPU Acceleration: Using CUDA/MPS for Training"
    ]
  },
  {
    month: "Step 7",
    title: "NLP & Computer Vision Basics",
    duration: "2 Weeks",
    description: "Apply your skills to the world's two most popular AI domains.",
    icon: Eye,
    gradient: "from-orange-500 to-amber-500",
    skills: ["Tokenization", "Image Processing", "LLMs", "Stable Diffusion"],
    topics: [
      "1. Text Preprocessing: Tokenization & Word Embeddings",
      "2. Image Processing: Filters, Resizing & Augmentation",
      "3. Large Language Models: GPT & BERT Architectures",
      "4. Computer Vision Tasks: Object Detection & Segmentation",
      "5. Introduction to Diffusion and Generative AI"
    ]
  },
  {
    month: "Step 8",
    title: "Model Deployment",
    duration: "2 Weeks",
    description: "Move your models from notebooks to the real world using APIs.",
    icon: Rocket,
    gradient: "from-amber-500 to-yellow-500",
    skills: ["FastAPI", "REST APIs", "Inference", "Docker"],
    topics: [
      "1. FastAPI: Creating Production-Ready ML Endpoints",
      "2. Pydantic: Schema Validation for Input/Output Data",
      "3. Docker: Containerizing Models for Scalable Hosting",
      "4. Model Quantization for Fast CPU/Edge Inference",
      "5. API Authentication & Usage Rate Limiting"
    ]
  },
  {
    month: "Step 9",
    title: "MLOps",
    duration: "2 Weeks",
    description: "Learn how to manage the lifecycle of an AI model in a production environment.",
    icon: ShieldAlert,
    gradient: "from-yellow-500 to-lime-500",
    skills: ["Versioning", "Monitoring", "CI/CD", "Observability"],
    topics: [
      "1. Experiment Tracking: MLflow or Weights & Biases (W&B)",
      "2. Model Versioning & Registry workflows",
      "3. Monitoring: Checking for Model/Data Drift in Prod",
      "4. CI/CD for ML: Automated Testing of Model Logic",
      "5. Observability: Tracing prompts and costs with LangSmith"
    ]
  },
  {
    month: "Step 10",
    title: "Vector DBs & LLM Tools",
    duration: "2 Weeks",
    description: "Harness the power of RAG and Agents using modern LLM frameworks.",
    icon: Database,
    gradient: "from-lime-500 to-emerald-500",
    skills: ["Vector DBs", "LangChain", "RAG", "Agents"],
    topics: [
      "1. Vector DBs: Chroma or Qdrant for semantic storage",
      "2. RAG: Retrieval Augmented Generation pipelines",
      "3. LangChain/LangGraph for complex logic flows",
      "4. Tool Calling & Agent Loops for automation",
      "5. Effective Prompt Engineering & JSON Output schemas"
    ]
  },
  {
    month: "Step 11",
    title: "Build Real AI Projects",
    duration: "4-8 Weeks",
    description: "Consolidate your learning by building end-to-end production-ready applications.",
    icon: Workflow,
    gradient: "from-emerald-500 to-teal-500",
    skills: ["Portfolio", "Systems Design", "End-to-End Apps", "Capstone"],
    topics: [
      "1. Building a RAG-based Knowledge Base Chatbot",
      "2. Developing an Autonomous Multi-Agent Research Tool",
      "3. Real-time Vision/Audio Processing Application",
      "4. Fine-Tuning a small model (Llama 3) for a specific task",
      "5. Portfolio Site: Showcasing Github repos & Demos"
    ]
  },
  {
    month: "Step 12",
    title: "Stay Updated & Research",
    duration: "Ongoing",
    description: "The field moves fast. Learn how to keep up with the latest breakthroughs.",
    icon: Microscope,
    gradient: "from-teal-500 to-blue-500",
    skills: ["Research", "Best Practices", "Arxiv", "Ethics"],
    topics: [
      "1. Reading Arxiv Papers: Spotting SOTA Trends",
      "2. Following AI labs: OpenAI, DeepMind, Anthropic blogs",
      "3. Responsible AI: Safety, Bias & Ethical Scaling",
      "4. Joining AI Communities: Kaggle, HF, Discord",
      "5. Becoming a Contributor: Open Source & Research"
    ]
  }
];

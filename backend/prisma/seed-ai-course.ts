import { PrismaClient, CourseLevel } from "@prisma/client";

const prisma = new PrismaClient();

const aiRoadmapData = [
  {
    month: "Step 1",
    title: "Programming Fundamentals (Python)",
    topics: ["Python Basics", "Data Structures", "Async Programming", "Git & GitHub"]
  },
  {
    month: "Step 2",
    title: "Mathematics for AI",
    topics: ["Linear Algebra", "Calculus", "Probability & Statistics"]
  },
  {
    month: "Step 3",
    title: "Machine Learning Basics",
    topics: ["Supervised Learning", "Unsupervised Learning", "Classic Algorithms"]
  },
  {
    month: "Step 4",
    title: "Data Handling & Engineering",
    topics: ["NumPy", "Pandas", "Feature Engineering", "SQL Basics"]
  },
  {
    month: "Step 5",
    title: "Deep Learning Concepts",
    topics: ["ANN Architectures", "CNNs", "RNNs/LSTMs", "Transformers"]
  },
  {
    month: "Step 6",
    title: "AI Frameworks",
    topics: ["PyTorch", "Scikit-Learn", "Keras/TensorFlow"]
  },
  {
    month: "Step 7",
    title: "NLP & Computer Vision Basics",
    topics: ["Text Preprocessing", "Image Processing", "Computer Vision Tasks"]
  },
  {
    month: "Step 8",
    title: "Model Deployment",
    topics: ["FastAPI", "Docker", "Model Quantization"]
  },
  {
    month: "Step 9",
    title: "MLOps",
    topics: ["Experiment Tracking", "Monitoring", "CI/CD for ML"]
  },
  {
    month: "Step 10",
    title: "Vector DBs & LLM Tools",
    topics: ["Vector DBs", "RAG", "LangChain/LangGraph"]
  },
  {
    month: "Step 11",
    title: "Build Real AI Projects",
    topics: ["Building a Chatbot", "Developing an Agent", "Fine-Tuning"]
  },
  {
    month: "Step 12",
    title: "Stay Updated & Research",
    topics: ["Reading Arxiv Papers", "Responsible AI", "Joining AI Communities"]
  }
];

async function seed() {
  console.log("Seeding AI Engineering Roadmap Course...");
  const courseSlug = "ai-engineering-roadmap";

  const course = await prisma.course.upsert({
    where: { slug: courseSlug },
    update: {
       title: "Complete AI Engineering (Exclusive)",
       shortDescription: "Complete the 12-step path from Programmer to AI Engineer. Free and Exclusive.",
       longDescription: "A fully comprehensive, exclusive AI Engineering course mapping directly to the 12-step roadmap.",
       isFree: true,
       isPublished: true,
       category: "AI/ML",
       level: CourseLevel.ALL_LEVELS,
    },
    create: {
       slug: courseSlug,
       title: "Complete AI Engineering (Exclusive)",
       shortDescription: "Complete the 12-step path from Programmer to AI Engineer. Free and Exclusive.",
       longDescription: "A fully comprehensive, exclusive AI Engineering course mapping directly to the 12-step roadmap.",
       category: "AI/ML",
       level: CourseLevel.ALL_LEVELS,
       instructorName: "EduNova AI Experts",
       oneMonthPrice: 0,
       threeMonthPrice: 0,
       sixMonthPrice: 0,
       isFree: true,
       isPublished: true,
    }
  });

  let position = 0;
  for (const step of aiRoadmapData) {
    const sectionTitle = `${step.month}: ${step.title}`;
    let section = await prisma.courseSection.findFirst({
      where: { courseId: course.id, title: sectionTitle }
    });

    if (!section) {
      section = await prisma.courseSection.create({
        data: { courseId: course.id, title: sectionTitle, position: position }
      });
    } else {
       await prisma.courseSection.update({
          where: { id: section.id },
          data: { position }
       });
    }

    let lessonPos = 0;
    for (const topic of step.topics) {
      const fallbackVideo = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
      const existingLesson = await prisma.lesson.findFirst({
         where: { sectionId: section.id, title: topic }
      });

      if (!existingLesson) {
         await prisma.lesson.create({
            data: {
               sectionId: section.id,
               title: topic,
               description: "Master this fundamental AI engineering topic.",
               videoUrl: fallbackVideo,
               durationMins: 15,
               position: lessonPos,
               isPreview: true, 
            }
         });
      }
      lessonPos++;
    }
    position++;
  }
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

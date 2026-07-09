import { PrismaClient, QuestionType, Difficulty } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create a Category
  const category = await prisma.category.upsert({
    where: { slug: "general-tech" },
    update: {},
    create: {
      name: "General Technology",
      slug: "general-tech",
      description: "Fundamental technology questions",
    },
  });

  // 2. Create 5 Questions
  const questionsData = [
    {
      title: "Implement a Debounce Function",
      slug: "debounce-fn",
      description: "Create a function that delays execution until after a certain wait time.",
      type: QuestionType.CODING,
      difficulty: Difficulty.MEDIUM,
      categoryId: category.id,
      content: { markdown: "Implement a `debounce` function...", testCases: [] },
    },
    {
      title: "Explain Event Delegation",
      slug: "event-delegation",
      description: "What is event delegation and how does it work in the DOM?",
      type: QuestionType.THEORY,
      difficulty: Difficulty.EASY,
      categoryId: category.id,
    },
    {
      title: "Reverse a Binary Tree",
      slug: "reverse-binary-tree",
      description: "Write an algorithm to invert a binary tree structure.",
      type: QuestionType.CODING,
      difficulty: Difficulty.HARD,
      categoryId: category.id,
      content: { markdown: "Invert the given binary tree...", testCases: [] },
    },
    {
      title: "Design a Notification System",
      slug: "notification-system",
      description: "How would you design a scalable real-time notification system?",
      type: QuestionType.INTERVIEW,
      difficulty: Difficulty.HARD,
      categoryId: category.id,
    },
    {
      title: "React Lifecycle Hooks",
      slug: "react-lifecycle",
      description: "Compare useEffect with class component lifecycle methods.",
      type: QuestionType.THEORY,
      difficulty: Difficulty.MEDIUM,
      categoryId: category.id,
    },
  ];

  for (const q of questionsData) {
    await prisma.question.upsert({
      where: { slug: q.slug },
      update: {},
      create: q,
    });
  }

  // 3. Create 5 Mock Tests
  const createdQuestions = await prisma.question.findMany({
    take: 5,
  });

  const testsData = [
    {
      title: "Full-Stack Developer Challenge",
      description: "A comprehensive test covering React, Node.js, and SQL.",
      duration: 90,
      questions: {
        connect: createdQuestions.slice(0, 5).map((q) => ({ id: q.id })),
      },
    },
    {
      title: "Frontend Performance Mastery",
      description: "Optimize rendering, asset loading, and runtime performance.",
      duration: 45,
      questions: {
        connect: createdQuestions.slice(0, 3).map((q) => ({ id: q.id })),
      },
    },
    {
      title: "Data Structures & Algorithms",
      description: "Focus on complexity analysis and efficient problem solving.",
      duration: 60,
      questions: {
        connect: createdQuestions.slice(2, 5).map((q) => ({ id: q.id })),
      },
    },
    {
      title: "System Design Fundamentals",
      description: "Scalability, availability, and distributed systems architecture.",
      duration: 120,
      questions: {
        connect: [createdQuestions[3]].map((q) => ({ id: q.id })),
      },
    },
    {
      title: "Behavioral Interview Prep",
      description: "Soft skills and culture fit evaluation for senior roles.",
      duration: 30,
      questions: {
        connect: createdQuestions.map((q) => ({ id: q.id })),
      },
    },
  ];

  for (const t of testsData) {
    // We can't upsert easily on title for MockTest as it's not unique in schema, 
    // but for seeding we can just check if any exist or just create.
    const existing = await prisma.mockTest.findFirst({ where: { title: t.title } });
    if (!existing) {
      await prisma.mockTest.create({
        data: t,
      });
    }
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

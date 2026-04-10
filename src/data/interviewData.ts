export const interviewCategories = [
  {
    id: "technical",
    title: "Technical Interview",
    description: "Deep dive into DSA, System Design, and Core Fundamentals.",
    icon: "Code2",
    topics: [
      {
        name: "Data Structures & Algorithms",
        questions: [
          { q: "Explain the difference between a Linked List and an Array.", a: "Arrays have fixed size and O(1) access time, but Linked Lists have dynamic size and O(n) access time. Insertion/Deletion in Linked List is O(1) if head is known, while Array requires O(n) shifting." },
          { q: "What is a sliding window and when to use it?", a: "Sliding window is a technique used to solve problems involving arrays or lists by maintaining a subset of elements. Use it when searching for a sub-range that meets certain criteria (e.g., longest substring without repeating characters)." }
        ]
      },
      {
        name: "Frontend Development",
        questions: [
          { q: "What is the Virtual DOM in React?", a: "A lightweight representation of the actual DOM. React uses it to calculate differences (reconciliation) and update only the necessary parts of the real DOM, improving performance." },
          { q: "Explain CSS Box Model.", a: "Every HTML element is considered a box. It consists of: Margins, Borders, Padding, and the actual Content." }
        ]
      }
    ]
  },
  {
    id: "hr",
    title: "HR & Behavioral",
    description: "Prepare for situational questions and soft skills.",
    icon: "Users",
    topics: [
      {
        name: "Common Questions",
        questions: [
          { q: "Tell me about yourself.", a: "Focus on your professional journey, key achievements, and why you are interested in this role. Keep it concise (2-3 minutes)." },
          { q: "What is your greatest weakness?", a: "Mention a real weakness but explain how you are working to improve it. For example, 'I used to struggle with public speaking, but I've recently joined a Toastmasters club'." }
        ]
      }
    ]
  },
  {
    id: "system-design",
    title: "System Design",
    description: "Learn how to design scalable architectures.",
    icon: "Layout",
    topics: [
      {
        name: "Architecture",
        questions: [
          { q: "What is Load Balancing?", a: "Directing incoming network traffic across multiple servers to ensure no single server becomes overwhelmed, improving reliability and performance." },
          { q: "Explain SQL vs NoSQL.", a: "SQL is relational, structured, and uses predefined schemas (e.g., PostgreSQL). NoSQL is non-relational, flexible, and can be document-based, key-value, etc. (e.g., MongoDB)." }
        ]
      }
    ]
  }
];

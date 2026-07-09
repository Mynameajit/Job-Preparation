/**
 * Mock data for the Testing Hub.
 * Includes categorized assessments for Aptitude, DSA, and Reasoning.
 */

export interface MockTest {
  id: string;
  title: string;
  category: "Aptitude" | "DSA" | "Reasoning";
  questions: number;
  duration: number; // in minutes
  difficulty: "Easy" | "Medium" | "Hard";
  rating: number;
  attempts: number;
  description: string;
}

export const mockTests: MockTest[] = [
  // Trending Tests
  {
    id: "aptitude-1",
    title: "General Aptitude Master",
    category: "Aptitude",
    questions: 25,
    duration: 30,
    difficulty: "Medium",
    rating: 4.8,
    attempts: 1240,
    description: "Master arithmetic, ratios, and percentages common in tech interviews."
  },
  {
    id: "dsa-core-1",
    title: "DSA Fundamentals: Arrays",
    category: "DSA",
    questions: 15,
    duration: 45,
    difficulty: "Hard",
    rating: 4.9,
    attempts: 850,
    description: "Deep dive into array manipulation and two-pointer techniques."
  },
  
  // Recommended
  {
    id: "reasoning-1",
    title: "Logical Reasoning Pro",
    category: "Reasoning",
    questions: 30,
    duration: 40,
    difficulty: "Medium",
    rating: 4.7,
    attempts: 620,
    description: "Challenge your logic with syllogisms, blood relations, and puzzles."
  },
  {
    id: "aptitude-2",
    title: "Fast Calculation Tricks",
    category: "Aptitude",
    questions: 20,
    duration: 15,
    difficulty: "Easy",
    rating: 4.6,
    attempts: 2100,
    description: "Quick mental math exercises to save time during high-pressure tests."
  },

  // Latest Assessments
  {
    id: "dsa-advanced-1",
    title: "System Design Essentials",
    category: "DSA",
    questions: 10,
    duration: 60,
    difficulty: "Hard",
    rating: 4.9,
    attempts: 340,
    description: "Basic distributed systems and architecture questions for seniors."
  },
  {
    id: "reasoning-2",
    title: "Verbal Ability Quiz",
    category: "Reasoning",
    questions: 25,
    duration: 20,
    difficulty: "Easy",
    rating: 4.5,
    attempts: 980,
    description: "Enhance your communication skills with grammar and comprehension."
  }
];

/**
 * Individual test questions for the assessment workspace.
 */
export const testQuestions: Record<string, any[]> = {
  "aptitude-1": [
    {
      id: 1,
      question: "If A and B can do a piece of work in 12 days, B and C in 15 days, and C and A in 20 days, how many days will A alone take to finish the work?",
      options: ["20 days", "24 days", "30 days", "40 days"],
      answer: 2
    },
    {
      id: 2,
      question: "Find the missing number in the series: 7, 10, 8, 11, 9, 12, ...",
      options: ["7", "10", "12", "13"],
      answer: 1
    },
    {
      id: 3,
      question: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
      options: ["120 metres", "180 metres", "324 metres", "150 metres"],
      answer: 3
    }
  ]
};

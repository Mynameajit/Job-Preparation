export type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  college?: string;
  location?: string;
  avatar?: string;
  phone?: string;
  skills?: string[];
  stats?: {
    totalTests: number;
    avgScore: number;
    highestScore: number;
    questionsSolved: number;
  };
  recentResults?: {
    title: string;
    score: number;
    date: string;
  }[];
};
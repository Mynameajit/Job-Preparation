export type TestCase = {
  input: string;
  output: string;
};

export type Problem = {
  _id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";

  companies?: string[];

  // ✅ FIXED
  testCases?: TestCase[];
  constraints?: string;
};
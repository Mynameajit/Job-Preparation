import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchQuestion, fetchSingleQuestion } from "./questionService";


// ✅ TYPES FIXED

export type TestCase = {
  input: string;
  output: string;
};

export type Problem = {
  _id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;

  acceptance: string; // ❌ String → ✅ string
  companies: string[]; // ❌ [String] → ✅ string[]

  // ✅ ADD THESE (IMPORTANT)
  testCases?: TestCase[];
  constraints?: string | string[];
};


// ✅ STATE TYPES

type LoadingState = {
  create: boolean;
  get: boolean;
  update: boolean;
  delete: boolean;
};

type QuestionState = {
  questions: Problem[];
  singleQuestion: Problem | null;
  stars: number | null;
  loading: LoadingState;
  lastFetched: boolean;
  totalPages: number; // ❌ Number → ✅ number
};


// ✅ INITIAL STATE

const initialState: QuestionState = {
  questions: [],
  singleQuestion: null,
  totalPages: 1,
  stars: null,
  loading: {
    create: false,
    get: false,
    update: false,
    delete: false,
  },
  lastFetched: false,
};


// ✅ SLICE

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    clearQuestions: (state) => {
      state.questions = [];
    },
  },
  extraReducers: (builder) => {
    builder

      // 🔥 GET ALL QUESTIONS
      .addCase(fetchQuestion.pending, (state) => {
        state.loading.get = true;
      })
      .addCase(fetchQuestion.fulfilled, (state, action) => {
        state.loading.get = false;

        state.totalPages = action.payload?.data?.totalPages ?? 1;
        state.stars = action.payload?.data?.stars ?? null;
        state.questions = action.payload?.data?.questions ?? [];

        state.lastFetched = true;
      })
      .addCase(fetchQuestion.rejected, (state) => {
        state.loading.get = false;
      })


      // 🔥 GET SINGLE QUESTION
      .addCase(fetchSingleQuestion.pending, (state) => {
        state.loading.get = true;
      })
      .addCase(fetchSingleQuestion.fulfilled, (state, action) => {
        state.loading.get = false;

        state.singleQuestion = action.payload?.data ?? null;
      })
      .addCase(fetchSingleQuestion.rejected, (state) => {
        state.loading.get = false;
      });
  },
});

export const { clearQuestions } = questionSlice.actions;
export default questionSlice.reducer;
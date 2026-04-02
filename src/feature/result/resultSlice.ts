import { createSlice } from "@reduxjs/toolkit";
import { fetchResults, fetchSingleResult, submitTest } from "./resultService";
import { fetchSingleTest, fetchTest } from "../test/testService";





// 🔥 Question Type
export type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

export type Test = {
  _id: string;
  title: string;
  questions: Question[];
};

// 🔥 Result Type
export type Result = {
  _id: string;

  userId: string; // ✅ simple string

  testId: Test;   // ✅ populated object

  answers: Record<string, string>; // { "0": "A" }

  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeTaken: number;

  status: "completed" | "in-progress";
  createdAt?: string;
};

type LoadingState = {
  submit: boolean;
  getAll: boolean;
  getSingle: boolean;
};

type ResultState = {
  results: Result[];
  singleResult: Result | null;
  loading: LoadingState;
  error: string | null;
};

const initialState: ResultState = {
  results: [],
  singleResult: null,
  loading: {
    submit: false,
    getAll: false,
    getSingle: false,
  },
  error: null,
};

const resultSlice = createSlice({
  name: "result",
  initialState,
  reducers: {
    clearSingleResult: (state) => {
      state.singleResult = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // 🔥 SUBMIT TEST
      .addCase(submitTest.pending, (state) => {
        state.loading.submit = true;
      })
      .addCase(submitTest.fulfilled, (state, action) => {
        state.loading.submit = false;

        const newResult = action.payload?.data;

        if (newResult) {
          state.results.push(newResult);
          state.singleResult = newResult;
        }
      })
      .addCase(submitTest.rejected, (state, action) => {
        state.loading.submit = false;
        state.error = action.payload as string;
      })

      // 🔹 GET USER RESULTS
      .addCase(fetchResults.pending, (state) => {
        state.loading.getAll = true;
      })
      .addCase(fetchResults.fulfilled, (state, action) => {
        state.loading.getAll = false;
        state.results = action.payload?.data || [];
      })
      .addCase(fetchResults.rejected, (state, action) => {
        state.loading.getAll = false;
        state.error = action.payload as string;
      })

      // 🔹 GET SINGLE RESULT
      .addCase(fetchSingleResult.pending, (state) => {
        state.loading.getSingle = true;
      })
      .addCase(fetchSingleResult.fulfilled, (state, action) => {
        state.loading.getSingle = false;
        state.singleResult = action.payload?.data || null;
      })
      .addCase(fetchSingleResult.rejected, (state, action) => {
        state.loading.getSingle = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSingleResult } = resultSlice.actions;
export default resultSlice.reducer;
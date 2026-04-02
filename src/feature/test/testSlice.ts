import { createSlice } from "@reduxjs/toolkit";
import { fetchTest, fetchSingleTest } from "./testService";

export type Test = {
  _id: string;
  title: string;
  description?: string;
  duration: number;
  totalMarks: number;
  questions: any[]; // later type define kar lena
};

type LoadingState = {
  getAll: boolean;
  getSingle: boolean;
};

type TestState = {
  tests: Test[];
  singleTest: Test | null;
  loading: LoadingState;
  error: string | null;
  lastFetched: boolean;
};

const initialState: TestState = {
  tests: [],
  singleTest: null,
  loading: {
    getAll: false,
    getSingle: false,
  },
  error: null,
  lastFetched: false,
};

const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    clearSingleTest: (state) => {
      state.singleTest = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // 🔹 GET ALL TESTS
      .addCase(fetchTest.pending, (state) => {
        state.loading.getAll = true;
        state.error = null;
      })
      .addCase(fetchTest.fulfilled, (state, action) => {
        state.loading.getAll = false;
        state.tests = action.payload?.data || [];
        state.lastFetched = true;
      })
      .addCase(fetchTest.rejected, (state, action) => {
        state.loading.getAll = false;
        state.error = action.error.message || "Failed to fetch tests";
      })

      // 🔹 GET SINGLE TEST
      .addCase(fetchSingleTest.pending, (state) => {
        state.loading.getSingle = true;
        state.error = null;
      })
      .addCase(fetchSingleTest.fulfilled, (state, action) => {
        state.loading.getSingle = false;
        state.singleTest = action.payload?.data || null;
      })
      .addCase(fetchSingleTest.rejected, (state, action) => {
        state.loading.getSingle = false;
        state.error = action.error.message || "Failed to fetch test";
      });
  },
});

export const { clearSingleTest } = testSlice.actions;
export default testSlice.reducer;
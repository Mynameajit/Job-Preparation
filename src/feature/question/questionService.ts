import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";


export const fetchQuestion = createAsyncThunk(
  "user/fetchQuestion",
  async (params: any, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();

      const res = await api.get(`/api/questions?${query}`);

      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch questions"
      );
    }
  }
);

//   ============== GET Question ============
export const fetchSingleQuestion = createAsyncThunk(
    "user/fetchSingleQuestion",
    async (id: string, { rejectWithValue }) => {
        try {
            const res = await api.get(`/api/questions/${id}`);
            return res.data
        } catch (error: any) {

            return rejectWithValue(error.response?.data?.message || "Failed to fetch user")
        }
    }
)

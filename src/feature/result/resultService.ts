import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";
import { toast } from "sonner";


export const fetchResults = createAsyncThunk(
    "Result/fetchResults",
    async (_, { rejectWithValue }) => {
        try {

            const res = await api.get("/api/result")

            return res.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch results"
            );
        }
    }
);

//   ============== GET single Test ============
export const fetchSingleResult = createAsyncThunk(
    "Result/fetchSingleResult",
    async (id: string, { rejectWithValue }) => {
        try {
            const res = await api.get(`/api/result/${id}`);
            return res.data
        } catch (error: any) {

            return rejectWithValue(error.response?.data?.message || "Failed to fetch result")
        }
    }
)

// ========== submit test ==========
export const submitTest = createAsyncThunk(
    "test/submitTest",
    async (
        data: {
            testId: string;
            answers: Record<number, string>;
            timeTaken: number;
            userId?: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const res = await api.post("/api/test/submit", data); // ✅ POST
            if (res.data.success) {
                toast.success(res.data.message)
            }
            return res.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to submit test"
            );
        }
    }
);
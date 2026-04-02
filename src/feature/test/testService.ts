import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";
import { toast } from "sonner";


export const fetchTest = createAsyncThunk(
    "Test/fetchTest",
    async (_, { rejectWithValue }) => {
        try {

            const res = await api.get(`/api/test`);

            return res.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch test"
            );
        }
    }
);

//   ============== GET single Test ============
export const fetchSingleTest = createAsyncThunk(
    "Test/fetchSingleTest",
    async (id: string, { rejectWithValue }) => {
        try {
            const res = await api.get(`/api/test/${id}`);
            return res.data
        } catch (error: any) {

            return rejectWithValue(error.response?.data?.message || "Failed to fetch test")
        }
    }
)




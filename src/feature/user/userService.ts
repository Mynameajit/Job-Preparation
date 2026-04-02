import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import api from "../api";

// ==================== get User ===================

export const fetchUser = createAsyncThunk(
    "user/fetchUser",
    async (_, { rejectWithValue }) => {
        try {

            const res = await api.get("/api/auth/me");
            return res.data
        } catch (error: any) {

            return rejectWithValue(error.response?.data?.message || "Failed to fetch user")
        }
    }
)

// ==================== Login User ===================

type LoginPayload = {
    email: string
    password: string
}

export const loginUser = createAsyncThunk(
    "user/loginUser",
    async (data: LoginPayload, { rejectWithValue }) => {
        try {

            const res = await api.post("/api/auth/login", data)
            if (res.data.success) {
                toast.success("login success", { position: "top-center" })

            } else {
                toast.error("login success", { position: "top-center" })

            }
            return res.data

        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to fetch user"
            console.log(message)
            return rejectWithValue(message)

        }
    }
)


// ==================== Register User ===================

type RegisterPayload = {
    name: String
    email: string
    password: string
}

export const registerUser = createAsyncThunk(
    "user/registerUser",
    async (data: RegisterPayload, { rejectWithValue }) => {
        try {

            const res = await api.post("/api/auth/register", data)
            if (res?.data?.success) {
                toast.success(res.data.message, { position: "top-center" })

            } else {
                toast.error(res?.data?.message, { position: "top-center" })

            }
            return res.data

        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to fetch user"
            console.log(message)
            return rejectWithValue(message)

        }
    }
)

// ==================== logout User ===================

export const logoutUser = createAsyncThunk(
    "user/logoutUser",
    async (_, { rejectWithValue }) => {
        try {

            const res = await api.post("/api/auth/logout");
            if (res?.data?.success) {
                toast.success(res.data.message, { position: "top-center" })

            }
            return res.data
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to fetch user"
            console.log(message)
            return rejectWithValue(message)

        }
    }
)
